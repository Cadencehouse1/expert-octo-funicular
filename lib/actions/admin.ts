"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  requireAdmin,
  verifyCredentials,
} from "@/lib/auth";
import { isJobStatus, isRoleType, isStage } from "@/lib/constants";

export type ActionResult = { ok: true } | { ok: false; error: string };

// --- Auth ---

export async function login(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { ok: false, error: "Email and password are required." };
  }
  if (!verifyCredentials(email, password)) {
    return { ok: false, error: "Invalid email or password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

// --- Jobs ---

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type JobFormData = {
  title: string;
  roleType: string;
  location: string;
  schedule: string;
  compensation: string;
  summary: string;
  description: string;
  requirements: string;
};

function jobDataFromForm(
  formData: FormData
): { error: string } | { data: JobFormData } {
  const title = String(formData.get("title") ?? "").trim();
  const roleType = String(formData.get("roleType") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const schedule = String(formData.get("schedule") ?? "").trim();
  const compensation = String(formData.get("compensation") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const requirements = String(formData.get("requirements") ?? "").trim();

  if (!title || !location || !summary || !description) {
    return { error: "Title, location, summary, and description are required." };
  }
  if (!isRoleType(roleType)) {
    return { error: "Please choose a valid role type." };
  }
  return {
    data: { title, roleType, location, schedule, compensation, summary, description, requirements },
  };
}

export async function createJob(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = jobDataFromForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const base = slugify(parsed.data.title) || "job";
  let slug = base;
  for (let i = 2; await db.job.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`;
  }

  const job = await db.job.create({ data: { ...parsed.data, slug } });
  revalidatePath("/");
  redirect(`/admin/jobs/${job.id}`);
}

export async function updateJob(jobId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = jobDataFromForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const status = String(formData.get("status") ?? "");
  if (!isJobStatus(status)) {
    return { ok: false, error: "Please choose a valid status." };
  }

  await db.job.update({
    where: { id: jobId },
    data: { ...parsed.data, status },
  });
  revalidatePath("/");
  revalidatePath(`/admin/jobs/${jobId}`);
  return { ok: true };
}

// --- Applications ---

export async function updateStage(applicationId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const stage = String(formData.get("stage") ?? "");
  if (!isStage(stage)) return;
  await db.application.update({ where: { id: applicationId }, data: { stage } });
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
}

export async function addNote(applicationId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const body = String(formData.get("body") ?? "").trim().slice(0, 5000);
  if (!body) return;
  await db.applicationNote.create({ data: { applicationId, body } });
  revalidatePath(`/admin/applications/${applicationId}`);
}
