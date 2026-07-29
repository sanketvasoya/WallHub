"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/ui/SearchInput";

interface SearchBarProps {
  fullWidth?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({ fullWidth = false, autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  }, [query, router]);

  const handleSelect = useCallback(
    (term: string) => {
      setQuery(term);
      router.push(`/search?q=${encodeURIComponent(term)}`);
      setFocused(false);
    },
    [router]
  );

  return (
    <div
      style={{
        position: "relative",
        width: fullWidth ? "100%" : "100%",
        maxWidth: fullWidth ? "100%" : 460,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setTimeout(() => setFocused(false), 200)}
    >
      <SearchInput
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        onSelect={handleSelect}
        autoFocus={autoFocus}
        showSuggestions={focused && !query}
      />
    </div>
  );
}
