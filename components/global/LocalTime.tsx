"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/content";

export function useLocalTime(withSeconds = true) {
  const [time, setTime] = useState("--:--" + (withSeconds ? ":--" : ""));
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.location.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: withSeconds ? "2-digit" : undefined,
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [withSeconds]);
  return time;
}

export default function LocalTime({ className }: { className?: string }) {
  const time = useLocalTime();
  return (
    <span className={className} suppressHydrationWarning>
      {time} IST
    </span>
  );
}
