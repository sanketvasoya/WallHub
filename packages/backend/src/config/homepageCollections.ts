export interface HomepageCollection {
  id: string;
  name: string;
  query: string;
  categories: string;
  sorting: string;
  topRange: string;
  weight: number;
  aspectRatio?: string;
}

export const HOMEPAGE_COLLECTIONS: HomepageCollection[] = [
  {
    id: "minimal",
    name: "Minimal",
    query: "minimal minimalism simple clean",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    weight: 30,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "nature",
    name: "Nature",
    query: "landscape mountain forest fog mist",
    categories: "100",
    sorting: "toplist",
    topRange: "3M",
    weight: 25,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "space",
    name: "Space",
    query: "space nebula moon earth stars cosmos galaxy",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    weight: 15,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "architecture",
    name: "Architecture",
    query: "modern architecture interior glassmorphism",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    weight: 15,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "featured",
    name: "Featured",
    query: "abstract gradient amoled dark oled geometric low poly isometric monochrome",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    weight: 15,
    aspectRatio: "16:9,16:10,21:9",
  },
];

export const HOMEPAGE_BLOCKED_KEYWORDS = [
  "anime",
  "character",
  "girl",
  "women",
  "people",
  "celebrity",
  "text",
  "logo",
  "meme",
  "car",
  "motorcycle",
  "weapon",
  "nsfw",
  "nude",
  "sexy",
  "bikini",
  "portrait",
  "vertical",
];

export const HERO_REQUIREMENTS = {
  minWidth: 2560,
  minHeight: 1440,
  aspectRatios: ["16:9", "16:10", "21:9"],
  minFavorites: 500,
  minViews: 10000,
  excludeKeywords: [...HOMEPAGE_BLOCKED_KEYWORDS],
};

export const SECTION_LIMIT = 5;
export const HERO_LIMIT = 6;
export const HOMEPAGE_CACHE_TTL = 86400;
