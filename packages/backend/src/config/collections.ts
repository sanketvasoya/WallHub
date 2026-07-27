import type { Collection } from "@wallhub/types";

export const COLLECTIONS: Collection[] = [
  {
    slug: "nature-escapes",
    name: "Nature Escapes",
    description: "Breathtaking natural landscapes and scenery",
    icon: "Park",
    query: "nature landscape scenery",
    categories: "100",
    sorting: "toplist",
  },
  {
    slug: "cosmic-wonders",
    name: "Cosmic Wonders",
    description: "Galaxies, nebulae, and deep space imagery",
    icon: "RocketLaunch",
    query: "space galaxy nebula stars",
    categories: "100",
    sorting: "toplist",
  },
  {
    slug: "urban-jungle",
    name: "Urban Jungle",
    description: "City skylines and urban photography",
    icon: "LocationCity",
    query: "city urban skyline architecture",
    categories: "100",
    sorting: "toplist",
  },
  {
    slug: "dark-elegance",
    name: "Dark Elegance",
    description: "Dark themed and AMOLED wallpapers",
    icon: "Brightness4",
    query: "dark black amoled minimal",
    categories: "100",
    sorting: "toplist",
  },
  {
    slug: "anime-world",
    name: "Anime World",
    description: "Best anime wallpapers and illustrations",
    icon: "Animation",
    query: "anime",
    categories: "010",
    sorting: "toplist",
  },
  {
    slug: "neon-dreams",
    name: "Neon Dreams",
    description: "Cyberpunk and neon aesthetic wallpapers",
    icon: "Lightbulb",
    query: "neon cyberpunk futuristic glow",
    categories: "100",
    sorting: "toplist",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
