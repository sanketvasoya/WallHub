import type { Metadata } from "next";

const SITE_NAME = "Wallection";
const DEFAULT_DESCRIPTION = "Discover and download stunning high-quality wallpapers for your desktop and mobile devices.";

export function generateWallpaperMetadata(wallpaper: {
  title: string;
  description?: string;
  image: string;
  width: number;
  height: number;
}): Metadata {
  return {
    title: wallpaper.title,
    description: wallpaper.description || `${wallpaper.title} - Download free wallpaper from ${SITE_NAME}`,
    openGraph: {
      title: wallpaper.title,
      description: wallpaper.description || `${wallpaper.title} - Download free wallpaper from ${SITE_NAME}`,
      images: [
        {
          url: wallpaper.image,
          width: wallpaper.width,
          height: wallpaper.height,
          alt: wallpaper.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: wallpaper.title,
      description: wallpaper.description || `${wallpaper.title} - Download free wallpaper from ${SITE_NAME}`,
      images: [wallpaper.image],
    },
  };
}

export function generateCategoryMetadata(category: {
  name: string;
  description: string;
}): Metadata {
  return {
    title: `${category.name} Wallpapers`,
    description: category.description || `Browse the best ${category.name.toLowerCase()} wallpapers on ${SITE_NAME}`,
    openGraph: {
      title: `${category.name} Wallpapers | ${SITE_NAME}`,
      description: category.description || `Browse the best ${category.name.toLowerCase()} wallpapers on ${SITE_NAME}`,
      type: "website",
    },
  };
}

export function generateSearchMetadata(query: string): Metadata {
  return {
    title: `Search: ${query}`,
    description: `Search results for "${query}" on ${SITE_NAME}. Find and download wallpapers.`,
    openGraph: {
      title: `Search: ${query} | ${SITE_NAME}`,
      description: `Search results for "${query}" on ${SITE_NAME}`,
      type: "website",
    },
  };
}

export function generateCollectionMetadata(collection: {
  name: string;
  description: string;
}): Metadata {
  return {
    title: `${collection.name} Collection`,
    description: collection.description || `Curated ${collection.name.toLowerCase()} wallpaper collection on ${SITE_NAME}`,
    openGraph: {
      title: `${collection.name} Collection | ${SITE_NAME}`,
      description: collection.description || `Curated ${collection.name.toLowerCase()} wallpaper collection on ${SITE_NAME}`,
      type: "website",
    },
  };
}
