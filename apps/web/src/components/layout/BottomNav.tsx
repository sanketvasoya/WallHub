"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Heart, Download, Settings } from "lucide-react";
import { mobileNavItems, isActive } from "@/lib/nav";
import { tokens } from "@/lib/tokens";
import { useFavorites } from "@/hooks/useFavorites";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useFavorites();

  const isDetail = pathname.startsWith("/wallpaper/");
  if (isDetail) return null;

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        height: "calc(56px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))",
        background: "rgba(11,11,12,0.92)",
        backdropFilter: "blur(12px) saturate(1.5)",
        WebkitBackdropFilter: "blur(12px) saturate(1.5)",
        borderTop: `1px solid ${tokens.color.border}`,
      }}
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, pathname);
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 16px",
              border: "none",
              background: "transparent",
              color: active ? tokens.color.primary : tokens.color.textTertiary,
              cursor: "pointer",
              fontSize: "0.6rem",
              fontWeight: active ? 600 : 500,
              transition: "color 0.2s ease",
              minWidth: 44,
              minHeight: 44,
              position: "relative",
              touchAction: "manipulation",
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={22} aria-hidden="true" />
              {item.href === "/favorites" && count > 0 && (
                <span
                  aria-label={`${count} favorites`}
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: tokens.color.primary,
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    transition: "transform 0.2s ease",
                  }}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </div>
            <span>{item.mobileLabel}</span>
            {active && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: tokens.color.primary,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
