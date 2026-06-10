import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions/admin";
import { AGENCY_NAME } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-semibold tracking-wide">
              {AGENCY_NAME}
              <span className="ml-2 text-sm font-normal text-gold">Admin</span>
            </Link>
            <nav className="flex gap-5 text-sm">
              <Link href="/admin" className="hover:text-gold">
                Dashboard
              </Link>
              <Link href="/admin/applications" className="hover:text-gold">
                Applications
              </Link>
              <Link href="/admin/jobs" className="hover:text-gold">
                Jobs
              </Link>
              <Link href="/" target="_blank" className="hover:text-gold">
                View Job Board ↗
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button className="text-sm text-white/70 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </>
  );
}
