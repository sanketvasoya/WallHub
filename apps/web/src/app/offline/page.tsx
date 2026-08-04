import type { Metadata } from "next";
import OfflinePage from "./OfflinePage";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OfflinePage />;
}
