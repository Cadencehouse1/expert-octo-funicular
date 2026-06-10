import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AGENCY_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${AGENCY_NAME} — Careers`,
    template: `%s | ${AGENCY_NAME}`,
  },
  description: `Open positions for nannies, newborn care specialists, personal assistants, and rotational nannies with ${AGENCY_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
