"use client";

import { AlertCircle, RefreshCw, WifiOff, SearchX, FolderX } from "lucide-react";
import { tokens } from "@/lib/tokens";

export type ErrorType = "notFound" | "network" | "empty" | "generic";

interface ErrorStateProps {
  message?: string;
  description?: string;
  type?: ErrorType;
  onRetry?: () => void;
  action?: { label: string; onClick: () => void };
}

function getErrorIcon(type: ErrorType, size = 36) {
  switch (type) {
    case "network":
      return <WifiOff size={size} strokeWidth={1.5} color={tokens.color.textSecondary} />;
    case "notFound":
      return <SearchX size={size} strokeWidth={1.5} color={tokens.color.textSecondary} />;
    case "empty":
      return <FolderX size={size} strokeWidth={1.5} color={tokens.color.textSecondary} />;
    default:
      return <AlertCircle size={size} strokeWidth={1.5} color={tokens.color.textSecondary} />;
  }
}

function getDefaultDescription(type: ErrorType): string | null {
  switch (type) {
    case "network":
      return "Please check your internet connection.";
    case "notFound":
      return "Try adjusting your search or filters.";
    case "empty":
      return "Nothing here yet. Check back later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function ErrorState({
  message = "Something went wrong",
  description,
  type = "generic",
  onRetry,
  action,
}: ErrorStateProps) {
  const displayDescription = description || getDefaultDescription(type);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: 16,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: tokens.radius.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: tokens.color.surface,
          border: `1px solid ${tokens.color.border}`,
        }}
      >
        {getErrorIcon(type)}
      </div>

      <div style={{ fontSize: "1rem", fontWeight: 600, color: tokens.color.textPrimary }}>
        {message}
      </div>

      {displayDescription && (
        <div style={{ fontSize: "0.85rem", color: tokens.color.textSecondary, maxWidth: 320, lineHeight: 1.5 }}>
          {displayDescription}
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            borderRadius: tokens.radius.button,
            border: "none",
            background: tokens.color.primary,
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            marginTop: 8,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <RefreshCw size={16} strokeWidth={2} />
          Try Again
        </button>
      )}

      {action && (
        <button
          onClick={action.onClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            borderRadius: tokens.radius.button,
            border: "none",
            background: tokens.color.primary,
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            marginTop: 8,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
