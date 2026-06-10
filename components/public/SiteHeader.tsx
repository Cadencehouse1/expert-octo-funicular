import Link from "next/link";
import { AGENCY_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          {AGENCY_NAME}
          <span className="ml-2 text-sm font-normal text-gold">Careers</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-gold">
            Open Positions
          </Link>
          <Link
            href="/apply"
            className="rounded-md bg-gold px-4 py-2 font-medium text-navy hover:opacity-90"
          >
            Apply Now
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-navy/70">
        © {new Date().getFullYear()} {AGENCY_NAME}. All candidates are
        thoroughly vetted before placement.
      </div>
    </footer>
  );
}
