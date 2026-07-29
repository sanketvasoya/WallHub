"use client";

import { tokens } from "@/lib/tokens";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px", textAlign: "center", background: tokens.color.bg }}>
      <div style={{
        width: 80, height: 80, borderRadius: tokens.radius.card,
        background: tokens.color.surface, border: `1px solid ${tokens.color.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem", color: tokens.color.textTertiary,
      }}>
        !
      </div>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: tokens.color.textPrimary }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: "0.85rem", color: tokens.color.textSecondary, maxWidth: 360, lineHeight: 1.5, margin: 0 }}>
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: 8, padding: "10px 24px", borderRadius: tokens.radius.button,
          border: "none", background: tokens.color.primary, color: "#fff",
          fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
