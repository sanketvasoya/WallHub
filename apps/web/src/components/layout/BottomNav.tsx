"use client";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { navItems, isActive } from "@/lib/nav";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const matchIndex = navItems.findIndex((item) => isActive(item.href, pathname));

  if (!isMobile) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: "none",
        bgcolor: "transparent",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: theme.palette.mode === "dark"
            ? "rgba(5,5,10,0.88)"
            : "rgba(248,248,252,0.88)",
          borderRadius: 0,
        },
      }}
    >
      <BottomNavigation
        showLabels
        value={matchIndex === -1 ? undefined : matchIndex}
        onChange={(_, newValue) => {
          router.push(navItems[newValue]?.href || "/");
        }}
        sx={{
          position: "relative",
          bgcolor: "transparent",
          height: 64,
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            py: 1,
            gap: 0.25,
            transition: "all 0.25s ease",
            "&.Mui-selected": {
              color: "primary.main",
              "& .MuiBottomNavigationAction-label": {
                fontWeight: 700,
                fontSize: "0.65rem",
              },
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.6rem",
              fontWeight: 500,
              mt: 0.25,
              "&.Mui-selected": {
                fontSize: "0.65rem",
              },
            },
          },
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <BottomNavigationAction
              key={item.href}
              label={item.mobileLabel}
              icon={<Icon sx={{ fontSize: 22 }} />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
