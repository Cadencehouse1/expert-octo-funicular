import Link from "next/link";
import { db } from "@/lib/db";
import {
  ROLE_TYPES,
  STAGES,
  STAGE_ORDER,
  isRoleType,
  isStage,
} from "@/lib/constants";
import { roleLabel } from "@/components/public/JobCard";
import { StageBadge } from "@/components/admin/StageBadge";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; role?: string }>;
}) {
  const { stage, role } = await searchParams;
  const stageFilter = stage && isStage(stage) ? stage : undefined;
  const roleFilter = role && isRoleType(role) ? role : undefined;

  const applications = await db.application.findMany({
    where: {
      ...(stageFilter ? { stage: stageFilter } : {}),
      ...(roleFilter ? { roleType: roleFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { job: true },
  });

  const filterLink = (params: string, label: string, active: boolean) => (
    <Link
      key={params + label}
      href={`/admin/applications${params}`}
      className={`rounded-full px-3 py-1 text-xs ${active ? "bg-navy text-white" : "border border-navy/20 bg-white text-navy hover:border-navy"}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <h1 className="text-2xl font-semibold text-navy">Applications</h1>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-foreground/50">STAGE</span>
        {filterLink(roleFilter ? `?role=${roleFilter}` : "", "All", !stageFilter)}
        {STAGE_ORDER.map((s) =>
          filterLink(
            `?stage=${s}${roleFilter ? `&role=${roleFilter}` : ""}`,
            STAGES[s],
            stageFilter === s
          )
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-foreground/50">ROLE</span>
        {filterLink(stageFilter ? `?stage=${stageFilter}` : "", "All", !roleFilter)}
        {Object.entries(ROLE_TYPES).map(([key, label]) =>
          filterLink(
            `?role=${key}${stageFilter ? `&stage=${stageFilter}` : ""}`,
            label,
            roleFilter === key
          )
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy/10 bg-white">
        {applications.length === 0 ? (
          <p className="p-8 text-center text-foreground/60">
            No applications match these filters.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-navy">
              <tr>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Job</th>
                <th className="px-4 py-3 font-medium">Experience</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t border-navy/5">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="font-medium text-navy hover:underline"
                    >
                      {app.firstName} {app.lastName}
                    </Link>
                    <p className="text-xs text-foreground/50">{app.location}</p>
                  </td>
                  <td className="px-4 py-3">{roleLabel(app.roleType)}</td>
                  <td className="px-4 py-3 text-foreground/70">
                    {app.job?.title ?? "General application"}
                  </td>
                  <td className="px-4 py-3">{app.yearsExperience} yrs</td>
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
