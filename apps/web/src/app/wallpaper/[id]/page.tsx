import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import WallpaperClient from "./WallpaperClient";
import type { Wallpaper } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchWallpaperServer(id: string): Promise<Wallpaper | null> {
  try {
    const res = await fetch(`${API_URL}/wallpaper/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const wallpaper = await fetchWallpaperServer(id);

  if (!wallpaper) {
    return {
      title: "Wallpaper Not Found",
      description: "The requested wallpaper could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = wallpaper.title
    ? `${wallpaper.title} in ${wallpaper.width}x${wallpaper.height} – Free Wallpaper Download`
    : `Wallpaper in ${wallpaper.width}x${wallpaper.height} – Free Download | ${SITE_NAME}`;

  const description = wallpaper.title
    ? `Download this ${wallpaper.title} wallpaper in ${wallpaper.width}x${wallpaper.height} resolution for mobile and desktop. Free high-quality wallpaper download.`
    : `Download this wallpaper in ${wallpaper.width}x${wallpaper.height} resolution for free on ${SITE_NAME}. High-quality wallpaper for mobile and desktop.`;

  const url = `${SITE_URL}/wallpaper/${id}`;

  const ogImage = {
    url: wallpaper.image,
    width: wallpaper.width,
    height: wallpaper.height,
    alt: wallpaper.title || `Wallpaper`,
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
      site: "@wallection",
      creator: "@wallection",
      title,
      description,
      images: [wallpaper.image],
    },
  };
}

export default async function WallpaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wallpaper = await fetchWallpaperServer(id);

  if (!wallpaper) {
    return <WallpaperClient id={id} />;
  }

  const url = `${SITE_URL}/wallpaper/${id}`;

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: wallpaper.title || "Wallpaper", url },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      },
      {
        "@type": "ImageObject",
        contentUrl: wallpaper.image,
        thumbnailUrl: wallpaper.thumbnail,
        width: wallpaper.width,
        height: wallpaper.height,
        name: wallpaper.title,
        description: `${wallpaper.title || "Wallpaper"} in ${wallpaper.width}x${wallpaper.height}`,
        author: wallpaper.author
          ? { "@type": "Person", name: wallpaper.author }
          : undefined,
        datePublished: wallpaper.createdAt || undefined,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WallpaperClient id={id} />
    </>
  );
}
