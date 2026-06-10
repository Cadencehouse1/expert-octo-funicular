import { STAGES, isStage } from "@/lib/constants";

const stageStyles: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-800",
  SCREENING: "bg-amber-50 text-amber-800",
  INTERVIEW: "bg-purple-50 text-purple-800",
  REFERENCE_CHECK: "bg-cyan-50 text-cyan-800",
  BACKGROUND_CHECK: "bg-orange-50 text-orange-800",
  PLACED: "bg-green-50 text-green-800",
  REJECTED: "bg-gray-100 text-gray-600",
};

export function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${stageStyles[stage] ?? "bg-gray-100 text-gray-600"}`}
    >
      {isStage(stage) ? STAGES[stage] : stage}
    </span>
  );
}
