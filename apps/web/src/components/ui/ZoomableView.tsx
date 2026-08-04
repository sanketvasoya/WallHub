"use client";

import { ReactNode, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface ZoomableViewProps {
  children: ReactNode;
  maxScale?: number;
  minScale?: number;
  onScaleChange?: (scale: number) => void;
}

export default function ZoomableView({
  children,
  maxScale = 5,
  minScale = 1,
  onScaleChange,
}: ZoomableViewProps) {
  const handleTransformed = useCallback(
    (ref: { state: { scale: number } }) => {
      onScaleChange?.(ref.state.scale);
    },
    [onScaleChange]
  );

  return (
    <TransformWrapper
      initialScale={1}
      minScale={minScale}
      maxScale={maxScale}
      wheel={{ step: 0.1 }}
      pinch={{ step: 5 }}
      doubleClick={{ step: 2 }}
      panning={{ disabled: false }}
      limitToBounds={true}
      centerZoomedOut={true}
      onTransform={handleTransformed}
    >
      <TransformComponent
        wrapperStyle={{
          width: "100%",
          height: "100%",
        }}
        contentStyle={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </TransformComponent>
    </TransformWrapper>
  );
}
