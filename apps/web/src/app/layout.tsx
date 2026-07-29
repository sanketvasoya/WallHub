import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "WallHub — Beautiful Wallpapers",
    template: "%s | WallHub",
  },
  description:
    "Discover and download stunning high-quality wallpapers.",
  keywords: ["wallpapers", "4K", "HD", "backgrounds", "desktop", "mobile", "AMOLED"],
  authors: [{ name: "WallHub" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WallHub",
    title: "WallHub — Beautiful Wallpapers",
    description: "Discover and download stunning high-quality wallpapers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WallHub — Beautiful Wallpapers",
    description: "Discover and download stunning high-quality wallpapers.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
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
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#151518",
                  color: "#F0F0F0",
                  backdropFilter: "blur(16px)",
                  borderRadius: "18px",
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
