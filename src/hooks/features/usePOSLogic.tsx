import { useState, useEffect, useTransition, useOptimistic, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CartItem, Product, Customer } from "@/lib";
import { receiptApi } from "@/lib";
import { logger } from "@/lib/utils/logger";
import { useCurrency } from "@/hooks/settings/useCurrency";
import { useTax } from "@/hooks/settings/useTax";
import { exampleProducts, exampleCartItems } from "@/lib";
import { useMockup } from "@/context/MockupContext";
import { useDatabase } from "@/context/DatabaseContext";
import { useToast } from "@/context/ToastContext";
import { useDataCache } from "@/context/DataContext";

/**
 * Comprehensive hook to manage Point of Sale (POS) logic.
 * Handles product display, category filtering, search, cart operations, customer selection, and payment processing.
 *
 * @param {Product[]} initialProducts - List of products available for sale.
 * @returns {object} An object containing POS state and handler functions.
 */
export function usePOSLogic(initialProducts: Product[]) {
  const { isMockupMode, mockupView, setMockupView } = useMockup();
  const { dbKey } = useDatabase();
  const { showToast } = useToast();
  const { categories: cachedCategories, customers: cachedCustomers } = useDataCache();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { taxRate } = useTax();

  // React 19 Transition for payment confirmation
  const [isPending, startTransition] = useTransition();

  // Determine which products to use
  const productsSource = useMemo(() => isMockupMode ? exampleProducts : initialProducts, [isMockupMode, initialProducts]);

  // URL State
  const selectedCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  // Local State (Cart)
  const [cartItems, setCartItems] = useState<CartItem[]>(
    isMockupMode ? exampleCartItems : []
  );

  type OptimisticAction = 
    | { type: "clear" }
    | { type: "add"; product: Product }
    | { type: "update"; id: number; delta: number }
    | { type: "remove"; id: number };

  // React 19 Optimistic UI for Cart
  const [optimisticCart, addOptimisticCart] = useOptimistic<CartItem[], OptimisticAction>(
    cartItems,
    (state, action) => {
      switch (action.type) {
        case "clear":
          return [];
        case "add": {
          const existing = state.find((item) => item.id === action.product.id);
          if (existing) {
            return state.map((item) =>
              item.id === action.product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...state, { ...action.product, quantity: 1 }];
        }
        case "update": {
          return state
            .map((item) => {
              if (item.id === action.id) {
                const newQuantity = Math.max(0, item.quantity + action.delta);
                return { ...item, quantity: newQuantity };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);
        }
        case "remove":
          return state.filter((item) => item.id !== action.id);
        default:
          return state;
      }
    }
  );

  const categories = useMemo(() => ["All", ...cachedCategories.map((c) => c.name)], [cachedCategories]);
  const customers = cachedCustomers;
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(
    isMockupMode && mockupView === "payment"
  );

  const [selectedCustomerId, setSelectedCustomerId] = useState<
    number | undefined
  >(undefined);

  const [prevIsMockupMode, setPrevIsMockupMode] = useState(isMockupMode);
  const [prevMockupView, setPrevMockupView] = useState(mockupView);

  // Modern React 19/2025 pattern: Avoid useEffect for syncing state. Update during render instead.
  if (isMockupMode !== prevIsMockupMode) {
    setPrevIsMockupMode(isMockupMode);
    setCartItems(isMockupMode ? exampleCartItems : []);
    if (isMockupMode) {
      setIsPaymentModalOpen(mockupView === "payment");
    } else {
      setIsPaymentModalOpen(false);
    }
  }

  if (isMockupMode && mockupView !== prevMockupView) {
    setPrevMockupView(mockupView);
    setIsPaymentModalOpen(mockupView === "payment");
  }

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = useCallback((category: string) => {
    updateURL("category", category);
  }, [searchParams, router]);

  const handleSearchChange = useCallback((query: string) => {
    updateURL("search", query);
  }, [searchParams, router]);

  const handleAddToCart = useCallback((product: Product) => {
    startTransition(() => {
      addOptimisticCart({ type: "add", product });
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    });
  }, [addOptimisticCart]);

  const handleUpdateQuantity = useCallback((id: number, delta: number) => {
    startTransition(() => {
      addOptimisticCart({ type: "update", id, delta });
      setCartItems((prev) => {
        return prev
          .map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(0, item.quantity + delta);
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
      });
    });
  }, [addOptimisticCart]);

  const handleRemove = useCallback((id: number) => {
    startTransition(() => {
      addOptimisticCart({ type: "remove", id });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    });
  }, [addOptimisticCart]);

  const handleCheckout = useCallback(() => {
    logger.info("usePOSLogic: handleCheckout called, cart length =", cartItems.length);
    if (cartItems.length === 0) return;
    logger.info("usePOSLogic: setting isPaymentModalOpen to true");
    setIsPaymentModalOpen(true);
  }, [cartItems.length]);

  const cartTotal = useMemo(() => {
    const totalSatang = optimisticCart.reduce((sum, item) => {
      const itemSatang = item.satang ?? Math.round(item.price * 100);
      return sum + itemSatang * item.quantity;
    }, 0);
    return (totalSatang * (1 + taxRate)) / 100;
  }, [optimisticCart, taxRate]);

  const handleConfirmPayment = useCallback((cashReceived: number) => {
    if (!dbKey) return;
    
    startTransition(async () => {
      // Optimistically clear the cart
      addOptimisticCart({ type: "clear" });
      
      try {
        // New consolidated API call in a single atomic operation
        const receiptList = await receiptApi.completeCheckout(dbKey, {
          customerId: selectedCustomerId,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        });

        // Success Feedback
        const change = cashReceived - cartTotal;
        showToast(
          `Payment Successful!\nChange: ${currency}${change.toFixed(2)}`,
          "success",
        );
        logger.action("payment_confirmed", { receiptId: receiptList.receipt_id });

        // Reset real state
        setCartItems([]);
        setSelectedCustomerId(undefined);
        setIsPaymentModalOpen(false);
      } catch (error) {
        logger.error("Payment failed:", error);
        showToast("Payment failed. Please try again.", "error");
      }
    });
  }, [dbKey, selectedCustomerId, cartItems, cartTotal, currency, showToast, addOptimisticCart]);

  const handleSetIsPaymentModalOpen = useCallback((isOpen: boolean) => {
    setIsPaymentModalOpen(isOpen);
    if (!isOpen && isMockupMode) {
      setMockupView("default");
    }
  }, [isMockupMode, setMockupView]);

  return useMemo(() => ({
    productsSource,
    categories,
    selectedCategory,
    handleCategoryChange,
    searchQuery,
    handleSearchChange,
    cartItems: optimisticCart, // Use optimistic cart in UI
    handleAddToCart,
    handleUpdateQuantity,
    handleRemove,
    isPaymentModalOpen,
    setIsPaymentModalOpen: handleSetIsPaymentModalOpen,
    handleCheckout,
    handleConfirmPayment,
    currency,
    cartTotal,
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    isPending,
  }), [
    productsSource,
    categories,
    selectedCategory,
    handleCategoryChange,
    searchQuery,
    handleSearchChange,
    optimisticCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemove,
    isPaymentModalOpen,
    handleSetIsPaymentModalOpen,
    handleCheckout,
    handleConfirmPayment,
    currency,
    cartTotal,
    customers,
    selectedCustomerId,
    isPending
  ]);
}
