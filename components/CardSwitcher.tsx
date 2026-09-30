"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClockCard from "./ClockCard";
import StopwatchCard from "./StopwatchCard";
import TimerCard from "./TimerCard";
import WorldClockCard from "./WorldClockCard";

const TABS = [
  { id: "clock", label: "Saat", glow: "rgba(124,159,255,0.25)" },
  { id: "stopwatch", label: "Kronometre", glow: "rgba(255,138,92,0.25)" },
  { id: "timer", label: "Sayaç", glow: "rgba(124,159,255,0.25)" },
  { id: "world", label: "Dünya", glow: "rgba(94,234,212,0.22)" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CardSwitcher() {
  const [active, setActive] = useState<TabId>("clock");
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="relative rounded-full px-5 py-2 text-sm font-medium text-slate-300 transition-colors"
          >
            {active === tab.id && (
              <motion.span
                layoutId="active-tab-pill"
                className="absolute inset-0 rounded-full bg-white/10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={active === tab.id ? "relative text-slate-50" : "relative"}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="relative w-full">
        <motion.div
          animate={{ backgroundColor: activeTab.glow }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] blur-3xl"
        />
        <div className="relative h-[440px] w-full overflow-hidden rounded-[28px] bg-slate-900/40 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute inset-0"
            >
              {active === "clock" && <ClockCard />}
              {active === "stopwatch" && <StopwatchCard />}
              {active === "timer" && <TimerCard />}
              {active === "world" && <WorldClockCard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}