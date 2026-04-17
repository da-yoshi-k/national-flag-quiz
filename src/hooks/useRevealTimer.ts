import { useEffect, useMemo, useState } from "react";

export type RevealStage = "hidden" | "revealed" | "detail";

type RevealTimerOptions = {
  cardKey: string;
  revealDelayMs?: number;
  detailDelayMs?: number;
  detailVisibleMs?: number;
};

export function useRevealTimer({
  cardKey,
  revealDelayMs = 5000,
  detailDelayMs = 6800,
  detailVisibleMs = 1800,
}: RevealTimerOptions) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    setElapsedMs(0);

    const startedAt = window.performance.now();
    const intervalId = window.setInterval(() => {
      setElapsedMs(window.performance.now() - startedAt);
    }, 16);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cardKey]);

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
