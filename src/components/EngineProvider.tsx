"use client";

import { useEffect } from "react";
import { getRenderingEngine } from "@/lib/api/system";

/**
 * EngineProvider detects the underlying rendering engine (WebView2, WebKitGTK, etc.)
 * and injects a `data-engine` attribute into the document root.
 * This allows for engine-specific CSS optimizations.
 */
export default function EngineProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const detectEngine = async () => {
      const engine = await getRenderingEngine();
      if (engine && engine !== "unknown") {
        document.documentElement.setAttribute("data-engine", engine);
      } else {
        // Fallback for mock/web mode
        document.documentElement.setAttribute("data-engine", "mock");
      }
    };

    detectEngine();
  }, []);

  return <>{children}</>;
}
