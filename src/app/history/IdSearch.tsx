import { FaSearch } from 'react-icons/fa';

interface IdSearchProps {
    searchId: string;
    loading: boolean;
    onSearchIdChange: (id: string) => void;
    onSearch: () => void;
}

export default function IdSearch({ searchId, loading, onSearchIdChange, onSearch }: IdSearchProps) {
    return (
        <div className="bg-card-bg p-6 rounded-2xl border border-border shadow-sm mb-8">
            <h3 className="text-sm font-medium text-muted mb-4">Search by Receipt ID</h3>
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-xs">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => onSearchIdChange(e.target.value)}
                        placeholder="Enter Receipt ID"
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className="px-6 py-2.5 bg-muted/10 text-foreground font-bold rounded-xl hover:bg-muted/20 transition-colors border border-border"
                >
                    Search ID
                </button>
            </div>
        </div>
    );
}
