"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSettingsStore } from "@/lib/stores";
import { getTheme } from "@/lib/theme/theme";

interface ThemeContextValue {
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({ resolved: "dark" });
export const useResolvedTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSettingsStore((s) => s.theme);
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setResolved(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) => setResolved(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    setResolved(mode);
  }, [mode]);

  const theme = getTheme(resolved);

  return (
    <ThemeContext.Provider value={{ resolved }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
