import Link from "next/link";
import { db } from "@/lib/db";
import { STAGES, STAGE_ORDER } from "@/lib/constants";
import { roleLabel } from "@/components/public/JobCard";
import { StageBadge } from "@/components/admin/StageBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stageCounts, openJobs, recent] = await Promise.all([
    db.application.groupBy({ by: ["stage"], _count: { _all: true } }),
    db.job.count({ where: { status: "OPEN" } }),
    db.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { job: true },
    }),
  ]);

  const countByStage = Object.fromEntries(
    stageCounts.map((row) => [row.stage, row._count._all])
  );

  return (
    <>
      <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-xl border border-navy/10 bg-white p-4">
          <p className="text-2xl font-semibold text-navy">{openJobs}</p>
          <p className="text-xs text-foreground/60">Open Jobs</p>
        </div>
        {STAGE_ORDER.map((stage) => (
          <Link
            key={stage}
            href={`/admin/applications?stage=${stage}`}
            className="rounded-xl border border-navy/10 bg-white p-4 hover:border-gold"
          >
            <p className="text-2xl font-semibold text-navy">
              {countByStage[stage] ?? 0}
            </p>
            <p className="text-xs text-foreground/60">{STAGES[stage]}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-navy">
        Recent Applications
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-navy/10 bg-white">
        {recent.length === 0 ? (
          <p className="p-8 text-center text-foreground/60">
            No applications yet. Share your job board to start receiving them.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-navy">
              <tr>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Job</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((app) => (
                <tr key={app.id} className="border-t border-navy/5">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="font-medium text-navy hover:underline"
                    >
                      {app.firstName} {app.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{roleLabel(app.roleType)}</td>
                  <td className="px-4 py-3 text-foreground/70">
                    {app.job?.title ?? "General application"}
                  </td>
                  <td className="px-4 py-3">
                    <StageBadge stage={app.stage} />
                  </td>
                  <td className="px-4 py-3 text-foreground/60">
                    {app.createdAt.toLocaleDateString()}
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
