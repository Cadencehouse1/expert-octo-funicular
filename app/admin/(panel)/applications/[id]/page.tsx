import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { STAGES, STAGE_ORDER, isStage } from "@/lib/constants";
import { addNote, updateStage } from "@/lib/actions/admin";
import { roleLabel } from "@/components/public/JobCard";
import { StageBadge } from "@/components/admin/StageBadge";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">{value}</p>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await db.application.findUnique({
    where: { id },
    include: { job: true, notes: { orderBy: { createdAt: "desc" } } },
  });
  if (!app) notFound();

  const updateStageForApp = updateStage.bind(null, app.id);
  const addNoteForApp = addNote.bind(null, app.id);

  return (
    <>
      <Link href="/admin/applications" className="text-sm text-navy/70 hover:text-navy">
        ← All applications
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy">
            {app.firstName} {app.lastName}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {roleLabel(app.roleType)} ·{" "}
            {app.job ? (
              <>applied for <span className="font-medium">{app.job.title}</span></>
            ) : (
              "general application"
            )}{" "}
            · received {app.createdAt.toLocaleDateString()}
          </p>
        </div>
        <StageBadge stage={app.stage} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-navy/10 bg-white p-6">
            <h2 className="font-semibold text-navy">Candidate Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Email" value={app.email} />
              <Field label="Phone" value={app.phone} />
              <Field label="Location" value={app.location} />
              <Field label="Experience" value={`${app.yearsExperience} years`} />
              <Field
                label="Authorized to work in US"
                value={app.workAuthorized ? "Yes" : "No"}
              />
              <Field
                label="Driver's license"
                value={app.hasLicense ? "Yes" : "No"}
              />
              <Field label="Languages" value={app.languages} />
              <Field label="Salary expectations" value={app.salaryExpectation} />
              <Field label="Certifications" value={app.certifications} />
              <Field label="Availability" value={app.availability} />
            </div>
            {app.coverNote && (
              <div className="mt-4">
                <Field label="About the candidate" value={app.coverNote} />
              </div>
            )}
            <div className="mt-5 border-t border-navy/5 pt-4">
              {app.resumeName ? (
                <a
                  href={`/admin/applications/${app.id}/resume`}
                  className="inline-block rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light"
                >
                  Download resume ({app.resumeName})
                </a>
              ) : (
                <p className="text-sm text-foreground/50">No resume uploaded.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-navy/10 bg-white p-6">
            <h2 className="font-semibold text-navy">Notes</h2>
            <form action={addNoteForApp} className="mt-4">
              <textarea
                name="body"
                rows={3}
                required
                maxLength={5000}
                placeholder="Screening call summary, reference feedback, interview impressions…"
                className="w-full rounded-md border border-navy/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
              <button className="mt-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light">
                Add note
              </button>
            </form>
            <ul className="mt-5 space-y-4">
              {app.notes.map((note) => (
                <li key={note.id} className="rounded-lg bg-cream p-4">
                  <p className="whitespace-pre-line text-sm text-foreground/90">
                    {note.body}
                  </p>
                  <p className="mt-2 text-xs text-foreground/50">
                    {note.createdAt.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside>
          <section className="rounded-xl border border-navy/10 bg-white p-6">
            <h2 className="font-semibold text-navy">Pipeline Stage</h2>
            <form action={updateStageForApp} className="mt-4 space-y-3">
              <select
                name="stage"
                defaultValue={isStage(app.stage) ? app.stage : "NEW"}
                className="w-full rounded-md border border-navy/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              >
                {STAGE_ORDER.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGES[stage]}
                  </option>
                ))}
              </select>
              <button className="w-full rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light">
                Update stage
              </button>
            </form>
          </section>
        </aside>
      </div>
    </>
  );
}
