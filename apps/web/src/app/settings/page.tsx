import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings – Customize Your Wallpaper Experience",
  description:
    "Customize your Wallection experience. Change theme, wallpaper orientation preferences, and manage your data.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/settings` },
};

export default function SettingsPage() {
  return <SettingsClient />;
}
