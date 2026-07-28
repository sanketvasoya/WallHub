import { Home, Search, Heart, Settings, Grid3X3, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
  href: string;
}

export const mobileNavItems: NavItem[] = [
  { label: "Home", mobileLabel: "Home", icon: Home, href: "/" },
  { label: "Collections", mobileLabel: "Explore", icon: Grid3X3, href: "/collections" },
  { label: "Search", mobileLabel: "Search", icon: Search, href: "/search" },
  { label: "Favorites", mobileLabel: "Favorites", icon: Heart, href: "/favorites" },
  { label: "Settings", mobileLabel: "Settings", icon: Settings, href: "/settings" },
];

export const navItems: NavItem[] = [
  { label: "Home", mobileLabel: "Home", icon: Home, href: "/" },
  { label: "Collections", mobileLabel: "Collections", icon: Grid3X3, href: "/collections" },
  { label: "Search", mobileLabel: "Search", icon: Search, href: "/search" },
  { label: "Favorites", mobileLabel: "Favorites", icon: Heart, href: "/favorites" },
  { label: "Settings", mobileLabel: "Settings", icon: Settings, href: "/settings" },
];

export function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
