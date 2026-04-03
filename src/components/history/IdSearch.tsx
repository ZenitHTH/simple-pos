import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/Input";

interface IdSearchProps {
  searchId: string;
  loading: boolean;
  onSearchIdChange: (id: string) => void;
  onSearch: () => void;
}

export default function IdSearch({
  searchId,
  loading,
  onSearchIdChange,
  onSearch,
}: IdSearchProps) {
  return (
    <div className="bg-card text-card-foreground border-border mb-8 rounded-2xl border p-6 shadow-sm">
      <h3 className="text-muted-foreground mb-4 text-sm font-medium">
        Search by Receipt ID
      </h3>
      <div className="flex gap-4">
        <div className="relative max-w-xs flex-1">
          <FaSearch className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 z-10" />
          <Input
            type="text"
            value={searchId}
            onChange={(e) => onSearchIdChange(e.target.value)}
            placeholder="Enter Receipt ID"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="pl-10"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="bg-muted/10 text-foreground hover:bg-muted/20 border-border rounded-xl border px-6 py-2.5 font-bold transition-colors"
        >
          Search ID
        </button>
      </div>
    </div>
  );
}
