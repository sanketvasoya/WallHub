import type { Wallpaper } from "@/types";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: [],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function imageObjectSchema(wallpaper: Wallpaper) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: wallpaper.image,
    thumbnailUrl: wallpaper.thumbnail,
    width: wallpaper.width,
    height: wallpaper.height,
    name: wallpaper.title,
    description: `${wallpaper.title} wallpaper in ${wallpaper.width}x${wallpaper.height} resolution`,
    author: wallpaper.author ? {
      "@type": "Person",
      name: wallpaper.author,
    } : undefined,
    datePublished: wallpaper.createdAt || undefined,
  };
}

export function webpageSchema(title: string, description: string, url: string, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: image } } : {}),
  };
}

export function searchResultsPageSchema(query: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Search results for "${query}"`,
    description: `Search results for "${query}" on ${SITE_NAME}`,
    url,
    mainEntity: {
      "@type": "ItemList",
      name: `Results for "${query}"`,
    },
  };
}

export function collectionPageSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  };
}
