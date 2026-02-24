import { memo } from "react";

import { FaReceipt, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import GlobalHeader from "../ui/GlobalHeader";

interface POSHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const POSHeader = memo(function POSHeader({
  cartCount,
  onOpenCart,
}: POSHeaderProps) {
  const router = useRouter();

  return (
    <GlobalHeader title="Simple POS" subtitle="Manage orders efficiently">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCart}
          className="bg-primary text-primary-foreground hover:bg-primary/90 relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors lg:hidden"
        >
          <FaShoppingCart />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
        <button
          onClick={() => router.push("/history")}
          className="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors"
        >
          <FaReceipt /> History
        </button>
      </div>
    </GlobalHeader>
  );
});

export default POSHeader;
