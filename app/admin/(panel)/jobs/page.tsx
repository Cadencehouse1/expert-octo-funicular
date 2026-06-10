import Link from "next/link";
import { db } from "@/lib/db";
import { JOB_STATUSES, isJobStatus } from "@/lib/constants";
import { roleLabel } from "@/components/public/JobCard";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  OPEN: "bg-green-50 text-green-800",
  FILLED: "bg-blue-50 text-blue-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

export default async function AdminJobsPage() {
  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-navy">Jobs</h1>
        <Link
          href="/admin/jobs/new"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light"
        >
          + New job
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy/10 bg-white">
        {jobs.length === 0 ? (
          <p className="p-8 text-center text-foreground/60">
            No jobs yet. Create your first posting to populate the job board.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-navy">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Applications</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Posted</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-navy/5">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="font-medium text-navy hover:underline"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{roleLabel(job.roleType)}</td>
                  <td className="px-4 py-3 text-foreground/70">{job.location}</td>
                  <td className="px-4 py-3">{job._count.applications}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[job.status] ?? ""}`}
                    >
                      {isJobStatus(job.status) ? JOB_STATUSES[job.status] : job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">
                    {job.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
