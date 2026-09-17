"use client";

import { motion } from "framer-motion";

/** Route entrance for /cv: a gold curtain lifts off the page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="no-print pointer-events-none fixed inset-0 z-[300] origin-top bg-[#EBB94A]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
      {children}
    </>
  );
}
