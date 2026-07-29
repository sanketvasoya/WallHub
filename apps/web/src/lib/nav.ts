import { Home, Heart, Download, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Home", mobileLabel: "Home", icon: Home, href: "/" },
  { label: "Favorites", mobileLabel: "Favorites", icon: Heart, href: "/favorites" },
  { label: "Downloads", mobileLabel: "Downloads", icon: Download, href: "/downloads" },
  { label: "Settings", mobileLabel: "Settings", icon: Settings, href: "/settings" },
];

export const mobileNavItems = navItems;

export function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
