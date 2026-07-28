"use client";

import { Box, Typography, IconButton, Breadcrumbs, Link } from "@mui/material";
import { ArrowBack, NavigateNext } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { tokens } from "@/lib/tokens";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBack?: boolean;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  showBack = true,
  action,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs if provided */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext sx={{ fontSize: 14 }} />}
          aria-label="breadcrumb"
          sx={{ mb: 1.5 }}
        >
          <Link
            component={NextLink}
            href="/"
            underline="hover"
            color="text.secondary"
            sx={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            Home
          </Link>
          {breadcrumbs.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                component={NextLink}
                href={item.href}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                {item.label}
              </Link>
            ) : (
              <Typography key={i} color="text.primary" sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      {/* Main Title Row */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {showBack && (
            <IconButton
              onClick={handleBack}
              aria-label="Go back"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary", bgcolor: "action.hover" },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}

          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (t) =>
                  t.palette.mode === "dark" ? tokens.color.primaryAlpha15 : tokens.color.primaryAlpha10,
                color: "primary.main",
              }}
            >
              {icon}
            </Box>
          )}

          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                letterSpacing: "-0.015em",
                color: "text.primary",
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
}
