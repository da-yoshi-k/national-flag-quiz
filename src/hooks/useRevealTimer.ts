import { useEffect, useMemo, useRef, useState } from "react";

export type RevealStage = "hidden" | "revealed" | "detail";

type RevealTimerOptions = {
  cardKey: string;
  isPaused?: boolean;
  revealDelayMs?: number;
  detailDelayMs?: number;
  detailVisibleMs?: number;
};

export function useRevealTimer({
  cardKey,
  isPaused = false,
  revealDelayMs = 5000,
  detailDelayMs = 6800,
  detailVisibleMs = 1800,
}: RevealTimerOptions) {
  const carryElapsedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    carryElapsedRef.current = 0;
    startedAtRef.current = window.performance.now();
    setElapsedMs(0);
  }, [cardKey]);

  useEffect(() => {
    if (isPaused) {
      if (startedAtRef.current !== null) {
        carryElapsedRef.current += window.performance.now() - startedAtRef.current;
        startedAtRef.current = null;
        setElapsedMs(carryElapsedRef.current);
      }

      return;
    }

    startedAtRef.current = window.performance.now();

    const intervalId = window.setInterval(() => {
      const activeElapsed = startedAtRef.current === null
        ? 0
        : window.performance.now() - startedAtRef.current;
      setElapsedMs(carryElapsedRef.current + activeElapsed);
    }, 16);

    return () => {
      if (startedAtRef.current !== null) {
        carryElapsedRef.current += window.performance.now() - startedAtRef.current;
        startedAtRef.current = null;
      }
      window.clearInterval(intervalId);
    };
  }, [cardKey, isPaused]);

  const stage: RevealStage = useMemo(() => {
    if (elapsedMs >= detailDelayMs) {
      return "detail";
    }

    if (elapsedMs >= revealDelayMs) {
      return "revealed";
    }

    return "hidden";
  }, [detailDelayMs, elapsedMs, revealDelayMs]);

  const totalDurationMs = detailDelayMs + detailVisibleMs;
  const timelineProgress = Math.min(elapsedMs / totalDurationMs, 1);

  return {
    detailDelayMs,
    elapsedMs,
    revealDelayMs,
    stage,
    timelineProgress,
    totalDurationMs,
  };
}
