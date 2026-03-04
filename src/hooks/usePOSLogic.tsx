import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CartItem, Product, Customer } from "@/lib";
import { categoryApi, receiptApi, customerApi } from "@/lib";
import { logger } from "@/lib/logger";
import { useCurrency } from "./useCurrency";
import { useTax } from "./useTax";
import { exampleProducts, exampleCartItems } from "@/lib";
import { useMockup } from "@/context/MockupContext";
import { useDatabase } from "@/context/DatabaseContext";
import { useToast } from "@/context/ToastContext";

/**
 * Custom hook to manage Point of Sale (POS) logic.
 * Handles product selection, cart management, and payment processing.
 *
 * @param initialProducts - List of products available for sale.
 * @returns Object containing cart state, handlers, and current currency/tax settings.
 */
export function usePOSLogic(initialProducts: Product[]) {
  const { isMockupMode, mockupView, setMockupView } = useMockup();
  const { dbKey } = useDatabase();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { taxRate } = useTax();

  // Determine which products to use
  const productsSource = isMockupMode ? exampleProducts : initialProducts;

  // URL State
  const selectedCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  // Local State (Cart)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (!dbKey) return;
    Promise.all([categoryApi.getAll(dbKey), customerApi.getAll(dbKey)])
      .then(([catData, custData]) => {
        setCategories(["All", ...catData.map((c) => c.name)]);
        setCustomers(custData);
      })
      .catch((err) => {
        logger.error("Failed to fetch initial pos data", err);
      });
  }, [dbKey]);

  // Effect to handle mockup mode cart items
  useEffect(() => {
    if (isMockupMode) {
      setCartItems(exampleCartItems);
    } else {
      setCartItems([]);
    }
  }, [isMockupMode]);

  // Effect to view syncing
  useEffect(() => {
    if (isMockupMode) {
      if (mockupView === "payment") {
        setIsPaymentModalOpen(true);
      } else {
        setIsPaymentModalOpen(false);
      }
    }
  }, [isMockupMode, mockupView]);

  const updateURL = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      updateURL("category", category);
    },
    [updateURL],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      updateURL("search", query);
    },
    [updateURL],
  );

  const handleAddToCart = useCallback((product: Product) => {
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
  }, []);

  const handleUpdateQuantity = useCallback((id: number, delta: number) => {
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
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleCheckout = useCallback(() => {
    logger.info("usePOSLogic: handleCheckout called, cart length =", cartItems.length);
    if (cartItems.length === 0) return;
    logger.info("usePOSLogic: setting isPaymentModalOpen to true");
    setIsPaymentModalOpen(true);
  }, [cartItems.length]);

  const cartTotal = useMemo(() => {
    return (
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) *
      (1 + taxRate)
    );
  }, [cartItems, taxRate]);

  const handleConfirmPayment = useCallback(
    async (cashReceived: number) => {
      if (!dbKey) return;
      try {
        // 1. Create Invoice Header
        // calls the receipt API to create a new invoice in the database
        const receiptList = await receiptApi.createInvoice(
          dbKey,
          selectedCustomerId,
        );
        // Invoice created successfully

        // 2. Add Items
        // Iterates through cart items and adds them to the invoice
        for (const item of cartItems) {
          await receiptApi.addInvoiceItem(
            dbKey,
            receiptList.receipt_id,
            item.id,
            item.quantity,
          );
        }

        // 3. Success Feedback
        const change = cashReceived - cartTotal;
        showToast(
          `Payment Successful!\nChange: ${currency}${change.toFixed(2)}`,
          "success",
        );

        // 4. Reset
        setCartItems([]);
        setSelectedCustomerId(undefined);
        setIsPaymentModalOpen(false);
      } catch (error) {
        logger.error("Payment failed:", error);
        showToast("Payment failed. Please try again.", "error");
      }
    },
    [dbKey, cartItems, cartTotal, currency, selectedCustomerId, showToast],
  );

  const handleSetIsPaymentModalOpen = useCallback(
    (isOpen: boolean) => {
      setIsPaymentModalOpen(isOpen);
      if (!isOpen && isMockupMode) {
        setMockupView("default");
      }
    },
    [isMockupMode, setMockupView],
  );

  return {
    productsSource,
    categories,
    selectedCategory,
    handleCategoryChange,
    searchQuery,
    handleSearchChange,
    cartItems,
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
  };
}
