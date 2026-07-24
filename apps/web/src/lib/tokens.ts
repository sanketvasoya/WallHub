export const tokens = {
  gradient: {
    primary: "linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)",
    primaryHover: "linear-gradient(135deg, #9c6fff 0%, #33ecff 100%)",
    primaryLight: "linear-gradient(135deg, rgba(124,77,255,0.15) 0%, rgba(0,229,255,0.1) 100%)",
    text: "linear-gradient(135deg, #7c4dff, #00e5ff)",
    textWarm: "linear-gradient(135deg, #ff6b9d, #c44dff, #7c4dff)",
    surface: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    hero: "linear-gradient(180deg, transparent 0%, rgba(5,5,10,0.8) 100%)",
    heroLight: "linear-gradient(180deg, transparent 0%, rgba(245,245,245,0.9) 100%)",
  },
  color: {
    primary: "#7c4dff",
    primaryLight: "#b47cff",
    primaryDark: "#3f1dcb",
    secondary: "#00e5ff",
    secondaryLight: "#6effff",
    secondaryDark: "#00b2cc",
    primaryLightCss: "rgba(124, 77, 255, 0.3)",
    accent: "#ff6b9d",
    surface: {
      dark: "rgba(255,255,255,0.04)",
      darkHover: "rgba(255,255,255,0.08)",
      light: "rgba(0,0,0,0.03)",
      lightHover: "rgba(0,0,0,0.06)",
    },
  },
} as const;
