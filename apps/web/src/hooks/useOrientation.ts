"use client";

import { useSettingsStore } from "@/lib/stores";
import { useDeviceOrientation } from "./useDeviceOrientation";
import type { OrientationPreference } from "@/types";

const PORTRAIT_RATIOS = "9x16,9x18,9x19,9x20,10x16";
const LANDSCAPE_RATIOS = "16x9,16x10,21x9,32x9";

const orientationConfig: Record<
  OrientationPreference,
  { ratios: string; atleast: string; label: string; subtitle: string }
> = {
  phone: {
    ratios: PORTRAIT_RATIOS,
    atleast: "1080x1920",
    label: "Phone Wallpapers",
    subtitle: "Optimized for mobile screens",
  },
  desktop: {
    ratios: LANDSCAPE_RATIOS,
    atleast: "1920x1080",
    label: "Desktop Wallpapers",
    subtitle: "Optimized for desktop monitors",
  },
  all: {
    ratios: "",
    atleast: "1920x1080",
    label: "All Wallpapers",
    subtitle: "Browse all aspect ratios",
  },
};

export function useOrientation() {
  const deviceOrientation = useDeviceOrientation();
  const storedPreference = useSettingsStore((s) => s.orientation);
  const setPreference = useSettingsStore((s) => s.setOrientation);

  const resolved: OrientationPreference =
    storedPreference === "all" ? deviceOrientation : storedPreference;

  const config = orientationConfig[resolved] || orientationConfig.all;

  return {
    deviceOrientation,
    preference: storedPreference,
    resolved,
    setPreference,
    ratios: config.ratios,
    atleast: config.atleast,
    label: config.label,
    subtitle: config.subtitle,
  };
}

export { orientationConfig };
