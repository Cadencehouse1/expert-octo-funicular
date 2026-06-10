import Link from "next/link";
import type { Job } from "@prisma/client";
import { ROLE_TYPES, isRoleType } from "@/lib/constants";

export function roleLabel(roleType: string): string {
  return isRoleType(roleType) ? ROLE_TYPES[roleType] : roleType;
}

export function JobCard({ job, newTab = false }: { job: Job; newTab?: boolean }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      target={newTab ? "_blank" : undefined}
      className="block rounded-xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-gold hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-navy">{job.title}</h2>
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-navy">
          {roleLabel(job.roleType)}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground/70">{job.summary}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy/70">
        <span>📍 {job.location}</span>
        {job.schedule && <span>🕐 {job.schedule}</span>}
        {job.compensation && <span>💰 {job.compensation}</span>}
      </div>
    </Link>
  );
}
