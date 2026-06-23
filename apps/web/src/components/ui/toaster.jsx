"use client";

import { Toaster as ToasterPrimitive } from "react-hot-toast";

export function Toaster() {
  return (
    <ToasterPrimitive
      position="bottom-right"
      toastOptions={{
        className: "bg-card border-border text-foreground",
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
}
