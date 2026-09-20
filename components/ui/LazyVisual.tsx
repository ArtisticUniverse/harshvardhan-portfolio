"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts an expensive decorative visual only while it is near the viewport,
 * so offscreen scenes stop costing animation frames.
 */
export default function LazyVisual({
  children,
  className,
  rootMargin = "300px",
}: {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} aria-hidden>
      {near ? children : null}
    </div>
  );
}
