"use client";

import { useRef, useCallback } from "react";

interface UseSwipeNavigationOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

interface SwipeHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
}: UseSwipeNavigationOptions): SwipeHandlers {
  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    isSwiping.current = true;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isSwiping.current) return;
      isSwiping.current = false;

      const deltaX = e.clientX - startX.current;
      const deltaY = e.clientY - startY.current;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
    },
    [onSwipeLeft, onSwipeRight, threshold]
  );

  return { onPointerDown, onPointerUp };
}
