import { Home, Category, Search, Favorite, Settings } from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavItem {
  label: string;
  mobileLabel: string;
  icon: SvgIconComponent;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Home", mobileLabel: "Home", icon: Home, href: "/" },
  { label: "Categories", mobileLabel: "Explore", icon: Category, href: "/category/trending" },
  { label: "Search", mobileLabel: "Search", icon: Search, href: "/search" },
  { label: "Favorites", mobileLabel: "Favorites", icon: Favorite, href: "/favorites" },
  { label: "Settings", mobileLabel: "Settings", icon: Settings, href: "/settings" },
];

export function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
