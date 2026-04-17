type RevealProgressProps = {
  current: number;
  total: number;
  timelineProgress: number;
  revealDelayMs: number;
  detailDelayMs: number;
  totalDurationMs: number;
};

export function RevealProgress({
  current,
  total,
  timelineProgress,
  revealDelayMs,
  detailDelayMs,
  totalDurationMs,
}: RevealProgressProps) {
  const hiddenWidth = (revealDelayMs / totalDurationMs) * 100;
  const revealedWidth = ((detailDelayMs - revealDelayMs) / totalDurationMs) * 100;
  const detailWidth = ((totalDurationMs - detailDelayMs) / totalDurationMs) * 100;

  return (
    <div className="progress-shell" aria-label={`カード ${current} / ${total}`}>
      <div className="progress-meta">
        <span className="progress-count">
          {current} / {total}
        </span>
      </div>
      <div className="timeline-shell" aria-hidden="true">
        <div className="timeline-track">
          <div
            className="timeline-segment timeline-segment--hidden"
            style={{ width: `${hiddenWidth}%` }}
          />
          <div
            className="timeline-segment timeline-segment--revealed"
            style={{ width: `${revealedWidth}%` }}
          />
          <div
            className="timeline-segment timeline-segment--detail"
            style={{ width: `${detailWidth}%` }}
          />
          <div
            className="timeline-pointer"
            style={{ left: `calc(${timelineProgress * 100}% - 7px)` }}
          />
        </div>
      </div>
    </div>
  );
}
