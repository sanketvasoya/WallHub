"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export function SWRegistration() {
  const { updateAvailable, updateSW } = useServiceWorker();

  useEffect(() => {
    if (!updateAvailable) return;

    toast(
      (t) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          New version available
          <button
            onClick={() => {
              updateSW();
              toast.dismiss(t.id);
            }}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "4px 12px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8125rem",
            }}
          >
            Update
          </button>
        </span>
      ),
      { duration: Infinity, id: "sw-update" }
    );
  }, [updateAvailable, updateSW]);

  return null;
}
