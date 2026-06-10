import Link from "next/link";
import { JobForm } from "@/components/admin/JobForm";

export default function NewJobPage() {
  return (
    <>
      <Link href="/admin/jobs" className="text-sm text-navy/70 hover:text-navy">
        ← All jobs
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-navy">New Job</h1>
      <div className="mt-6 max-w-3xl rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
        <JobForm />
      </div>
    </>
  );
}
