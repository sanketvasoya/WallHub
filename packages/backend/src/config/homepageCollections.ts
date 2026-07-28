export interface HomepageCollection {
  id: string;
  name: string;
  query: string;
  categories: string;
  sorting: string;
  topRange: string;
  colors?: string[];
  weight: number;
  aspectRatio?: string;
}

export const HOMEPAGE_COLLECTIONS: HomepageCollection[] = [
  {
    id: "minimal",
    name: "Minimal",
    query: "minimal",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    colors: ["000000", "FFFFFF", "3d3d3d"],
    weight: 25,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "abstract",
    name: "Abstract",
    query: "abstract gradient",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    colors: ["6633CC", "0066CC", "009933"],
    weight: 20,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "nature",
    name: "Nature",
    query: "minimal landscape mountain forest fog mist",
    categories: "100",
    sorting: "toplist",
    topRange: "3M",
    colors: ["009933", "336633", "1a1a2e"],
    weight: 20,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "architecture",
    name: "Architecture",
    query: "modern architecture interior glassmorphism",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    weight: 10,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "space",
    name: "Space",
    query: "space nebula moon earth stars cosmos",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    colors: ["000033", "000066", "0000CC"],
    weight: 10,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "amoled",
    name: "AMOLED",
    query: "amoled black oled dark minimal",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    colors: ["000000"],
    weight: 10,
    aspectRatio: "16:9,16:10,21:9",
  },
  {
    id: "gradient",
    name: "Gradient",
    query: "gradient colorful smooth abstract",
    categories: "100",
    sorting: "toplist",
    topRange: "1M",
    weight: 5,
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
  minWidth: 3840,
  minHeight: 2160,
  aspectRatios: ["16:9", "16:10", "21:9"],
  minFavorites: 500,
  minViews: 10000,
  excludeKeywords: [...HOMEPAGE_BLOCKED_KEYWORDS],
};
