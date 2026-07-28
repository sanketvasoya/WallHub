"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Internet connection restored", { id: "network-status" });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are currently offline", { id: "network-status", duration: 5000 });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline };
}
