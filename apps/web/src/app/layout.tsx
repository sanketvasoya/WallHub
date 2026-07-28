import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AnalyticsTracker } from "@/providers/AnalyticsTracker";
import { ServiceWorkerRegistration } from "@/providers/ServiceWorkerRegistration";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Wallection — Discover Beautiful Wallpapers",
    template: "%s | Wallection",
  },
  description:
    "Discover and download stunning high-quality wallpapers for your desktop and mobile devices.",
  keywords: ["wallpapers", "4K", "HD", "backgrounds", "desktop", "mobile", "AMOLED", "nature", "space", "minimal"],
  authors: [{ name: "Wallection" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wallection",
    title: "Wallection — Discover Beautiful Wallpapers",
    description: "Discover and download stunning high-quality wallpapers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallection — Discover Beautiful Wallpapers",
    description: "Discover and download stunning high-quality wallpapers.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBFF" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
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
                  background: "rgba(15, 23, 42, 0.92)",
                  color: "#f8fafc",
                  backdropFilter: "blur(16px)",
                  borderRadius: "14px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "10px 16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
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
