"use client";

import { useEffect } from "react";
import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useDownloadHistoryStore } from "@/lib/stores";
import { formatRelativeTime } from "@/lib/utils";
import NextLink from "next/link";
import { tokens } from "@/lib/tokens";

export default function DownloadsPage() {
  const router = useRouter();
  const { history, loaded, loadHistory, removeDownload, clearHistory } = useDownloadHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
      <div style={{ padding: "16px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: tokens.radius.button,
              background: tokens.color.primaryAlpha20, display: "flex",
              alignItems: "center", justifyContent: "center", color: tokens.color.primary,
            }}>
              <Download size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: tokens.color.textPrimary }}>
                Downloads
              </h1>
              {history.length > 0 && (
                <span style={{ fontSize: "0.8rem", color: tokens.color.textSecondary }}>
                  {history.length} wallpapers
                </span>
              )}
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: tokens.radius.button,
                border: "none", background: tokens.color.errorAlpha10,
                color: tokens.color.error, fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>

        {!loaded ? (
          <LoadingSkeleton variant="list" count={5} />
        ) : history.length === 0 ? (
          <ErrorState type="empty" message="No download history" description="Wallpapers you download will appear here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: 12, borderRadius: tokens.radius.button,
                  background: tokens.color.surface,
                  border: `1px solid ${tokens.color.border}`,
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = tokens.color.primaryAlpha30}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = tokens.color.border}
              >
                <NextLink href={`/wallpaper/${entry.wallpaperId}`}>
                  <img
                    src={entry.thumbnail}
                    alt={entry.title}
                    style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", cursor: "pointer" }}
                  />
                </NextLink>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <NextLink href={`/wallpaper/${entry.wallpaperId}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      fontWeight: 600, fontSize: "0.85rem", color: tokens.color.textPrimary,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {entry.title}
                    </div>
                  </NextLink>
                  <div style={{ fontSize: "0.75rem", color: tokens.color.textSecondary, marginTop: 2 }}>
                    {entry.filesize} · Downloaded {formatRelativeTime(entry.downloadedAt)}
                  </div>
                </div>
                <button
                  aria-label="Remove"
                  onClick={() => removeDownload(entry.id)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", border: "none",
                    background: "transparent", color: tokens.color.textTertiary,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = tokens.color.error}
                  onMouseLeave={(e) => e.currentTarget.style.color = tokens.color.textTertiary}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
