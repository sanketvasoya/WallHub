import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Wallpapers – Free 4K & HD Wallpaper Search",
  description:
    "Search for free 4K, AMOLED, Minimal, Abstract, Nature and Desktop wallpapers. Browse and download high-quality wallpapers for any device.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/search` },
  openGraph: {
    title: "Search Wallpapers – Free 4K & HD Wallpaper Search | Wallection",
    description:
      "Search for free 4K, AMOLED, Minimal, Abstract, Nature and Desktop wallpapers.",
    url: `${SITE_URL}/search`,
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
