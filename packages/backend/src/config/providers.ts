export type Provider = "wallhaven" | "wallpaperscom";

export const PROVIDERS: Provider[] = ["wallhaven", "wallpaperscom"];

export const PROVIDER_LABELS: Record<Provider, string> = {
  wallhaven: "Wallhaven",
  wallpaperscom: "Wallpapers.com",
};

export function isValidProvider(s?: string): s is Provider {
  return s === "wallhaven" || s === "wallpaperscom";
}

export interface ProviderSearchOptions {
  query?: string;
  categories?: string;
  page?: number;
  sorting?: string;
  ratios?: string;
  atleast?: string;
}
