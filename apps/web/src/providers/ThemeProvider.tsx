"use client";

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSettingsStore } from "@/lib/stores";
import { getTheme } from "@/lib/theme/theme";

interface ThemeContextValue {
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({ resolved: "dark" });
export const useResolvedTheme = () => useContext(ThemeContext);

function getInitialMode(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  const stored = useSettingsStore.getState().theme;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSettingsStore((s) => s.theme);
  const [resolved, setResolved] = useState<"light" | "dark">(getInitialMode);

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

  const theme = useMemo(() => getTheme(resolved), [resolved]);

  return (
    <ThemeContext.Provider value={{ resolved }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
