import { useRef, useState } from "react";

type UseVerticalSwipeOptions = {
  onSwipeUp: () => void;
  threshold?: number;
};

export function useVerticalSwipe({
  onSwipeUp,
  threshold = 90,
}: UseVerticalSwipeOptions) {
  const startYRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePointerDown: React.PointerEventHandler<HTMLElement> = (event) => {
    startYRef.current = event.clientY;
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLElement> = (event) => {
    if (pointerIdRef.current !== event.pointerId || startYRef.current === null) {
      return;
    }

    const distance = event.clientY - startYRef.current;
    setDragOffset(Math.min(distance, 60));
  };

  const resetDrag = () => {
    startYRef.current = null;
    pointerIdRef.current = null;
    setDragOffset(0);
  };

  const handlePointerUp: React.PointerEventHandler<HTMLElement> = (event) => {
    if (pointerIdRef.current !== event.pointerId || startYRef.current === null) {
      return;
    }

    const deltaY = event.clientY - startYRef.current;
    const shouldAdvance = deltaY <= -threshold;

    resetDrag();

    if (shouldAdvance) {
      onSwipeUp();
    }
  };

  const handlePointerCancel: React.PointerEventHandler<HTMLElement> = () => {
    resetDrag();
  };

  return {
    dragOffset,
    handlers: {
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  };
}
