"use client";

import { useState, useTransition } from "react";
import { submitApplication } from "@/lib/actions/public";
import { ROLE_TYPES, type RoleType } from "@/lib/constants";

const inputClass =
  "w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none";

const labelClass = "block text-sm font-medium text-navy mb-1";

export function ApplicationForm({
  jobId,
  lockedRoleType,
}: {
  jobId?: string;
  lockedRoleType?: RoleType;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className="rounded-xl border border-gold/40 bg-cream p-8 text-center">
        <h2 className="text-xl font-semibold text-navy">
          Application received — thank you!
        </h2>
        <p className="mt-2 text-foreground/70">
          We review every application personally and will be in touch if your
          experience matches one of our placements.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await submitApplication(formData);
          if (result.ok) {
            setSubmitted(true);
          } else {
            setError(result.error);
          }
        });
      }}
      className="space-y-5"
    >
      {jobId && <input type="hidden" name="jobId" value={jobId} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="firstName">
            First name *
          </label>
          <input id="firstName" name="firstName" required maxLength={100} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">
            Last name *
          </label>
          <input id="lastName" name="lastName" required maxLength={100} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email *
          </label>
          <input id="email" name="email" type="email" required maxLength={200} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone *
          </label>
          <input id="phone" name="phone" type="tel" required maxLength={50} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="location">
            City / area you live in *
          </label>
          <input id="location" name="location" required maxLength={200} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="yearsExperience">
            Years of professional experience *
          </label>
          <input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min={0}
            max={60}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="roleType">
          Role you are applying for *
        </label>
        {lockedRoleType ? (
          <>
            <input type="hidden" name="roleType" value={lockedRoleType} />
            <p className="rounded-md bg-cream px-3 py-2 text-sm text-navy">
              {ROLE_TYPES[lockedRoleType]}
            </p>
          </>
        ) : (
          <select id="roleType" name="roleType" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a role…
            </option>
            {Object.entries(ROLE_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="workAuthorized">
            Are you legally authorized to work in the US? *
          </label>
          <select id="workAuthorized" name="workAuthorized" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="hasLicense">
            Do you have a valid driver&apos;s license? *
          </label>
          <select id="hasLicense" name="hasLicense" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="languages">
            Languages you speak
          </label>
          <input
            id="languages"
            name="languages"
            maxLength={500}
            placeholder="English, Spanish…"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="salaryExpectation">
            Salary / rate expectations
          </label>
          <input
            id="salaryExpectation"
            name="salaryExpectation"
            maxLength={200}
            placeholder="$35–40/hr or $110k/year"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="certifications">
          Certifications &amp; training (CPR, NCS certification, etc.)
        </label>
        <input id="certifications" name="certifications" maxLength={1000} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="availability">
          Availability (start date, live-in/live-out, travel, rotations)
        </label>
        <input id="availability" name="availability" maxLength={1000} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="coverNote">
          Tell us about yourself and your experience
        </label>
        <textarea id="coverNote" name="coverNote" rows={5} maxLength={5000} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="resume">
          Resume (PDF or Word, max 5 MB)
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="block w-full text-sm text-foreground/70 file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-light"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-navy px-8 py-3 font-medium text-white hover:bg-navy-light disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
