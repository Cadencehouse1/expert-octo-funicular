# Agency Platform — Phase 1: Job Board + ATS

The hiring platform for a premium childcare and household staffing agency.
This is **Phase 1** of a phased build: a public job board with role-specific
application intake, plus a private admin panel for managing postings and
moving candidates through a placement pipeline.

Later phases will add client/candidate portals, document storage,
e-signature, and background-check integration on top of this foundation.

## What's included

**Public (embeds into your WordPress site)**

- `/` — job board with filters for the four role types: Nanny, Newborn Care
  Specialist, Personal Assistant, Rotational Nanny
- `/jobs/<slug>` — full job posting with an Apply button
- `/apply` — application form (general, or tied to a specific job via
  `/apply?job=<slug>`), with PDF/Word resume upload (max 5 MB)
- `/embed/jobs` — chrome-free job list designed for an `<iframe>` embed

**Admin (`/admin`, password protected)**

- Dashboard with pipeline counts and recent applications
- Applications list with stage + role filters
- Candidate detail: contact info, resume download, free-form notes, and
  pipeline stage (New → Screening → Interview → Reference Check →
  Background Check → Placed / Rejected)
- Job management: create, edit, mark Filled or Archived

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://prisma.io) ORM + PostgreSQL
- Resumes are stored in the database (fine at agency volume; move to object
  storage if files grow)
- Admin auth: single admin credential from env vars, signed JWT session
  cookie ([jose](https://github.com/panva/jose))

## Local development

```bash
npm install
cp .env.example .env       # then fill in values (see below)
npx prisma migrate dev     # applies migrations to your Postgres db
npm run db:seed            # optional: 4 sample job postings
npm run dev                # http://localhost:3000
```

`.env` values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | A PostgreSQL connection string (local Postgres or a free [Neon](https://neon.tech) database) |
| `SESSION_SECRET` | ≥32 chars; generate with `openssl rand -hex 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Login for `/admin` |
| `NEXT_PUBLIC_AGENCY_NAME` | Agency name shown across the UI (defaults to Cadence House) |

## Deploying (Vercel + Neon Postgres, free tier)

1. Import this repo into [Vercel](https://vercel.com/new) (sign in with
   GitHub and select the repository).
2. In the Vercel project: **Storage → Create Database → Neon (Postgres)**.
   This provisions the database and sets `DATABASE_URL` automatically.
3. In **Settings → Environment Variables**, add `SESSION_SECRET`,
   `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Deploy. The `vercel-build` script runs database migrations
   automatically on every deploy.
5. Optionally seed sample jobs once by running `npm run db:seed` locally
   with `DATABASE_URL` pointed at the production database — or simply
   create real postings in `/admin/jobs`.
6. Point a subdomain (e.g. `careers.cadencehouse.com`) at the Vercel
   project under **Settings → Domains**.

## Embedding in WordPress

Two options, usable together:

- **Link** your site's "Careers" / "Apply" navigation buttons to the
  deployed app (`https://careers.youragency.com`). Simplest and best for
  SEO of the job postings.
- **Embed** the job list inside an existing WordPress page with a Custom
  HTML block:

  ```html
  <iframe
    src="https://careers.youragency.com/embed/jobs"
    style="width:100%;min-height:900px;border:0"
    title="Open Positions"
  ></iframe>
  ```

  Job cards inside the embed open the full posting in a new tab.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply migrations (production) |
| `npm run db:seed` | Seed sample jobs |
| `npx prisma studio` | Browse the database in a GUI |
