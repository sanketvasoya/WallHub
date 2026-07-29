"use client";

import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useSearchHistoryStore } from "@/lib/stores";
import { TRENDING_SEARCHES } from "@/lib/constants";
import { tokens } from "@/lib/tokens";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelect: (term: string) => void;
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  onSelect,
  autoFocus = false,
  showSuggestions = true,
}: SearchInputProps) {
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistoryStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addSearch(value.trim());
      onSubmit();
    }
  };

  const handleSelect = (term: string) => {
    addSearch(term);
    onSelect(term);
  };

  const hasSuggestions = showSuggestions && (history.length > 0 || TRENDING_SEARCHES.length > 0);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search wallpapers"
          aria-label="Search wallpapers"
          style={{
            width: "100%",
            height: 52,
            borderRadius: tokens.radius.pill,
            padding: "0 44px 0 20px",
            border: "none",
            background: tokens.color.surface,
            color: tokens.color.textPrimary,
            fontSize: "0.875rem",
            outline: "none",
            boxShadow: tokens.shadow.search,
            transition: "box-shadow 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.color.primaryAlpha30}, ${tokens.shadow.search}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = tokens.shadow.search;
          }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "none",
              background: tokens.color.surfaceVariant,
              color: tokens.color.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        ) : (
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: tokens.color.textTertiary,
              pointerEvents: "none",
            }}
          >
            <Search size={18} />
          </div>
        )}
      </form>

      <AnimatePresence>
        {hasSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: tokens.animation.ease }}
            style={{
              position: "absolute",
              zIndex: 10,
              left: 0,
              right: 0,
              top: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: tokens.radius.input,
              background: tokens.color.surface,
              border: `1px solid ${tokens.color.border}`,
              boxShadow: tokens.shadow.dialog,
            }}
          >
            {history.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 4px",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: tokens.color.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Recent
                  </span>
                  <button
                    onClick={clearHistory}
                    style={{
                      border: "none",
                      background: "none",
                      color: tokens.color.primary,
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Clear
                  </button>
                </div>
                {history.slice(0, 5).map((term) => (
                  <div
                    key={term}
                    onClick={() => handleSelect(term)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 8px",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = tokens.color.surfaceVariant}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <Clock size={14} color={tokens.color.textTertiary} />
                    <span style={{ flex: 1, fontSize: "0.85rem", color: tokens.color.textPrimary }}>
                      {term}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(term);
                      }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: "none",
                        background: "transparent",
                        color: tokens.color.textTertiary,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {TRENDING_SEARCHES.length > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "0 4px",
                    marginBottom: 8,
                  }}
                >
                  <TrendingUp size={13} color={tokens.color.textTertiary} />
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: tokens.color.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Trending
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelect(term)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: tokens.radius.pill,
                        border: "none",
                        background: tokens.color.surfaceVariant,
                        color: tokens.color.textPrimary,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = tokens.color.primaryAlpha20}
                      onMouseLeave={(e) => e.currentTarget.style.background = tokens.color.surfaceVariant}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
