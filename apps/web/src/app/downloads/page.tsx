import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import DownloadsClient from "./DownloadsClient";

export const metadata: Metadata = {
  title: "Download History – Previously Downloaded Wallpapers",
  description:
    "View your wallpaper download history on Wallection. Access wallpapers you have previously downloaded.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/downloads` },
};

export default function DownloadsPage() {
  return <DownloadsClient />;
}
