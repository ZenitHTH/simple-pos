import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function HistoryHeader() {
    const router = useRouter();
    return (
        <header className="mb-8 flex items-center gap-4">
            <button
                onClick={() => router.back()}
                className="p-3 rounded-xl bg-card-bg border border-border hover:bg-muted/20 transition-colors"
            >
                <FaArrowLeft />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Order History</h1>
                <p className="text-muted">View past transactions</p>
            </div>
        </header>
    );
}
