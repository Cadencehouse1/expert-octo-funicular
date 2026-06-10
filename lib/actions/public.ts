"use server";

import { db } from "@/lib/db";
import {
  RESUME_MAX_BYTES,
  RESUME_MIME_TYPES,
  isRoleType,
} from "@/lib/constants";

export type ApplyResult = { ok: true } | { ok: false; error: string };

function requiredText(formData: FormData, field: string, max = 500): string | null {
  const value = formData.get(field);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function optionalText(formData: FormData, field: string, max = 5000): string {
  const value = formData.get(field);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function submitApplication(formData: FormData): Promise<ApplyResult> {
  const firstName = requiredText(formData, "firstName", 100);
  const lastName = requiredText(formData, "lastName", 100);
  const email = requiredText(formData, "email", 200);
  const phone = requiredText(formData, "phone", 50);
  const location = requiredText(formData, "location", 200);
  const roleTypeRaw = requiredText(formData, "roleType", 50);

  if (!firstName || !lastName || !email || !phone || !location || !roleTypeRaw) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!isRoleType(roleTypeRaw)) {
    return { ok: false, error: "Please choose a valid role type." };
  }

  const yearsRaw = requiredText(formData, "yearsExperience", 3);
  const yearsExperience = yearsRaw === null ? NaN : Number(yearsRaw);
  if (!Number.isInteger(yearsExperience) || yearsExperience < 0 || yearsExperience > 60) {
    return { ok: false, error: "Please enter your years of experience (0–60)." };
  }

  // If the application came from a specific job posting, link it — but only
  // if the job still exists and is open.
  let jobId: string | null = null;
  const jobIdRaw = optionalText(formData, "jobId", 50);
  if (jobIdRaw) {
    const job = await db.job.findUnique({ where: { id: jobIdRaw } });
    if (job && job.status === "OPEN") jobId = job.id;
  }

  let resumeName: string | null = null;
  let resumeType: string | null = null;
  let resumeData: Uint8Array<ArrayBuffer> | null = null;
  const resume = formData.get("resume");
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > RESUME_MAX_BYTES) {
      return { ok: false, error: "Resume must be 5 MB or smaller." };
    }
    if (!RESUME_MIME_TYPES.includes(resume.type)) {
      return { ok: false, error: "Resume must be a PDF or Word document." };
    }
    resumeName = resume.name.slice(0, 200);
    resumeType = resume.type;
    resumeData = new Uint8Array(await resume.arrayBuffer());
  }

  await db.application.create({
    data: {
      jobId,
      roleType: roleTypeRaw,
      firstName,
      lastName,
      email,
      phone,
      location,
      yearsExperience,
      certifications: optionalText(formData, "certifications", 1000),
      availability: optionalText(formData, "availability", 1000),
      coverNote: optionalText(formData, "coverNote", 5000),
      resumeName,
      resumeType,
      resumeData,
    },
  });

  return { ok: true };
}
