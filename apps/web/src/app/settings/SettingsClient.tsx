"use client";

import { Settings, Moon, Sun, Monitor, Trash2, Smartphone, Monitor as DesktopIcon, Image } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useSettingsStore, useSearchHistoryStore, useDownloadHistoryStore } from "@/lib/stores";
import { useOrientation } from "@/hooks/useOrientation";
import { tokens } from "@/lib/tokens";
import { SITE_NAME } from "@/lib/constants";
import toast from "react-hot-toast";

export default function SettingsClient() {
  const themeVal = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const clearSearchHistory = useSearchHistoryStore((s) => s.clearHistory);
  const clearDownloadHistory = useDownloadHistoryStore((s) => s.clearHistory);
  const { resolved: orientation, setPreference: setOrientation } = useOrientation();

  const handleClearSearch = () => {
    clearSearchHistory();
    toast.success("Search history cleared");
  };

  const handleClearDownloads = () => {
    clearDownloadHistory();
    toast.success("Download history cleared");
  };

  const themeOptions = [
    { value: "dark", icon: <Moon size={16} />, label: "Dark" },
    { value: "light", icon: <Sun size={16} />, label: "Light" },
    { value: "system", icon: <Monitor size={16} />, label: "System" },
  ] as const;

  const orientationOptions = [
    { value: "phone", icon: <Smartphone size={16} />, label: "Phone" },
    { value: "desktop", icon: <DesktopIcon size={16} />, label: "Desktop" },
    { value: "all", icon: <Image size={16} />, label: "All" },
  ] as const;

  const sectionStyle = { marginBottom: 24 };
  const cardStyle = {
    borderRadius: tokens.radius.button,
    background: tokens.color.surface,
    border: `1px solid ${tokens.color.border}`,
    overflow: "hidden",
  };
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />

      <div style={{ padding: "16px 24px 8px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: tokens.radius.button,
            background: tokens.color.primaryAlpha20, display: "flex",
            alignItems: "center", justifyContent: "center", color: tokens.color.primary,
          }}>
            <Settings size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: tokens.color.textPrimary }}>
              Settings
            </h1>
            <span style={{ fontSize: "0.8rem", color: tokens.color.textSecondary }}>
              Customize your experience
            </span>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: tokens.color.primary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginLeft: 4 }}>
            Appearance
          </div>
          <div style={cardStyle}>
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: tokens.color.textPrimary }}>Theme</div>
                <div style={{ fontSize: "0.78rem", color: tokens.color.textSecondary, marginTop: 2 }}>Choose your preferred theme</div>
              </div>
              <select
                value={themeVal}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                style={{
                  borderRadius: tokens.radius.button, padding: "6px 10px",
                  border: `1px solid ${tokens.color.border}`, background: tokens.color.surfaceVariant,
                  color: tokens.color.textPrimary, fontSize: "0.85rem", fontWeight: 500, outline: "none",
                }}
              >
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: tokens.color.surface, color: tokens.color.textPrimary }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ height: 1, background: tokens.color.border, margin: "0 16px" }} />
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: tokens.color.textPrimary }}>Orientation</div>
                <div style={{ fontSize: "0.78rem", color: tokens.color.textSecondary, marginTop: 2 }}>Filter by aspect ratio</div>
              </div>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as "phone" | "desktop" | "all")}
                style={{
                  borderRadius: tokens.radius.button, padding: "6px 10px",
                  border: `1px solid ${tokens.color.border}`, background: tokens.color.surfaceVariant,
                  color: tokens.color.textPrimary, fontSize: "0.85rem", fontWeight: 500, outline: "none",
                }}
              >
                {orientationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: tokens.color.surface, color: tokens.color.textPrimary }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: tokens.color.primary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginLeft: 4 }}>
            Data
          </div>
          <div style={cardStyle}>
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: tokens.color.textPrimary }}>Search History</div>
                <div style={{ fontSize: "0.78rem", color: tokens.color.textSecondary, marginTop: 2 }}>Clear saved search suggestions</div>
              </div>
              <button onClick={handleClearSearch} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                borderRadius: tokens.radius.button, border: `1px solid ${tokens.color.error}`,
                background: "transparent", color: tokens.color.error, fontSize: "0.8rem",
                fontWeight: 600, cursor: "pointer",
              }}>
                <Trash2 size={14} />
                Clear
              </button>
            </div>
            <div style={{ height: 1, background: tokens.color.border, margin: "0 16px" }} />
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: tokens.color.textPrimary }}>Download History</div>
                <div style={{ fontSize: "0.78rem", color: tokens.color.textSecondary, marginTop: 2 }}>Clear download records</div>
              </div>
              <button onClick={handleClearDownloads} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                borderRadius: tokens.radius.button, border: `1px solid ${tokens.color.error}`,
                background: "transparent", color: tokens.color.error, fontSize: "0.8rem",
                fontWeight: 600, cursor: "pointer",
              }}>
                <Trash2 size={14} />
                Clear
              </button>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: tokens.color.primary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginLeft: 4 }}>
            About
          </div>
          <div style={cardStyle}>
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: tokens.color.textPrimary }}>{SITE_NAME}</div>
                <div style={{ fontSize: "0.78rem", color: tokens.color.textSecondary, marginTop: 2 }}>Version 3.0.0</div>
              </div>
            </div>
            <div style={{ height: 1, background: tokens.color.border, margin: "0 16px" }} />
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 500, color: tokens.color.textPrimary }}>Stack</div>
                <div style={{ fontSize: "0.78rem", color: tokens.color.textSecondary, marginTop: 2 }}>Next.js 15 · Fastify · Wallhaven</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
