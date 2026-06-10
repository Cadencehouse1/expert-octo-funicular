import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AGENCY_NAME } from "@/lib/constants";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-navy/10 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-navy">{AGENCY_NAME}</h1>
        <p className="mt-1 text-sm text-foreground/60">Staff sign in</p>
        <LoginForm />
      </div>
    </main>
  );
}
