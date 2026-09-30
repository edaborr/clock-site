"use client";

import { useEffect, useRef, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { playBeep, notify } from "@/hooks/useSound";

function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

const PRESETS = [60, 5 * 60, 10 * 60, 25 * 60];
const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;
const STORAGE_KEY = "zaman-istasyonu:last-timer-minutes";

function getInitialSeconds() {
  if (typeof window === "undefined") return 60;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = Number(params.get("minutes"));
  if (fromUrl > 0) return Math.min(180, fromUrl) * 60;
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  if (stored > 0) return stored * 60;
  return 60;
}

export default function TimerCard() {
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<"work" | "break">("work");
  const initialSecondsRef = useRef(getInitialSeconds());

  const handleFinish = () => {
    playBeep(pomodoroPhase === "work" ? 660 : 880);
    notify(
      pomodoroMode
        ? pomodoroPhase === "work"
          ? "Çalışma bitti, mola zamanı"
          : "Mola bitti, çalışmaya devam"
        : "Süre doldu"
    );
  };

  const { remaining, running, duration, start, pause, reset, setDuration } =
    useTimer(initialSecondsRef.current, handleFinish);
  const [customMinutes, setCustomMinutes] = useState("1");

  const progress = duration > 0 ? 1 - remaining / (duration * 1000) : 0;
  const finished = remaining <= 0;

  const applyPreset = (seconds: number) => {
    setDuration(seconds);
    reset(seconds);
    if (!pomodoroMode) {
      localStorage.setItem(STORAGE_KEY, String(Math.round(seconds / 60)));
    }
  };

  const applyCustom = () => {
    const mins = Math.max(1, Math.min(180, Number(customMinutes) || 1));
    applyPreset(mins * 60);
  };

  const togglePomodoro = () => {
    const next = !pomodoroMode;
    setPomodoroMode(next);
    setPomodoroPhase("work");
    if (next) applyPreset(POMODORO_WORK);
  };

  useEffect(() => {
    if (!pomodoroMode) return;
    if (remaining === 0 && !running) {
      const nextPhase = pomodoroPhase === "work" ? "break" : "work";
      setPomodoroPhase(nextPhase);
      const seconds = nextPhase === "work" ? POMODORO_WORK : POMODORO_BREAK;
      setDuration(seconds);
      reset(seconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, running]);

  useEffect(() => {
    document.title = running
      ? `⏱ ${formatRemaining(remaining)} — Zaman İstasyonu`
      : "Zaman İstasyonu";
    return () => {
      document.title = "Zaman İstasyonu";
    };
  }, [running, remaining]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        running ? pause() : start();
      } else if (e.key.toLowerCase() === "r") {
        reset();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, start, pause, reset]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="flex items-center gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-indigo-200/60">
          {pomodoroMode
            ? pomodoroPhase === "work"
              ? "Pomodoro — Çalışma"
              : "Pomodoro — Mola"
            : "Sayaç"}
        </span>
        <button
          onClick={togglePomodoro}
          className={`rounded-full px-3 py-1 text-xs transition ${
            pomodoroMode
              ? "bg-indigo-400/90 text-slate-900"
              : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/10"
          }`}
        >
          Pomodoro
        </button>
      </div>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={finished ? "#ff8a5c" : "#7c9fff"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />
        </svg>
        <span
          className={`font-mono text-5xl font-semibold tabular-nums text-slate-50 ${
            running ? "animate-pulse-slow" : ""
          }`}
        >
          {formatRemaining(remaining)}
        </span>
      </div>

      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={start}
            disabled={remaining <= 0}
            className="rounded-full bg-indigo-400/90 px-6 py-2.5 font-medium text-slate-900 transition hover:bg-indigo-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Başlat
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
          onClick={() => reset()}
          className="rounded-full px-6 py-2.5 font-medium text-slate-400 transition hover:text-slate-200 active:scale-95"
        >
          Sıfırla
        </button>
      </div>

      {!pomodoroMode && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((seconds) => (
            <button
              key={seconds}
              onClick={() => applyPreset(seconds)}
              className="rounded-full px-4 py-1.5 text-sm text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              {seconds < 60 ? `${seconds}sn` : `${seconds / 60}dk`}
            </button>
          ))}

          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
            <input
              type="number"
              min={1}
              max={180}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="w-12 bg-transparent text-center text-sm text-slate-200 outline-none"
            />
            <span className="text-xs text-slate-400">dk</span>
            <button
              onClick={applyCustom}
              className="ml-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20"
            >
              Uygula
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500">Boşluk: başlat/durdur · R: sıfırla</p>
    </div>
  );
}