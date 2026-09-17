"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { store, useStore } from "@/lib/store";
import RecruiterCV from "@/components/RecruiterCV";
import { curtain } from "./Curtain";

export default function RecruiterOverlay() {
  const open = useStore((s) => s.recruiter);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => void curtain(() => store.set({ recruiter: false }));

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="print-root fixed inset-0 z-[170] overflow-y-auto"
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label="One-page CV"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <RecruiterCV onClose={close} />
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
