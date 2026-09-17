import type { Metadata } from "next";
import Link from "next/link";
import RecruiterCV from "@/components/RecruiterCV";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "One-page CV",
  description: `One-page printable CV of ${site.name}.`,
  alternates: { canonical: "/cv" },
};

export default function CVPage() {
  return (
    <main className="print-root min-h-screen">
      <RecruiterCV />
      <p className="no-print pb-10 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-black/60">
        <Link href="/" className="underline underline-offset-4">
          ← Open the full interactive portfolio
        </Link>
      </p>
    </main>
  );
}
