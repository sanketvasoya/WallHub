"use client";

import { useSettingsStore } from "@/lib/stores";
import { gridDensity } from "@/lib/tokens";

export function useGridDensity() {
  const density = useSettingsStore((s) => s.gridDensity || "comfortable");
  const config = gridDensity[density] || gridDensity.comfortable;

  return {
    density,
    columns: config.columns,
    gap: config.gap,
  };
}
