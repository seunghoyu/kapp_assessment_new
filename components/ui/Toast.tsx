"use client";

import { useEffect } from "react";

export type ToastType = "info" | "success" | "error";

interface ToastProps {
  message: string | null;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ message, type = "info", onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  const bg =
    type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";

  return (
    <div
      className={`fixed top-5 right-5 z-[10000] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${bg}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
