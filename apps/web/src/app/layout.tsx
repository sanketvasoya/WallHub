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
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wallection.vercel.app"),
  title: {
    default: "Wallection – Free 4K & AMOLED Wallpapers for Mobile and Desktop",
    template: "%s | Wallection",
  },
  description:
    "Discover beautiful 4K, AMOLED, Minimal, Abstract, Nature and Desktop wallpapers. Download high-quality wallpapers for Android, iPhone, tablets and desktop for free.",
  keywords: [
    "wallpapers", "4K", "HD", "backgrounds", "desktop", "mobile",
    "AMOLED", "minimal", "abstract", "nature", "dark", "neon",
    "wallpaper download", "free wallpapers", "iPhone wallpapers",
    "Android wallpapers", "4K wallpapers",
  ],
  authors: [{ name: "Wallection", url: "https://wallection.vercel.app" }],
  creator: "Wallection",
  publisher: "Wallection",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wallection",
    title: "Wallection – Free 4K & AMOLED Wallpapers for Mobile and Desktop",
    description:
      "Discover beautiful 4K, AMOLED, Minimal, Abstract, Nature and Desktop wallpapers. Download high-quality wallpapers for Android, iPhone, tablets and desktop for free.",
    url: "https://wallection.vercel.app",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Wallection – Free 4K & AMOLED Wallpapers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wallection",
    creator: "@wallection",
    title: "Wallection – Free 4K & AMOLED Wallpapers for Mobile and Desktop",
    description:
      "Discover beautiful 4K, AMOLED, Minimal, Abstract, Nature and Desktop wallpapers.",
    images: ["/og"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://wallection.vercel.app",
  },
  other: {
    "theme-color": "#0B0B0C",
    "msapplication-TileColor": "#0B0B0C",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Wallection",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
    { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://w.wallhaven.cc" />
        <link rel="dns-prefetch" href="https://preview.redd.it" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Wallection" />
        <meta name="msapplication-TileColor" content="#0B0B0C" />
        <meta name="theme-color" content="#0B0B0C" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F5F5F7" media="(prefers-color-scheme: light)" />
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
