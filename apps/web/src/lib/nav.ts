import { Home, Category, Search, Favorite, Settings, Collections, Download, MoreHoriz } from "@mui/icons-material";
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
  { label: "Collections", mobileLabel: "Collections", icon: Collections, href: "/collections" },
  { label: "Search", mobileLabel: "Search", icon: Search, href: "/search" },
  { label: "Favorites", mobileLabel: "Favorites", icon: Favorite, href: "/favorites" },
  { label: "Downloads", mobileLabel: "Downloads", icon: Download, href: "/downloads" },
  { label: "Settings", mobileLabel: "Settings", icon: Settings, href: "/settings" },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", mobileLabel: "Home", icon: Home, href: "/" },
  { label: "Categories", mobileLabel: "Explore", icon: Category, href: "/category/trending" },
  { label: "Search", mobileLabel: "Search", icon: Search, href: "/search" },
  { label: "Favorites", mobileLabel: "Favorites", icon: Favorite, href: "/favorites" },
  { label: "More", mobileLabel: "More", icon: MoreHoriz, href: "__more__" },
];

export const moreMenuItems: NavItem[] = [
  { label: "Downloads", mobileLabel: "Downloads", icon: Download, href: "/downloads" },
  { label: "Collections", mobileLabel: "Collections", icon: Collections, href: "/collections" },
  { label: "Settings", mobileLabel: "Settings", icon: Settings, href: "/settings" },
];

export function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "__more__") {
    return moreMenuItems.some((item) => isActive(item.href, pathname));
  }
  return pathname === href || pathname.startsWith(href + "/");
}

