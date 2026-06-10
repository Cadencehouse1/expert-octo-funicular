import { db } from "@/lib/db";
import { ROLE_TYPES, isRoleType } from "@/lib/constants";
import { SiteHeader, SiteFooter } from "@/components/public/SiteHeader";
import { JobCard } from "@/components/public/JobCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JobBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const roleFilter = role && isRoleType(role) ? role : undefined;

  const jobs = await db.job.findMany({
    where: { status: "OPEN", ...(roleFilter ? { roleType: roleFilter } : {}) },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold text-navy">Open Positions</h1>
        <p className="mt-2 max-w-2xl text-foreground/70">
          We place exceptional nannies, newborn care specialists, personal
          assistants, and rotational nannies with wonderful families and
          private clients.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/"
            className={`rounded-full px-4 py-1.5 text-sm ${!roleFilter ? "bg-navy text-white" : "bg-white text-navy border border-navy/20 hover:border-navy"}`}
          >
            All Roles
          </Link>
          {Object.entries(ROLE_TYPES).map(([key, label]) => (
            <Link
              key={key}
              href={`/?role=${key}`}
              className={`rounded-full px-4 py-1.5 text-sm ${roleFilter === key ? "bg-navy text-white" : "bg-white text-navy border border-navy/20 hover:border-navy"}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4">
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-navy/20 bg-white p-10 text-center text-foreground/60">
              No open positions in this category right now — but we are always
              meeting outstanding candidates.{" "}
              <Link href="/apply" className="font-medium text-navy underline">
                Submit a general application
              </Link>{" "}
              and we will reach out when the right role arrives.
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
