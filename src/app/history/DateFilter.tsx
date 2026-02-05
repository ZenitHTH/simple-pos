import { FaSearch } from 'react-icons/fa';

interface DateFilterProps {
    startDate: string;
    endDate: string;
    loading: boolean;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onFilter: () => void;
}

export default function DateFilter({ startDate, endDate, loading, onStartDateChange, onEndDateChange, onFilter }: DateFilterProps) {
    return (
        <div className="bg-card-bg p-6 rounded-2xl border border-border shadow-sm mb-8 flex flex-wrap gap-4 items-end">
            <div>
                <label className="block text-sm font-medium text-muted mb-2">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-muted mb-2">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
            </div>
            <button
                onClick={onFilter}
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 mb-[1px]"
            >
                {loading ? 'Loading...' : <><FaSearch /> Filter</>}
            </button>
        </div>
    );
}
