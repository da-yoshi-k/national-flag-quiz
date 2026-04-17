import { useState } from "react";
import type { CountryCard } from "../data/countries";
import { useRevealTimer } from "../hooks/useRevealTimer";
import { useVerticalSwipe } from "../hooks/useVerticalSwipe";
import { FlagSlide } from "./FlagSlide";
import { RevealProgress } from "./RevealProgress";

type VerticalFeedProps = {
  items: CountryCard[];
};

export function VerticalFeed({ items }: VerticalFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];
  const total = items.length;
  const nextIndex = (currentIndex + 1) % total;
  const nextItem = items[nextIndex];

  const goNext = () => {
    setCurrentIndex((index) => (index + 1) % total);
  };

  const { detailDelayMs, revealDelayMs, stage, timelineProgress, totalDurationMs } =
    useRevealTimer({
      cardKey: currentItem.id,
    });
  const { dragOffset, handlers, isAdvancing, isDragging, isResetting } =
    useVerticalSwipe({
    onSwipeUp: goNext,
  });

  return (
    <main className="app-shell">
      <section className="feed-shell" {...handlers}>
        <div
          className={[
            "feed-stack",
            isDragging ? "feed-stack--dragging" : "",
            isAdvancing ? "feed-stack--advancing" : "",
            isResetting ? "feed-stack--resetting" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateY(${dragOffset}px)` }}
        >
          <div className="feed-page">
            <FlagSlide item={currentItem} stage={stage} />
            <RevealProgress
              current={currentIndex + 1}
              total={total}
              timelineProgress={timelineProgress}
              revealDelayMs={revealDelayMs}
              detailDelayMs={detailDelayMs}
              totalDurationMs={totalDurationMs}
            />
            <div className="feed-footer">
              <p>上にスワイプして次へ</p>
            </div>
          </div>
          <div className="feed-page feed-page--next" aria-hidden="true">
            <FlagSlide item={nextItem} stage="hidden" />
            <RevealProgress
              current={nextIndex + 1}
              total={total}
              timelineProgress={0}
              revealDelayMs={revealDelayMs}
              detailDelayMs={detailDelayMs}
              totalDurationMs={totalDurationMs}
            />
            <div className="feed-footer feed-footer--next">
              <p>次のカード</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
