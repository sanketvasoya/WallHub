"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Trash2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useDownloadHistoryStore } from "@/lib/stores";
import { formatRelativeTime } from "@/lib/utils";
import { downloadFile } from "@/hooks/useWallpaperActions";
import NextLink from "next/link";
import { tokens } from "@/lib/tokens";
import toast from "react-hot-toast";

export default function DownloadsClient() {
  const router = useRouter();
  const { history, loaded, loadHistory, removeDownload, clearHistory } = useDownloadHistoryStore();
  const [redownloadId, setRedownloadId] = useState<string | null>(null);
  const [redownloadProgress, setRedownloadProgress] = useState(0);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRedownload = useCallback(
    async (entry: { id: string; wallpaperId: string; title: string; image?: string }) => {
      if (!entry.image) {
        router.push(`/wallpaper/${entry.wallpaperId}`);
        return;
      }

      setRedownloadId(entry.id);
      setRedownloadProgress(0);

      try {
        const ext = (() => {
          try {
            const pathname = new URL(entry.image).pathname;
            const lastDot = pathname.lastIndexOf(".");
            if (lastDot === -1) return "jpg";
            const e = pathname.slice(lastDot + 1).toLowerCase();
            return e.length > 0 && e.length <= 4 ? e : "jpg";
          } catch {
            return "jpg";
          }
        })();
        const safeTitle = entry.title.replace(/[^a-zA-Z0-9_-]/g, "_");
        const filename = `${safeTitle}.${ext}`;

        await downloadFile(entry.image, filename, setRedownloadProgress);
        toast.success("Re-download complete!");
        setTimeout(() => {
          setRedownloadId(null);
          setRedownloadProgress(0);
        }, 2000);
      } catch {
        toast.error("Re-download failed.");
        setRedownloadId(null);
        setRedownloadProgress(0);
      }
    },
    [router],
  );

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
      <div style={{ padding: "16px 24px 8px" }}>
        <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: tokens.radius.button,
              background: `linear-gradient(135deg, ${tokens.color.primaryAlpha20}, ${tokens.color.primaryAlpha10})`,
              display: "flex",
              alignItems: "center", justifyContent: "center", color: tokens.color.primary,
            }}>
              <Download size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: tokens.color.textPrimary, letterSpacing: "-0.02em" }}>
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
                {entry.image && (
                  <button
                    aria-label="Re-download"
                    onClick={() => handleRedownload(entry)}
                    disabled={redownloadId === entry.id}
                    style={{
                      width: 44, height: 44, borderRadius: "50%", border: "none",
                      background: redownloadId === entry.id ? tokens.color.primaryAlpha20 : tokens.color.surfaceVariant,
                      color: tokens.color.primary,
                      cursor: redownloadId === entry.id ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s ease",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (redownloadId !== entry.id) e.currentTarget.style.background = tokens.color.primaryAlpha30;
                    }}
                    onMouseLeave={(e) => {
                      if (redownloadId !== entry.id) e.currentTarget.style.background = tokens.color.surfaceVariant;
                    }}
                  >
                    {redownloadId === entry.id ? (
                      <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: "absolute", top: 0, left: 0 }}>
                        <circle
                          cx="22" cy="22" r="20"
                          fill="none" stroke={tokens.color.primary} strokeWidth="2"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - redownloadProgress / 100)}`}
                          transform="rotate(-90 22 22)"
                          style={{ transition: "stroke-dashoffset 0.3s ease" }}
                        />
                      </svg>
                    ) : null}
                    <RotateCcw size={16} style={{ position: "relative", zIndex: 1 }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
