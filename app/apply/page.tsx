import { db } from "@/lib/db";
import { isRoleType } from "@/lib/constants";
import { SiteHeader, SiteFooter } from "@/components/public/SiteHeader";
import { ApplicationForm } from "@/components/public/ApplicationForm";
import { roleLabel } from "@/components/public/JobCard";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>;
}) {
  const { job: jobSlug } = await searchParams;
  const job = jobSlug
    ? await db.job.findUnique({ where: { slug: jobSlug } })
    : null;
  const openJob = job && job.status === "OPEN" ? job : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold text-navy">
          {openJob ? `Apply: ${openJob.title}` : "Apply to Join Our Roster"}
        </h1>
        <p className="mt-2 text-foreground/70">
          {openJob
            ? `${roleLabel(openJob.roleType)} · ${openJob.location}`
            : "Even if none of our current openings fit, we are always meeting exceptional candidates for upcoming placements."}
        </p>
        <div className="mt-8 rounded-xl border border-navy/10 bg-white p-6 sm:p-8 shadow-sm">
          <ApplicationForm
            jobId={openJob?.id}
            lockedRoleType={
              openJob && isRoleType(openJob.roleType) ? openJob.roleType : undefined
            }
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
