"use client";

import { usePOSLogic } from "@/hooks/features/usePOSLogic";
import { Product } from "@/lib";
import { useSettings } from "@/context/settings/SettingsContext";
import POSHeader from "./POSHeader";
import POSProductGrid from "./POSProductGrid";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";
import Cart from "@/components/cart/Cart";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";

const PaymentModal = dynamic(() => import("@/components/payment/PaymentModal"), { ssr: false });

interface POSClientProps {
  initialProducts?: Product[];
}

/**
 * POSClient component serves as the main entry point for the Point of Sale interface.
 * It manages the product grid, category filtering, search, and the shopping cart.
 * 
 * @param {POSClientProps} props - The component props.
 * @param {Product[]} [props.initialProducts] - Optional initial list of products to display.
 */
export default function POSClient({ initialProducts = [] }: POSClientProps) {
  const { settings } = useSettings();
  const {
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
    setIsPaymentModalOpen,
    handleCheckout,
    handleConfirmPayment,
    currency,
    cartTotal,
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    isPending,
  } = usePOSLogic(initialProducts);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(true);

  // Calculate Cart items count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate Cart Width
  const cartBaseWidth = 320; // w-80
  const cartWidthMultiplier = (settings.scaling.components.cart || 100) / 100;
  const cartDynamicWidth = isCartVisible ? `${cartBaseWidth * cartWidthMultiplier}px` : "0px";

  return (
    <div className="bg-background box-border flex h-full gap-6 overflow-hidden p-6">
      {/* Left Side: Product Grid */}
      <div className="flex h-full min-w-0 flex-1 flex-col pr-2">
        <POSHeader
          cartCount={cartCount}
          onOpenCart={() => setIsCartDrawerOpen(true)}
          isCartVisible={isCartVisible}
          onToggleCart={() => setIsCartVisible(!isCartVisible)}
        />

        <POSProductGrid
          products={productsSource}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          settings={settings}
          onAddToCart={handleAddToCart}
          currency={currency}
        />
      </div>

      {/* Right Side: Cart Sidebar */}
      <div
        className={`relative hidden h-full shrink-0 transition-[width,opacity] duration-500 md:block ${
          isCartVisible ? "opacity-100" : "w-0 overflow-hidden opacity-0 pointer-events-none"
        }`}
        style={{
          width: cartDynamicWidth,
          fontSize: `${settings.scaling.fonts.cart || 100}%`,
        }}
      >
        <SelectableOverlay id="cart_scale" />
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          currency={currency}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onCustomerSelect={setSelectedCustomerId}
          itemsCount={cartCount}
        />
      </div>

      {/* ... Modals ... */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={cartTotal}
        onConfirm={handleConfirmPayment}
        isPending={isPending}
        currency={currency}
      />

      {/* Cart Drawer for Mobile (strictly small screens) */}
      <Drawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        title="Current Order"
        className="md:hidden"
      >
        <div
          className="h-full overflow-y-auto"
          style={{
            fontSize: `${settings.scaling.fonts.cart || 100}%`,
          }}
        >
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={() => {
              setIsCartDrawerOpen(false);
              handleCheckout();
            }}
            currency={currency}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onCustomerSelect={setSelectedCustomerId}
            itemsCount={cartCount}
          />
        </div>
      </Drawer>
    </div>
  );
}
