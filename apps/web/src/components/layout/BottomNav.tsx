"use client";

import { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { PhoneIphone, DesktopWindows, Wallpaper } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { mobileNavItems, moreMenuItems, isActive } from "@/lib/nav";
import { useOrientation } from "@/hooks/useOrientation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [moreOpen, setMoreOpen] = useState(false);
  const { resolved: orientation, setPreference: setOrientation } = useOrientation();

  const matchIndex = mobileNavItems.findIndex((item) => isActive(item.href, pathname));

  if (!isMobile) return null;

  const handleNavChange = (_: unknown, newValue: number) => {
    const item = mobileNavItems[newValue];
    if (!item) return;
    if (item.href === "__more__") {
      setMoreOpen(true);
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
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
          onChange={handleNavChange}
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
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <BottomNavigationAction
                key={item.href}
                label={item.mobileLabel}
                icon={<Icon sx={{ fontSize: 22 }} />}
                aria-label={item.label}
              />
            );
          })}
        </BottomNavigation>
      </Paper>

      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "24px 24px 0 0",
            bgcolor: theme.palette.mode === "dark" ? "rgba(14,14,22,0.98)" : "rgba(255,255,255,0.98)",
            backdropFilter: "blur(40px)",
          },
        }}
      >
        <Box sx={{ p: 3, maxWidth: 400, mx: "auto", width: "100%" }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
              borderRadius: 2,
              mx: "auto",
              mb: 2,
            }}
          />
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 1, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            More
          </Typography>
          <List>
            {moreMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, pathname);
              return (
                <ListItemButton
                  key={item.href}
                  selected={active}
                  onClick={() => {
                    router.push(item.href);
                    setMoreOpen(false);
                  }}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.25,
                    "&.Mui-selected": {
                      bgcolor: theme.palette.mode === "dark" ? "rgba(124,77,255,0.12)" : "rgba(98,0,234,0.08)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38 }}>
                    <Icon sx={{ fontSize: 21, color: active ? "primary.main" : "text.secondary" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: "0.9rem" }}
                  />
                </ListItemButton>
              );
            })}
          </List>
          <Divider sx={{ mx: 1, my: 1, opacity: 0.08 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 2, mb: 1, display: "block", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.65rem" }}
          >
            Wallpaper Orientation
          </Typography>
          <Box sx={{ px: 2, pb: 1 }}>
            <ToggleButtonGroup
              value={orientation}
              exclusive
              onChange={(_, val) => val && setOrientation(val)}
              fullWidth
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  gap: 0.5,
                  py: 1,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                },
              }}
            >
              <ToggleButton value="phone">
                <PhoneIphone sx={{ fontSize: 18 }} />
                Phone
              </ToggleButton>
              <ToggleButton value="desktop">
                <DesktopWindows sx={{ fontSize: 18 }} />
                Desktop
              </ToggleButton>
              <ToggleButton value="all">
                <Wallpaper sx={{ fontSize: 18 }} />
                All
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
