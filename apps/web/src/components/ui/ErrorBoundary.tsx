"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { WarningAmber, Refresh } from "@mui/icons-material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40vh",
            p: 4,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: "error.soft",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              color: "error.main",
            }}
          >
            <WarningAmber sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
            {this.state.error?.message || "An unexpected error occurred while rendering this section."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleReset}
            sx={{ borderRadius: 3 }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
