import { memo } from "react";

import { FaReceipt, FaShoppingCart, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import GlobalHeader from "@/components/ui/GlobalHeader";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";

interface POSHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  isCartVisible: boolean;
  onToggleCart: () => void;
}

/**
 * POSHeader component displays the top navigation bar for the POS interface.
 * It includes the application title, cart toggle (desktop), cart button (mobile), and navigation to history.
 * 
 * @param {POSHeaderProps} props - The component props.
 * @param {number} props.cartCount - Total number of items in the cart.
 * @param {() => void} props.onOpenCart - Callback to open the cart drawer on mobile.
 * @param {boolean} props.isCartVisible - Whether the cart sidebar is visible on desktop.
 * @param {() => void} props.onToggleCart - Callback to toggle cart visibility on desktop.
 */
const POSHeader = memo(function POSHeader({
  cartCount,
  onOpenCart,
  isCartVisible,
  onToggleCart,
}: POSHeaderProps) {
  const router = useRouter();

  return (
    <GlobalHeader title="Simple POS" subtitle="Manage orders efficiently">
      <div className="flex items-center gap-2">
        {/* Mobile Cart Button */}
        <button
          onClick={onOpenCart}
          className="bg-primary text-primary-foreground hover:bg-primary/90 relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors md:hidden"
        >
          <FaShoppingCart />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-lg">
              {cartCount}
            </span>
          )}
        </button>

        {/* Desktop Cart Toggle */}
        <button
          onClick={onToggleCart}
          className="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground hidden items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors md:flex"
        >
          <FaShoppingCart />
          {isCartVisible ? (
            <>
              Hide Cart <FaChevronRight className="ml-1" />
            </>
          ) : (
            <>
              Show Cart <FaChevronLeft className="ml-1" />
            </>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => router.push("/history")}
            className="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors"
          >
            <FaReceipt /> History
          </button>
          <SelectableOverlay id="button_scale" />
        </div>
      </div>
    </GlobalHeader>
  );
});

export default POSHeader;
