"use client";

import { useEffect } from "react";
import { useStopwatch } from "@/hooks/useStopwatch";
import { motion, AnimatePresence } from "framer-motion";

function formatElapsed(ms: number) {
  const totalCentis = Math.floor(ms / 10);
  const centis = totalCentis % 100;
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centis)}`
    : `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

export default function StopwatchCard() {
  const { elapsed, running, laps, start, pause, reset, lap } = useStopwatch();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        running ? pause() : start();
      } else if (e.key.toLowerCase() === "l") {
        lap();
      } else if (e.key.toLowerCase() === "r") {
        reset();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, start, pause, reset, lap]);

  const lapTimes = laps.map((l) => l.lapTime);
  const fastest = laps.length > 1 ? Math.min(...lapTimes) : null;
  const slowest = laps.length > 1 ? Math.max(...lapTimes) : null;

  return (
    <div className="flex h-full flex-col items-center gap-8 px-6 py-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <span className="text-sm uppercase tracking-[0.3em] text-orange-200/60">
          Kronometre
        </span>
        <span
          className={`font-mono text-6xl font-semibold tabular-nums text-slate-50 sm:text-7xl ${
            running ? "animate-pulse-slow" : ""
          }`}
        >
          {formatElapsed(elapsed)}
        </span>

        <div className="flex gap-3">
          {!running ? (
            <button
              onClick={start}
              className="rounded-full bg-orange-400/90 px-6 py-2.5 font-medium text-slate-900 transition hover:bg-orange-300 active:scale-95"
            >
              {elapsed > 0 ? "Devam Et" : "Başlat"}
            </button>
          ) : (
            <button
              onClick={pause}
              className="rounded-full bg-slate-100/10 px-6 py-2.5 font-medium text-slate-100 ring-1 ring-slate-100/20 transition hover:bg-slate-100/20 active:scale-95"
            >
              Durdur
            </button>
          )}
          <button
            onClick={lap}
            disabled={!running}
            className="rounded-full px-6 py-2.5 font-medium text-slate-300 ring-1 ring-slate-100/15 transition hover:bg-slate-100/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Tur
          </button>
          <button
            onClick={reset}
            className="rounded-full px-6 py-2.5 font-medium text-slate-400 transition hover:text-slate-200 active:scale-95"
          >
            Sıfırla
          </button>
        </div>
        <p className="text-xs text-slate-500">Boşluk: başlat/durdur · L: tur · R: sıfırla</p>
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-sm flex-1 overflow-y-auto rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/5">
          <ul className="flex flex-col gap-1 text-sm">
            <AnimatePresence initial={false}>
              {laps.map((l) => {
                const isFastest = fastest !== null && l.lapTime === fastest;
                const isSlowest = slowest !== null && l.lapTime === slowest;
                return (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 odd:bg-white/[0.03] ${
                      isFastest
                        ? "text-emerald-300"
                        : isSlowest
                        ? "text-rose-300"
                        : "text-slate-300"
                    }`}
                  >
                    <span className="text-slate-500">Tur {l.id}</span>
                    <span className="font-mono tabular-nums">{formatElapsed(l.lapTime)}</span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {formatElapsed(l.totalTime)}
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}