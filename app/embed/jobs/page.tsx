import { db } from "@/lib/db";
import { JobCard } from "@/components/public/JobCard";

export const dynamic = "force-dynamic";

// Minimal, chrome-free job list designed to be embedded in an <iframe>
// on the agency's WordPress site. Links open in a new tab so candidates
// land on the full application flow.
export default async function EmbedJobsPage() {
  const jobs = await db.job.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-navy/20 bg-white p-8 text-center text-foreground/60">
            No open positions right now — check back soon.
          </p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} newTab />)
        )}
      </div>
    </main>
  );
}
