"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/api/client";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname, document.referrer);
  }, [pathname]);

  return null;
}
