"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Heart, Download, Settings } from "lucide-react";
import { mobileNavItems, isActive } from "@/lib/nav";
import { tokens } from "@/lib/tokens";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isDetail = pathname.startsWith("/wallpaper/");
  if (isDetail) return null;

  return (
    <nav
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
        height: 64,
        paddingBottom: 8,
        background: "rgba(11,11,12,0.88)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
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
              minWidth: 0,
              position: "relative",
            }}
          >
            <Icon size={22} />
            <span>{item.mobileLabel}</span>
            {active && (
              <div
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
