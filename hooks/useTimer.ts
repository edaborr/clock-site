"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(initialSeconds = 60, onFinish?: () => void) {
  const [duration, setDurationState] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds * 1000);
  const [running, setRunning] = useState(false);

  const remainingRef = useRef(remaining);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  useEffect(() => {
    if (!running) return;
    if (remainingRef.current <= 0) {
      setRunning(false);
      return;
    }

    const endTime = Date.now() + remainingRef.current;
    let rafId: number;

    const tick = () => {
      const left = endTime - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        onFinishRef.current?.();
        return;
      }
      setRemaining(left);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const setDuration = useCallback((seconds: number) => {
    setDurationState(seconds);
  }, []);

  const reset = useCallback(
    (seconds?: number) => {
      setRunning(false);
      const nextDuration = seconds ?? duration;
      setDurationState(nextDuration);
      setRemaining(nextDuration * 1000);
    },
    [duration]
  );

  return { remaining, running, duration, start, pause, reset, setDuration };
}