import { useEffect, useRef, useState } from "react";

type UseVerticalSwipeOptions = {
  onSwipeUp: () => void;
  isDisabled?: boolean;
  threshold?: number;
  advanceDurationMs?: number;
};

export function useVerticalSwipe({
  onSwipeUp,
  isDisabled = false,
  threshold = 90,
  advanceDurationMs = 280,
}: UseVerticalSwipeOptions) {
  const startYRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const handlePointerDown: React.PointerEventHandler<HTMLElement> = (event) => {
    if (isAdvancing || isDisabled) {
      return;
    }

    startYRef.current = event.clientY;
    pointerIdRef.current = event.pointerId;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      return;
    }

    if (pointerIdRef.current !== event.pointerId || startYRef.current === null) {
      return;
    }

    const distance = event.clientY - startYRef.current;
    setDragOffset(distance);
  };

  const resetDrag = () => {
    startYRef.current = null;
    pointerIdRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handlePointerUp: React.PointerEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      resetDrag();
      return;
    }

    if (pointerIdRef.current !== event.pointerId || startYRef.current === null) {
      return;
    }

    const container = event.currentTarget;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.getPropertyValue("--feed-gap")) || 0;
    const advanceDistance = container.clientHeight + gap;
    const deltaY = event.clientY - startYRef.current;
    const shouldAdvance = deltaY <= -threshold;

    if (shouldAdvance) {
      startYRef.current = null;
      pointerIdRef.current = null;
      setIsDragging(false);
      setIsAdvancing(true);
      setDragOffset(-advanceDistance);

      advanceTimeoutRef.current = window.setTimeout(() => {
        setIsResetting(true);

        resetFrameRef.current = window.requestAnimationFrame(() => {
          onSwipeUp();
          setIsAdvancing(false);
          setDragOffset(0);

          resetFrameRef.current = window.requestAnimationFrame(() => {
            setIsResetting(false);
            setIsSettling(true);
            settleTimeoutRef.current = window.setTimeout(() => {
              setIsSettling(false);
            }, 180);
          });
        });
      }, advanceDurationMs);

      return;
    }

    resetDrag();
  };

  const handlePointerCancel: React.PointerEventHandler<HTMLElement> = () => {
    resetDrag();
  };

  useEffect(() => {
    if (isDisabled) {
      resetDrag();
    }
  }, [isDisabled]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }

      if (resetFrameRef.current !== null) {
        window.cancelAnimationFrame(resetFrameRef.current);
      }

      if (settleTimeoutRef.current !== null) {
        window.clearTimeout(settleTimeoutRef.current);
      }
    };
  }, []);

  return {
    dragOffset,
    isAdvancing,
    isDragging,
    isResetting,
    isSettling,
    handlers: {
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  };
}
