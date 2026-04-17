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

  const goNext = () => {
    setCurrentIndex((index) => (index + 1) % total);
  };

  const { detailDelayMs, revealDelayMs, stage, timelineProgress, totalDurationMs } =
    useRevealTimer({
    cardKey: currentItem.id,
    });
  const { dragOffset, handlers } = useVerticalSwipe({
    onSwipeUp: goNext,
  });

  return (
    <main className="app-shell">
      <section className="feed-shell" {...handlers}>
        <FlagSlide item={currentItem} stage={stage} dragOffset={dragOffset} />
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
      </section>
    </main>
  );
}
