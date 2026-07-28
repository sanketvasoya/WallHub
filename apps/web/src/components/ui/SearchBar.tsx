"use client";

import { useState, useCallback } from "react";
import { Box } from "@mui/material";
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
    <Box
      sx={{
        position: "relative",
        width: fullWidth ? "100%" : { xs: "100%", md: 460 },
      }}
    >
      <Box
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          onSelect={handleSelect}
          autoFocus={autoFocus}
          showSuggestions={focused}
        />
      </Box>
    </Box>
  );
}
