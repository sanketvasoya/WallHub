import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AnalyticsTracker } from "@/providers/AnalyticsTracker";
import { ServiceWorkerRegistration } from "@/providers/ServiceWorkerRegistration";
import { Toaster } from "react-hot-toast";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Wallection - Premium Wallpapers",
    template: "%s | Wallection",
  },
  description:
    "Discover and download stunning high-quality wallpapers for your desktop and mobile devices.",
  keywords: ["wallpapers", "4K", "HD", "backgrounds", "desktop", "mobile", "AMOLED", "nature", "space"],
  authors: [{ name: "Wallection" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wallection",
    title: "Wallection - Premium Wallpapers",
    description: "Discover and download stunning high-quality wallpapers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallection - Premium Wallpapers",
    description: "Discover and download stunning high-quality wallpapers.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning>
        <a id="skip-to-content" href="#main-content">
          Skip to content
        </a>
        <ThemeProvider>
          <QueryProvider>
            <AnalyticsTracker />
            <ServiceWorkerRegistration />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "rgba(14,14,22,0.95)",
                  color: "#f0f0f5",
                  backdropFilter: "blur(20px)",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.06)",
                },
              }}
            />
            <main id="main-content">
              {children}
            </main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
