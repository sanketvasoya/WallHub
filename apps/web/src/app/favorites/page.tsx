import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
  title: "Favorite Wallpapers – Your Saved Collection",
  description:
    "Browse your favorite saved wallpapers on Wallection. Access your personal collection of high-quality wallpapers.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/favorites` },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
