"use client";

import { Box, Typography, IconButton, Breadcrumbs, Link } from "@mui/material";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { tokens } from "@/lib/tokens";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <Box sx={{ mb: 3 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<ChevronRight size={14} />}
            aria-label="breadcrumb"
            sx={{ mb: 1.5 }}
          >
            <Link
              component={NextLink}
              href="/"
              underline="hover"
              color="text.secondary"
              sx={{ fontSize: "0.75rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 0.5 }}
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
                <Typography
                  key={i}
                  color="text.primary"
                  sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                >
                  {item.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {showBack && (
              <IconButton
                onClick={handleBack}
                aria-label="Go back"
                sx={{
                  color: "text.secondary",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            )}

            {icon && (
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (t) =>
                    t.palette.mode === "dark"
                      ? tokens.color.primaryAlpha10
                      : tokens.color.primaryAlpha10,
                  color: "primary.main",
                  flexShrink: 0,
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
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.8rem", mt: 0.25, lineHeight: 1.4 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {action && <Box>{action}</Box>}
        </Box>
      </Box>
    </motion.div>
  );
}
