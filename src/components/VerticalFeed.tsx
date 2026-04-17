import { useState } from "react";
import type { CountryCard } from "../data/countries";
import { useRevealTimer } from "../hooks/useRevealTimer";
import { useVerticalSwipe } from "../hooks/useVerticalSwipe";
import { FlagSlide } from "./FlagSlide";
import { IntroSlide } from "./IntroSlide";
import { OutroSlide } from "./OutroSlide";
import { RevealProgress } from "./RevealProgress";

type FeedItem =
  | {
      id: string;
      type: "intro";
    }
  | {
      id: string;
      type: "outro";
    }
  | (CountryCard & {
      type: "country";
    });

type VerticalFeedProps = {
  items: FeedItem[];
  onLoop?: () => void;
};

function isCountryItem(item: FeedItem): item is CountryCard & { type: "country" } {
  return item.type === "country";
}

function renderSlide(item: FeedItem, stage: "hidden" | "revealed" | "detail") {
  if (isCountryItem(item)) {
    return <FlagSlide item={item} stage={stage} />;
  }

  return item.type === "intro" ? <IntroSlide /> : <OutroSlide />;
}

export function VerticalFeed({ items, onLoop }: VerticalFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];
  const total = items.length;
  const totalCountryCount = items.filter(isCountryItem).length;
  const nextIndex = (currentIndex + 1) % total;
  const nextItem = items[nextIndex];

  const goNext = () => {
    setCurrentIndex((index) => {
      if (index === total - 1) {
        onLoop?.();
        return 0;
      }

      return index + 1;
    });
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
            {renderSlide(currentItem, stage)}
            {isCountryItem(currentItem) ? (
              <RevealProgress
                current={currentIndex}
                total={totalCountryCount}
                timelineProgress={timelineProgress}
                revealDelayMs={revealDelayMs}
                detailDelayMs={detailDelayMs}
                totalDurationMs={totalDurationMs}
              />
            ) : (
              <div className="feed-spacer" aria-hidden="true" />
            )}
            <div className="feed-footer">
              <p>
                {isCountryItem(currentItem)
                  ? "上にスワイプして次へ"
                  : currentItem.type === "intro"
                    ? "上にスワイプではじめる"
                    : "上にスワイプで最初へ"}
              </p>
            </div>
          </div>
          <div className="feed-page feed-page--next" aria-hidden="true">
            {renderSlide(nextItem, "hidden")}
            {isCountryItem(nextItem) ? (
              <RevealProgress
                current={nextIndex}
                total={totalCountryCount}
                timelineProgress={0}
                revealDelayMs={revealDelayMs}
                detailDelayMs={detailDelayMs}
                totalDurationMs={totalDurationMs}
              />
            ) : (
              <div className="feed-spacer" aria-hidden="true" />
            )}
            <div className="feed-spacer" aria-hidden="true" />
          </div>
        </div>
      </section>
    </main>
  );
}
