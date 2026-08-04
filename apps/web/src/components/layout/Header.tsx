"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Heart, Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/stores";
import { tokens } from "@/lib/tokens";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useSettingsStore();

  const isDetail = pathname.startsWith("/wallpaper/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, router]);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  const isDark = theme !== "light";

  if (isDetail) return null;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        background: scrolled
          ? "rgba(11,11,12,0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(1.5)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(1.5)" : "none",
      } as React.CSSProperties}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1440,
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${tokens.color.primary}, ${tokens.color.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.15rem",
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${tokens.color.primary}, ${tokens.color.secondaryLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            WallHub
          </span>
        </Link>

        <div
          style={{
            flex: 1,
            maxWidth: 480,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form
                key="search-expanded"
                initial={{ opacity: 0, scaleX: 0.9 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.9 }}
                transition={{ duration: 0.2, ease: tokens.animation.ease }}
                onSubmit={handleSearch}
                style={{ width: "100%" }}
              >
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wallpapers"
                  aria-label="Search wallpapers"
                  onBlur={() => {
                    setTimeout(() => {
                      if (!searchQuery) setSearchOpen(false);
                    }, 200);
                  }}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: tokens.radius.pill,
                    padding: "0 20px",
                    border: "none",
                    background: tokens.color.surface,
                    color: tokens.color.textPrimary,
                    fontSize: "0.875rem",
                    outline: "none",
                    boxShadow: tokens.shadow.search,
                  }}
                />
              </motion.form>
            ) : (
              <motion.button
                key="search-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 48,
                  borderRadius: tokens.radius.pill,
                  padding: "0 16px",
                  border: "none",
                  background: tokens.color.surface,
                  color: tokens.color.textSecondary,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  minWidth: 48,
                  width: "100%",
                  boxShadow: tokens.shadow.subtle,
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = tokens.color.surfaceVariant;
                  e.currentTarget.style.boxShadow = tokens.shadow.search;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = tokens.color.surface;
                  e.currentTarget.style.boxShadow = tokens.shadow.subtle;
                }}
              >
                <Search size={18} />
                <span className="search-label">Search wallpapers</span>
                <span
                  style={{
                    marginLeft: "auto",
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: tokens.color.surfaceVariant,
                    fontSize: "0.6875rem",
                    color: tokens.color.textTertiary,
                  }}
                  className="search-shortcut"
                >
                  /
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => router.push("/favorites")}
            aria-label="Favorites"
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radius.button,
              border: "none",
              background: "transparent",
              color: tokens.color.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tokens.color.surface;
              e.currentTarget.style.color = tokens.color.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = tokens.color.textSecondary;
            }}
          >
            <Heart size={20} />
          </button>

          <button
            onClick={toggleTheme}
            aria-label={`Switch theme, current: ${theme}`}
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radius.button,
              border: "none",
              background: "transparent",
              color: tokens.color.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tokens.color.surface;
              e.currentTarget.style.color = tokens.color.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = tokens.color.textSecondary;
            }}
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={() => router.push("/settings")}
            aria-label="Settings"
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radius.button,
              border: "none",
              background: "transparent",
              color: tokens.color.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tokens.color.surface;
              e.currentTarget.style.color = tokens.color.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = tokens.color.textSecondary;
            }}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          header { height: 64px; padding: 0 16px !important; }
          .search-label { display: none; }
          .search-shortcut { display: none; }
        }
        @media (max-width: 640px) {
          header { height: 56px; padding: 0 12px !important; }
        }
      `}</style>
    </header>
  );
}
