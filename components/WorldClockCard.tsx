"use client";

import { useClock } from "@/hooks/useClock";

const CITIES = [
  { label: "İstanbul", timeZone: "Europe/Istanbul" },
  { label: "Londra", timeZone: "Europe/London" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Sidney", timeZone: "Australia/Sydney" },
];

export default function WorldClockCard() {
  const now = useClock();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
      <span className="text-sm uppercase tracking-[0.3em] text-sky-200/60">
        Dünya Saatleri
      </span>
      <div className="grid w-full max-w-sm grid-cols-1 gap-3">
        {CITIES.map((city) => (
          <div
            key={city.timeZone}
            className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5"
          >
            <span className="text-slate-300">{city.label}</span>
            <span className="font-mono text-lg tabular-nums text-slate-50">
              {now
                ? now.toLocaleTimeString("tr-TR", {
                    timeZone: city.timeZone,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "--:--:--"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}