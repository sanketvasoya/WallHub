import type { Metadata } from "next";
import type { Wallpaper } from "@/types";
import {
  SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS,
  TWITTER_HANDLE, CREATOR_NAME, OG_IMAGE_DEFAULT,
  OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT,
} from "@/lib/constants";

const defaultOgImage = {
  url: OG_IMAGE_DEFAULT,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: SITE_NAME,
};

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} – Free 4K & AMOLED Wallpapers for Mobile and Desktop`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: CREATOR_NAME, url: SITE_URL }],
    creator: CREATOR_NAME,
    publisher: CREATOR_NAME,
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
      siteName: SITE_NAME,
      title: `${SITE_NAME} – Free 4K & AMOLED Wallpapers for Mobile and Desktop`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: `${SITE_NAME} – Free 4K & AMOLED Wallpapers for Mobile and Desktop`,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE_DEFAULT],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    alternates: {
      canonical: SITE_URL,
    },
    other: {
      "theme-color": "#0B0B0C",
      "msapplication-TileColor": "#0B0B0C",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": SITE_NAME,
    },
  };
}

export function homepageMetadata(): Metadata {
  return {
    title: `${SITE_NAME} – Free 4K & AMOLED Wallpapers for Mobile and Desktop`,
    description: SITE_DESCRIPTION,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `${SITE_NAME} – Free 4K & AMOLED Wallpapers for Mobile and Desktop`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} – Free 4K & AMOLED Wallpapers for Mobile and Desktop`,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE_DEFAULT],
    },
  };
}

export function wallpaperMetadata(wallpaper: Wallpaper, url: string): Metadata {
  const title = wallpaper.title
    ? `${wallpaper.title} in ${wallpaper.width}x${wallpaper.height} – Free Wallpaper Download`
    : `Wallpaper in ${wallpaper.width}x${wallpaper.height} – Free Download | ${SITE_NAME}`;

  const description = wallpaper.title
    ? `Download this ${wallpaper.title} wallpaper in ${wallpaper.width}x${wallpaper.height} resolution for mobile and desktop. Free high-quality wallpaper download.`
    : `Download this wallpaper in ${wallpaper.width}x${wallpaper.height} resolution for free on ${SITE_NAME}. High-quality wallpaper for mobile and desktop.`;

  const ogImage = {
    url: wallpaper.image,
    width: wallpaper.width,
    height: wallpaper.height,
    alt: wallpaper.title || `Wallpaper in ${wallpaper.width}x${wallpaper.height}`,
  };

  return {
    title,
    description,
    keywords: [
      ...(wallpaper.tags || []),
      `${wallpaper.width}x${wallpaper.height}`,
      "wallpaper download",
      "free wallpaper",
      ...(wallpaper.orientation === "portrait"
        ? ["mobile wallpaper", "iPhone wallpaper", "Android wallpaper"]
        : ["desktop wallpaper", "4K wallpaper"]),
    ],
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [ogImage],
      publishedTime: wallpaper.createdAt || undefined,
      authors: wallpaper.author ? [wallpaper.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [wallpaper.image],
    },
    other: {
      "article:tag": wallpaper.tags?.join(", ") || "",
    },
  };
}

export function searchMetadata(query: string): Metadata {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      title: "Search Wallpapers",
      description: `Search for wallpapers on ${SITE_NAME}. Find and download free high-quality wallpapers.`,
      robots: { index: false, follow: true },
      alternates: { canonical: `${SITE_URL}/search` },
    };
  }

  return {
    title: `Search Results for "${trimmed}" – Free Wallpapers`,
    description: `Search results for "${trimmed}" on ${SITE_NAME}. Browse and download free high-quality wallpapers matching "${trimmed}".`,
    keywords: [trimmed, ...SITE_KEYWORDS],
    alternates: { canonical: `${SITE_URL}/search` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `Search Results for "${trimmed}" – Free Wallpapers | ${SITE_NAME}`,
      description: `Search results for "${trimmed}" on ${SITE_NAME}. Browse and download free high-quality wallpapers.`,
      url: `${SITE_URL}/search?q=${encodeURIComponent(trimmed)}`,
      images: [defaultOgImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Search Results for "${trimmed}" – Free Wallpapers | ${SITE_NAME}`,
      description: `Search results for "${trimmed}" on ${SITE_NAME}`,
      images: [OG_IMAGE_DEFAULT],
    },
  };
}

export function favoritesMetadata(): Metadata {
  return {
    title: "Favorite Wallpapers",
    description: `Your favorite wallpapers on ${SITE_NAME}. Browse and download your saved wallpapers.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/favorites` },
  };
}

export function downloadsMetadata(): Metadata {
  return {
    title: "Download History",
    description: `Your wallpaper download history on ${SITE_NAME}. View previously downloaded wallpapers.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/downloads` },
  };
}

export function settingsMetadata(): Metadata {
  return {
    title: "Settings",
    description: `Customize your ${SITE_NAME} experience. Theme, wallpaper orientation preferences, and data management.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/settings` },
  };
}

export function notFoundMetadata(): Metadata {
  return {
    title: "404 – Page Not Found",
    description: "The page you are looking for does not exist. Browse our wallpaper collection instead.",
    robots: { index: false, follow: false },
    alternates: { canonical: SITE_URL },
  };
}
