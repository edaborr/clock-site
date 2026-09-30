"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Lap {
  id: number;
  lapTime: number;
  totalTime: number;
}

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  const elapsedRef = useRef(0);
  const lastLapTotalRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    if (!running) return;

    const startTime = Date.now() - elapsedRef.current;
    let rafId: number;

    const tick = () => {
      setElapsed(Date.now() - startTime);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    lastLapTotalRef.current = 0;
  }, []);

  const lap = useCallback(() => {
    setLaps((prev) => {
      if (!running) return prev;
      const next: Lap = {
        id: prev.length + 1,
        lapTime: elapsedRef.current - lastLapTotalRef.current,
        totalTime: elapsedRef.current,
      };
      lastLapTotalRef.current = elapsedRef.current;
      return [next, ...prev];
    });
  }, [running]);

  return { elapsed, running, laps, start, pause, reset, lap };
}