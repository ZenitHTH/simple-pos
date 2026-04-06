"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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

  // Auto-enable if on /mockup route (backward compatibility or direct link)
  useEffect(() => {
    if (pathname.startsWith("/mockup")) {
      setIsMockupMode(true);
    }
  }, [pathname]);

  // Clear selection on navigation
  useEffect(() => {
    setSelectedElementId(null);
  }, [pathname]);

  return (
    <MockupContext.Provider
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
    </MockupContext.Provider>
  );
}

export function useMockup() {
  const context = useContext(MockupContext);
  if (!context) {
    throw new Error("useMockup must be used within a MockupProvider");
  }
  return context;
}
