"use client";

import Link from "next/link"
import { tokens } from "@/lib/tokens";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px", textAlign: "center", background: tokens.color.bg }}>
      <div style={{
        width: 80, height: 80, borderRadius: tokens.radius.card,
        background: tokens.color.surface, border: `1px solid ${tokens.color.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: tokens.color.textTertiary,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: tokens.color.textPrimary }}>
        Page not found
      </h1>
      <p style={{ fontSize: "0.85rem", color: tokens.color.textSecondary, maxWidth: 360, lineHeight: 1.5, margin: 0 }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 8, padding: "10px 24px", borderRadius: tokens.radius.button,
          border: "none", background: tokens.color.primary, color: "#fff",
          fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
          textDecoration: "none", display: "inline-block",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
