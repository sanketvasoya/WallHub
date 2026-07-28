"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { OrientationPreference } from "@/types";

export function useDeviceOrientation(): OrientationPreference {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (isMobile) return "phone";
  if (isTablet) return "all";
  return "desktop";
}
