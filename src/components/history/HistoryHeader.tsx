import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function HistoryHeader() {
  const router = useRouter();
  const { settings } = useSettings();

  return (
    <header
      className="mb-8 flex items-center gap-4 transition-all duration-300"
      style={{ fontSize: `${settings.header_font_scale || 100}%` }}
    >
      <button
        onClick={() => router.back()}
        className="bg-card border-border hover:bg-muted/20 rounded-xl border p-3 transition-colors"
      >
        <FaArrowLeft />
      </button>
      <div>
        <h1
          className="text-foreground mb-1 text-3xl font-bold"
          style={{ fontSize: "1.5em" }}
        >
          Order History
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875em" }}>
          View past transactions
        </p>
      </div>
    </header>
  );
}
