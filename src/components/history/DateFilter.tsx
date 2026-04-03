import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/Input";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  loading: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilter: () => void;
}

export default function DateFilter({
  startDate,
  endDate,
  loading,
  onStartDateChange,
  onEndDateChange,
  onFilter,
}: DateFilterProps) {
  return (
    <div className="bg-card text-card-foreground border-border mb-8 flex flex-wrap items-end gap-4 rounded-2xl border p-6 shadow-sm">
      <Input
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="max-w-[200px]"
      />
      <Input
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="max-w-[200px]"
      />
      <button
        onClick={onFilter}
        disabled={loading}
        className="bg-primary text-primary-foreground mb-px flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition-colors hover:bg-primary/90"
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <FaSearch /> Filter
          </>
        )}
      </button>
    </div>
  );
}
