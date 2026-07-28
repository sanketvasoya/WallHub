"use client";

import { useState, useCallback } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Smartphone, Monitor, Layers } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { mobileNavItems, isActive } from "@/lib/nav";
import { useOrientation } from "@/hooks/useOrientation";
import { tokens } from "@/lib/tokens";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [moreOpen, setMoreOpen] = useState(false);
  const { resolved: orientation, setPreference: setOrientation } = useOrientation();

  const matchIndex = mobileNavItems.findIndex((item) => isActive(item.href, pathname));

  const handleNavChange = useCallback(
    (_: unknown, newValue: number) => {
      const item = mobileNavItems[newValue];
      if (!item) return;
      if (item.href === "__more__") {
        setMoreOpen(true);
      } else {
        router.push(item.href);
      }
    },
    [router]
  );

  if (!isMobile) return null;

  const isDark = muiTheme.palette.mode === "dark";

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
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: isDark ? "rgba(9, 9, 11, 0.85)" : "rgba(250, 251, 255, 0.85)",
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
            height: 68,
            pb: 0.5,
            "& .MuiBottomNavigationAction-root": {
              minWidth: 0,
              py: 0.75,
              gap: 0.25,
              transition: "all 0.2s ease",
              borderRadius: "12px",
              mx: 0.5,
              "&.Mui-selected": {
                color: "primary.main",
                "& .MuiBottomNavigationAction-label": {
                  fontWeight: 700,
                  fontSize: "0.62rem",
                },
              },
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.58rem",
                fontWeight: 500,
                mt: 0.25,
                opacity: 0.6,
                "&.Mui-selected": {
                  fontSize: "0.62rem",
                  opacity: 1,
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
                icon={<Icon size={21} />}
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
            borderRadius: "20px 20px 0 0",
            bgcolor: isDark
              ? "rgba(9, 9, 11, 0.96)"
              : "rgba(250, 251, 255, 0.96)",
            backdropFilter: "blur(40px) saturate(1.8)",
            WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          },
        }}
      >
        <Box sx={{ p: 3, maxWidth: 400, mx: "auto", width: "100%" }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              bgcolor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
              borderRadius: 2,
              mx: "auto",
              mb: 2.5,
            }}
          />
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={600}
            sx={{
              mb: 1.5,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            More
          </Typography>
          <List>
            {mobileNavItems.map((item) => {
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
                    borderRadius: "12px",
                    py: 1.25,
                    "&.Mui-selected": {
                      bgcolor: isDark
                        ? tokens.color.primaryAlpha15
                        : tokens.color.primaryAlpha10,
                    },
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38 }}>
                    <Icon
                      size={19}
                      style={{ color: active ? tokens.color.primary : undefined }}
                      className={active ? "" : "MuiTypography-colorSecondary"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: "0.9rem",
                      color: active ? "text.primary" : "text.secondary",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
          <Divider sx={{ mx: 1, my: 1, opacity: 0.06 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              px: 2,
              mb: 1,
              display: "block",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.65rem",
            }}
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
                  borderRadius: "12px !important",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    borderColor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                },
              }}
            >
              <ToggleButton value="phone">
                <Smartphone size={16} />
                Phone
              </ToggleButton>
              <ToggleButton value="desktop">
                <Monitor size={16} />
                Desktop
              </ToggleButton>
              <ToggleButton value="all">
                <Layers size={16} />
                All
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
