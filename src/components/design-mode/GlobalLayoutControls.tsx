"use client";

import { useRouter } from "next/navigation";
import { useMockup } from "@/context/MockupContext";
import { FaHistory, FaCompass } from "react-icons/fa";
import { AppSettings } from "@/lib";
import NumberSlider from "@/components/ui/NumberSlider";

interface GlobalLayoutControlsProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  currentView?: string;
  pathname: string;
}

export default function GlobalLayoutControls({
  settings,
  updateSettings,
  currentView,
  pathname,
}: GlobalLayoutControlsProps) {
  const router = useRouter();
  const { setMockupView, mockupView } = useMockup();

  if (currentView === "payment") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <NumberSlider
            label="Numpad Height"
            min={200}
            max={600}
            step={10}
            value={settings.payment_numpad_height || 320}
            onChange={(val) => updateSettings({ payment_numpad_height: val })}
            unit="px"
          />
        </div>
      </div>
    );
  }

  const isMainPage = pathname === "/";

  if (isMainPage) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            setMockupView(mockupView === "payment" ? "default" : "payment")
          }
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mockupView === "payment"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
        >
          <FaCompass /> Payment Modal
        </button>
        <button
          onClick={() => router.push("/history")}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
        >
          <FaHistory /> History Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-50 px-4">
        Global Layout
      </span>
    </div>
  );
}
