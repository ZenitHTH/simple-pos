"use client";

import React, {
  createContext,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface MockupContextType {
  isMockupMode: boolean;
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  toggleMockupMode: () => void;
  mockupView: "default" | "payment";
  setMockupView: (view: "default" | "payment") => void;
}

const MockupContext = createContext<MockupContextType | undefined>(undefined);

export function MockupProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMockupMode, setIsMockupMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [mockupView, setMockupView] = useState<"default" | "payment">(
    "default",
  );

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Modern React 19 pattern: Update state during render when props/context changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    
    // Clear selection on navigation
    setSelectedElementId(null);

    // Auto-enable if on /mockup route
    if (pathname.startsWith("/mockup")) {
      setIsMockupMode(true);
    }
  }

  const toggleMockupMode = () => {
    setIsMockupMode((prev) => {
      const newValue = !prev;
      if (!newValue) {
        setSelectedElementId(null);
        setMockupView("default");
      }
      return newValue;
    });
  };

  return (
    <MockupContext
      value={{
        isMockupMode,
        selectedElementId,
        selectElement: setSelectedElementId,
        toggleMockupMode,
        mockupView,
        setMockupView,
      }}
    >
      {children}
    </MockupContext>
  );
}

export function useMockup() {
  const context = React.use(MockupContext);
  if (!context) {
    throw new Error("useMockup must be used within a MockupProvider");
  }
  return context;
}
