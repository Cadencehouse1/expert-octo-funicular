import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobForm } from "@/components/admin/JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await db.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <>
      <Link href="/admin/jobs" className="text-sm text-navy/70 hover:text-navy">
        ← All jobs
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-navy">Edit Job</h1>
        <Link
          href={`/jobs/${job.slug}`}
          target="_blank"
          className="text-sm text-navy/70 underline hover:text-navy"
        >
          View public posting ↗
        </Link>
      </div>
      <div className="mt-6 max-w-3xl rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
        <JobForm job={job} />
      </div>
    </>
  );
}
