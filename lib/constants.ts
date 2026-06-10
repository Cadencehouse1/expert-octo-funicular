export const ROLE_TYPES = {
  NANNY: "Nanny",
  NEWBORN_CARE_SPECIALIST: "Newborn Care Specialist",
  PERSONAL_ASSISTANT: "Personal Assistant",
  ROTATIONAL_NANNY: "Rotational Nanny",
} as const;

export type RoleType = keyof typeof ROLE_TYPES;

export const JOB_STATUSES = {
  OPEN: "Open",
  FILLED: "Filled",
  ARCHIVED: "Archived",
} as const;

export type JobStatus = keyof typeof JOB_STATUSES;

export const STAGES = {
  NEW: "New",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  REFERENCE_CHECK: "Reference Check",
  BACKGROUND_CHECK: "Background Check",
  PLACED: "Placed",
  REJECTED: "Rejected",
} as const;

export type Stage = keyof typeof STAGES;

export const STAGE_ORDER: Stage[] = [
  "NEW",
  "SCREENING",
  "INTERVIEW",
  "REFERENCE_CHECK",
  "BACKGROUND_CHECK",
  "PLACED",
  "REJECTED",
];

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function isRoleType(value: string): value is RoleType {
  return value in ROLE_TYPES;
}

export function isStage(value: string): value is Stage {
  return value in STAGES;
}

export function isJobStatus(value: string): value is JobStatus {
  return value in JOB_STATUSES;
}

export const AGENCY_NAME =
  process.env.NEXT_PUBLIC_AGENCY_NAME ?? "Your Agency";
