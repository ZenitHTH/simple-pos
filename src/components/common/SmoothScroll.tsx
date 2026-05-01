"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({
  children,
  className = "",
}: SmoothScrollProps) {
  const [isLinux, setIsLinux] = useState(false);

  useEffect(() => {
    // Check engine after mount. EngineProvider sets this on documentElement.
    const engine = document.documentElement.getAttribute("data-engine");
    if (engine === "webkitgtk") {
      setIsLinux(true);
    }

    // Optional: Mutation observer if we expect it to change after mount
    const observer = new MutationObserver(() => {
      const currentEngine =
        document.documentElement.getAttribute("data-engine");
      setIsLinux(currentEngine === "webkitgtk");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-engine"],
    });
    return () => observer.disconnect();
  }, []);

  if (isLinux) {
    return <div className={className}>{children}</div>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 1.2,
        autoRaf: true,
        prevent: (node: HTMLElement) =>
          node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      {children}
    </ReactLenis>
  );
}
