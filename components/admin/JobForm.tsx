"use client";

import { useState, useTransition } from "react";
import type { Job } from "@prisma/client";
import { createJob, updateJob, type ActionResult } from "@/lib/actions/admin";
import { JOB_STATUSES, ROLE_TYPES } from "@/lib/constants";

const inputClass =
  "w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none";

const labelClass = "block text-sm font-medium text-navy mb-1";

export function JobForm({ job }: { job?: Job }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const result: ActionResult = job
            ? await updateJob(job.id, formData)
            : await createJob(formData);
          // createJob redirects on success, so a result only arrives on
          // failure (or after a successful update).
          if (result && !result.ok) setError(result.error);
          else if (result?.ok) setSaved(true);
        });
      }}
      className="space-y-5"
    >
      <div>
        <label className={labelClass} htmlFor="title">
          Job title *
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={150}
          defaultValue={job?.title}
          placeholder="Full-Time Nanny for Family of Four — Upper East Side"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="roleType">
            Role type *
          </label>
          <select
            id="roleType"
            name="roleType"
            required
            defaultValue={job?.roleType ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {Object.entries(ROLE_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="location">
            Location *
          </label>
          <input
            id="location"
            name="location"
            required
            maxLength={200}
            defaultValue={job?.location}
            placeholder="Manhattan, NY"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="schedule">
            Schedule
          </label>
          <input
            id="schedule"
            name="schedule"
            maxLength={200}
            defaultValue={job?.schedule}
            placeholder="Mon–Fri, 8am–6pm, live-out"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="compensation">
            Compensation
          </label>
          <input
            id="compensation"
            name="compensation"
            maxLength={200}
            defaultValue={job?.compensation}
            placeholder="$35–45/hr DOE, benefits"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="summary">
          Short summary (shown on the job board) *
        </label>
        <input
          id="summary"
          name="summary"
          required
          maxLength={300}
          defaultValue={job?.summary}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Full description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={8}
          required
          maxLength={10000}
          defaultValue={job?.description}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="requirements">
          Requirements
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={5}
          maxLength={10000}
          defaultValue={job?.requirements}
          className={inputClass}
        />
      </div>

      {job && (
        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={job.status}
            className={inputClass}
          >
            {Object.entries(JOB_STATUSES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}
      {saved && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
          Job saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-navy px-6 py-2.5 font-medium text-white hover:bg-navy-light disabled:opacity-60"
      >
        {pending ? "Saving…" : job ? "Save changes" : "Create job"}
      </button>
    </form>
  );
}
