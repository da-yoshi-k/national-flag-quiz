import { useEffect, useLayoutEffect, useState } from "react";
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
  const [renderedCurrentIndex, setRenderedCurrentIndex] = useState(0);
  const [renderedNextIndex, setRenderedNextIndex] = useState(1 % items.length);
  const [loopCount, setLoopCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = items.length;
  const totalCountryCount = items.filter(isCountryItem).length;
  const nextIndex = (currentIndex + 1) % total;
  const currentItem = items[renderedCurrentIndex];
  const nextItem = items[renderedNextIndex];

  const goNext = () => {
    if (currentIndex === total - 1) {
      setIsPaused(false);
      setCurrentIndex(0);
      setLoopCount((count) => count + 1);
      return;
    }

    setIsPaused(false);
    setCurrentIndex(currentIndex + 1);
  };

  const { detailDelayMs, revealDelayMs, stage, timelineProgress, totalDurationMs } =
    useRevealTimer({
      cardKey: currentItem.id,
      isPaused,
    });
  const { dragOffset, handlers, isAdvancing, isDragging, isResetting, isSettling } =
    useVerticalSwipe({
      onSwipeUp: goNext,
    });

  useLayoutEffect(() => {
    if (isResetting) {
      setRenderedCurrentIndex(currentIndex);
    }
  }, [currentIndex, isResetting]);

  useEffect(() => {
    if (!isAdvancing && !isResetting) {
      setRenderedCurrentIndex(currentIndex);
      setRenderedNextIndex(nextIndex);
    }
  }, [currentIndex, isAdvancing, isResetting, nextIndex]);

  useEffect(() => {
    setIsPaused(false);
  }, [currentIndex]);

  useEffect(() => {
    if (loopCount > 0) {
      onLoop?.();
      setLoopCount(0);
    }
  }, [loopCount, onLoop]);

  return (
    <main className="app-shell">
      <section className="feed-shell" {...handlers}>
        <div
          className={[
            "feed-stack",
            isDragging ? "feed-stack--dragging" : "",
            isAdvancing ? "feed-stack--advancing" : "",
            isResetting ? "feed-stack--resetting" : "",
            isSettling ? "feed-stack--settling" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateY(${dragOffset}px)` }}
        >
          <div className="feed-page">
            {renderSlide(currentItem, stage)}
            {isCountryItem(currentItem) ? (
              <RevealProgress
                action={
                  <button
                    className="progress-action__button"
                    type="button"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsPaused((paused) => !paused);
                    }}
                  >
                    {isPaused ? "再開" : "一時停止"}
                  </button>
                }
                current={renderedCurrentIndex}
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
              <p
                className={
                  !isCountryItem(currentItem) && currentItem.type === "intro"
                    ? "feed-footer__hint"
                    : undefined
                }
              >
                {isCountryItem(currentItem)
                  ? isPaused
                    ? "一時停止中"
                    : "上にスワイプして次へ"
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
                current={renderedNextIndex}
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
