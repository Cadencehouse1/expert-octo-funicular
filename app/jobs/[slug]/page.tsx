import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader, SiteFooter } from "@/components/public/SiteHeader";
import { roleLabel } from "@/components/public/JobCard";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await db.job.findUnique({ where: { slug } });
  if (!job || job.status === "ARCHIVED") notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link href="/" className="text-sm text-navy/70 hover:text-navy">
          ← All open positions
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold text-navy">{job.title}</h1>
          <span className="rounded-full bg-cream px-3 py-1 text-sm font-medium text-navy">
            {roleLabel(job.roleType)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy/70">
          <span>📍 {job.location}</span>
          {job.schedule && <span>🕐 {job.schedule}</span>}
          {job.compensation && <span>💰 {job.compensation}</span>}
        </div>

        {job.status === "FILLED" ? (
          <div className="mt-6 rounded-lg bg-cream p-4 text-navy">
            This position has been filled. Browse our{" "}
            <Link href="/" className="font-medium underline">
              other open roles
            </Link>{" "}
            or{" "}
            <Link href="/apply" className="font-medium underline">
              submit a general application
            </Link>
            .
          </div>
        ) : (
          <Link
            href={`/apply?job=${job.slug}`}
            className="mt-6 inline-block rounded-md bg-navy px-6 py-3 font-medium text-white hover:bg-navy-light"
          >
            Apply for this position
          </Link>
        )}

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-navy">About the Role</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/80">
              {job.description}
            </p>
          </div>
          {job.requirements && (
            <div>
              <h2 className="text-xl font-semibold text-navy">Requirements</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/80">
                {job.requirements}
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
