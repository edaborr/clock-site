"use client";

import { useClock } from "@/hooks/useClock";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function ClockCard() {
  const now = useClock();

  const timeText = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : "--:--:--";

  const dateText = now
    ? now.toLocaleDateString("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="text-sm uppercase tracking-[0.3em] text-indigo-200/60">
        Şu an
      </span>
      <span className="font-mono text-6xl font-semibold tabular-nums text-slate-50 sm:text-7xl">
        {timeText}
      </span>
      <span className="text-base text-slate-300/70">{dateText}</span>
    </div>
  );
}