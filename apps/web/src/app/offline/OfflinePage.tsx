"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function OfflinePage() {
  return (
    <ErrorState
      type="network"
      message="You're offline"
      description="Check your internet connection and try again."
      onRetry={() => window.location.reload()}
    />
  );
}
