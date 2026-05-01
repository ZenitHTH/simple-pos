# Performance Deep Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate global state updates in Design Tuner from triggering full-app re-renders, optimize `usePOSLogic` state management, and resolve Next.js layout thrashing.

**Architecture:** 
1. Separate `applySettingsToDOM` logic from `useApplySettings` to directly update CSS variables without React state changes. `updateSettings` will write to a ref and update the DOM, syncing to React state only on `commitHistory()`.
2. Replace `useSearchParams` and `router.push` in `usePOSLogic` with local `useState` to prevent Next.js layout hydration thrashing in the Tauri environment.
3. Stabilize cart logic and memoize `POSProductGrid` to prevent re-renders when the cart updates.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS

---

### Task 1: Extract `applySettingsToDOM`

**Files:**
- Modify: `src/context/settings/hooks.ts`

- [ ] **Step 1: Extract DOM injection logic to a reusable function**

Modify `src/context/settings/hooks.ts` to export `applySettingsToDOM`.

```typescript
import { useEffect } from "react";
import { AppSettings } from "@/lib";

export const updateStyleVariable = (name: string, value: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(name, value);
  }
};

export const applySettingsToDOM = (settings: AppSettings) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const safeFont = (f: string | null | undefined) => (f?.includes(";") ? "Inter" : f);
  const safeColor = (c: string | null | undefined) => (c?.includes(";") ? "#3b82f6" : c);

  root.style.setProperty("--typography-font-family", safeFont(settings.typography.font_family) ?? "Inter, sans-serif");
  root.style.setProperty("--typography-base-size", `${settings.typography.base_size ?? 16}px`);
  root.style.setProperty("--typography-heading-weight", String(settings.typography.heading_weight ?? 700));
  root.style.setProperty("--typography-body-weight", String(settings.typography.body_weight ?? 400));
  root.style.setProperty("--typography-line-height", String(settings.typography.line_height ?? 1.6));
  root.style.setProperty("--typography-letter-spacing", `${settings.typography.letter_spacing ?? 0}em`);

  const primaryColor = safeColor(settings.theme.theme_primary_color);
  if (primaryColor) root.style.setProperty("--theme-primary", primaryColor);
  else root.style.removeProperty("--theme-primary");

  const backgroundColor = safeColor(settings.theme.theme_background_color);
  if (backgroundColor) root.style.setProperty("--theme-background", backgroundColor);
  else root.style.removeProperty("--theme-background");

  const cardColor = safeColor(settings.theme.theme_card_color);
  if (cardColor) root.style.setProperty("--theme-card", cardColor);
  else root.style.removeProperty("--theme-card");

  const textColor = safeColor(settings.theme.theme_text_color);
  if (textColor) root.style.setProperty("--theme-text", textColor);
  else root.style.removeProperty("--theme-text");

  const borderColor = safeColor(settings.theme.theme_border_color);
  if (borderColor) root.style.setProperty("--theme-border", borderColor);
  else root.style.removeProperty("--theme-border");

  if (settings.theme.theme_radius !== null) root.style.setProperty("--radius", `${settings.theme.theme_radius}rem`);
  else root.style.removeProperty("--radius");

  const grid = settings.styling.grid;
  root.style.setProperty("--grid-item-padding", `${grid.item_padding ?? 16}px`);
  root.style.setProperty("--grid-item-radius", `${grid.item_radius ?? 24}px`);
  root.style.setProperty("--grid-item-title-font-size", String(grid.item_title_font_size ?? 100));
  root.style.setProperty("--grid-item-price-font-size", String(grid.item_price_font_size ?? 100));
  root.style.setProperty("--grid-gap", `${grid.gap ?? 20}px`);
  root.style.setProperty("--grid-item-shadow-opacity", `${(grid.item_shadow ?? 10) / 100}`);
  root.style.setProperty("--grid-item-border-width", `${grid.item_border_width ?? 1}px`);
  root.style.setProperty("--grid-item-hover-scale", `${(grid.item_hover_scale ?? 102) / 100}`);
  root.style.setProperty("--grid-item-bg-opacity", `${(grid.item_bg_opacity ?? 100) / 100}`);

  const sidebar = settings.styling.sidebar;
  root.style.setProperty("--sidebar-icon-size", `${sidebar.icon_size ?? 20}px`);
  root.style.setProperty("--sidebar-item-spacing", `${sidebar.item_spacing ?? 8}px`);
  root.style.setProperty("--sidebar-item-radius", `${sidebar.item_radius ?? 12}px`);
  root.style.setProperty("--sidebar-active-bg-opacity", `${(sidebar.active_bg_opacity ?? 10) / 100}`);

  const button = settings.styling.button;
  root.style.setProperty("--button-radius", `${button.radius ?? 12}px`);
  root.style.setProperty("--button-shadow-intensity", `${(button.shadow_intensity ?? 10) / 100}`);
  root.style.setProperty("--button-transition-speed", `${button.transition_speed ?? 200}ms`);

  const cart = settings.styling.cart;
  root.style.setProperty("--cart-item-font-size", String(cart.font_size ?? 100));
  root.style.setProperty("--cart-item-header-font-size", String(cart.header_font_size ?? 100));
  root.style.setProperty("--cart-item-price-font-size", String(cart.price_font_size ?? 100));
  root.style.setProperty("--cart-item-padding", `${cart.padding ?? 10}`);
  root.style.setProperty("--cart-item-margin", `${cart.margin ?? 8}`);
  root.style.setProperty("--cart-item-image-size", `${cart.image_size ?? 48}px`);
  root.style.setProperty("--cart-item-gap", `${cart.gap ?? 12}px`);
  root.style.setProperty("--cart-item-border-style", cart.border_style ?? "solid");
  root.style.setProperty("--cart-item-bg-opacity", `${(cart.bg_opacity ?? 0) / 100}`);

  root.style.setProperty("--display-scale", `${(settings.scaling.display_scale ?? 100) / 100}`);
  root.style.setProperty("--header-font-scale", `${(settings.scaling.fonts.header ?? 100) / 100}`);
};

export function useApplySettings(settings: AppSettings) {
  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings]);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/settings/hooks.ts
git commit -m "perf(settings): extract applySettingsToDOM for direct CSS manipulation"
```

---

### Task 2: Debounce React State in `SettingsContext`

**Files:**
- Modify: `src/context/settings/SettingsContext.tsx`

- [ ] **Step 1: Refactor `SettingsContext` to use a ref for intermediate updates**

Modify `src/context/settings/SettingsContext.tsx` to include `settingsRef` and `applySettingsToDOM`. Note: we only sync to React state on `commitHistory`, initial load, undo, redo, and reset.

```tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  use,
  useRef,
  ReactNode,
} from "react";
import { AppSettings, settingsApi, deepMerge, DeepPartial } from "@/lib";
import { logger } from "@/lib/utils/logger";
import { DEFAULT_SETTINGS, THEME_PRESETS } from "./constants";
import { useApplySettings, applySettingsToDOM } from "./hooks";

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
  save: () => Promise<void>;
  resetToCheckpoint: () => void;
  resetToDefault: () => void;
  setAutoSave: (enabled: boolean) => void;
  undo: () => void;
  redo: () => void;
  commitHistory: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const settingsRef = useRef<AppSettings>(DEFAULT_SETTINGS);
  
  const [past, setPast] = useState<AppSettings[]>([]);
  const [future, setFuture] = useState<AppSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoadAfterInit = useRef(true);

  // Apply CSS custom properties via custom hook when React state changes (for initial load / full resets)
  useApplySettings(settings);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await settingsApi.getSettings();
      const merged = deepMerge<AppSettings>(DEFAULT_SETTINGS, data);
      setSettings(merged);
      settingsRef.current = merged;
      setTimeout(() => setIsInitialized(true), 100);
    } catch (error) {
      logger.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const commitHistory = () => {
    setSettings(settingsRef.current);
    setPast((prev) => [...prev.slice(-19), settingsRef.current]);
    setFuture([]); // Clear future on new action
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    setFuture((prev) => [settingsRef.current, ...prev]);
    setPast(newPast);
    setSettings(previous);
    settingsRef.current = previous;
    applySettingsToDOM(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, settingsRef.current]);
    setFuture(newFuture);
    setSettings(next);
    settingsRef.current = next;
    applySettingsToDOM(next);
  };

  const updateSettings = (updates: DeepPartial<AppSettings>) => {
    let toApply = updates;
      
    if (updates.theme?.theme_preset && updates.theme.theme_preset !== "custom") {
      const preset = THEME_PRESETS[updates.theme.theme_preset as keyof typeof THEME_PRESETS];
      if (preset) {
        toApply = deepMerge(preset, updates);
      }
    }

    settingsRef.current = deepMerge<AppSettings>(settingsRef.current, toApply);
    
    // Apply immediately to DOM for fast CSS updates without React re-render
    applySettingsToDOM(settingsRef.current);
  };

  const save = async () => {
    try {
      // Save the latest ref, not just the committed state
      await settingsApi.saveSettings(settingsRef.current);
    } catch (error) {
      logger.error("Failed to save settings:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isInitialized || !autoSaveEnabled) return;

    if (isFirstLoadAfterInit.current) {
      isFirstLoadAfterInit.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save().catch((err) => logger.error("Auto-save failed:", err));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, isInitialized, autoSaveEnabled]);

  const resetToCheckpoint = async () => {
    setLoading(true);
    await load();
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    settingsRef.current = DEFAULT_SETTINGS;
    applySettingsToDOM(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext
      value={{
        settings, // Components still read from 'settings', which updates on commitHistory
        loading,
        updateSettings,
        save,
        resetToCheckpoint,
        resetToDefault,
        setAutoSave: setAutoSaveEnabled,
        undo,
        redo,
        commitHistory,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      }}
    >
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  const context = use(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/settings/SettingsContext.tsx
git commit -m "perf(settings): eliminate global state updates during active tuning"
```

---

### Task 3: Localize State in `TunerSlider`

**Files:**
- Modify: `src/components/design-tuner/ui/TunerSlider.tsx`
- Modify: `src/components/ui/RangeSlider.tsx`

- [ ] **Step 1: Fix `RangeSlider.tsx` to ensure `onPointerUp` handles all release events**

```tsx
"use client";

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  onPointerUp?: () => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function RangeSlider({
  value,
  onChange,
  onPointerUp,
  min = 0,
  max = 100,
  step = 1,
}: RangeSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onPointerUp={onPointerUp}
      onMouseUp={onPointerUp}
      onTouchEnd={onPointerUp}
      className="bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 [&::-webkit-slider-thumb]:bg-primary h-2 w-full cursor-pointer appearance-none rounded-lg [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
    />
  );
}
```

- [ ] **Step 2: Add local state to `TunerSlider.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import RangeSlider from "@/components/ui/RangeSlider";
import { cn } from "@/lib";
import { useSettings } from "@/context/settings/SettingsContext";

interface TunerSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
  variant?: "default" | "compact"; 
}

export function TunerSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  formatDisplay,
  variant = "default",
}: TunerSliderProps) {
  const { commitHistory } = useSettings();
  const [localValue, setLocalValue] = useState(value);

  // Sync with context value if it changes externally (e.g. undo/redo)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (v: number) => {
    setLocalValue(v);
    onChange(v); // Updates ref and DOM directly
  };

  const handlePointerUp = () => {
    commitHistory(); // Syncs ref to React state and saves history
  };

  const display = formatDisplay
    ? formatDisplay(localValue)
    : `${localValue}${unit}`;

  return (
    <div className={cn("space-y-1.5", variant === "compact" && "py-1")}>
      <div className="flex items-center justify-between px-1">
        <label
          className={cn(
            "text-muted-foreground uppercase",
            variant === "compact"
              ? "text-[10px] font-black tracking-[0.1em]"
              : "text-xs font-semibold tracking-wider"
          )}
        >
          {label}
        </label>
        <span
          className={cn(
            "text-primary font-mono",
            variant === "compact"
              ? "bg-primary/10 rounded px-2 py-1 text-[10px] font-black border border-primary/20"
              : "text-xs font-bold"
          )}
        >
          {display}
        </span>
      </div>
      <div className="flex items-center h-8">
        <RangeSlider
          value={localValue}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange}
          onPointerUp={handlePointerUp}
          onPointerDown={() => commitHistory()}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/design-tuner/ui/TunerSlider.tsx src/components/ui/RangeSlider.tsx
git commit -m "fix(tuner): decouple slider local state from global context updates"
```

---

### Task 4: Eliminate Next.js Layout Thrashing in `usePOSLogic`

**Files:**
- Modify: `src/hooks/features/usePOSLogic.tsx`

- [ ] **Step 1: Replace URL search params with local React state**

Remove `useSearchParams`, `useRouter`, and `updateURL` function. Introduce `useState` for `selectedCategory` and `searchQuery`.

```tsx
import { useState, useEffect, useTransition, useOptimistic } from "react";
import { CartItem, Product, Customer } from "@/lib";
import { categoryApi, receiptApi, customerApi } from "@/lib";
import { logger } from "@/lib/utils/logger";
import { useCurrency } from "@/hooks/settings/useCurrency";
import { useTax } from "@/hooks/settings/useTax";
import { exampleProducts, exampleCartItems } from "@/lib";
import { useMockup } from "@/context/MockupContext";
import { useDatabase } from "@/context/DatabaseContext";
import { useToast } from "@/context/ToastContext";

export function usePOSLogic(initialProducts: Product[]) {
  const { isMockupMode, mockupView, setMockupView } = useMockup();
  const { dbKey } = useDatabase();
  const { showToast } = useToast();
  const { currency } = useCurrency();
  const { taxRate } = useTax();

  const [isPending, startTransition] = useTransition();

  const productsSource = isMockupMode ? exampleProducts : initialProducts;

  // Local state for filtering instead of URL params to avoid Next.js layout thrashing
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [cartItems, setCartItems] = useState<CartItem[]>(
    isMockupMode ? exampleCartItems : []
  );

  type OptimisticAction = 
    | { type: "clear" }
    | { type: "add"; product: Product }
    | { type: "update"; id: number; delta: number }
    | { type: "remove"; id: number };

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

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(
    isMockupMode && mockupView === "payment"
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(undefined);

  const [prevIsMockupMode, setPrevIsMockupMode] = useState(isMockupMode);
  const [prevMockupView, setPrevMockupView] = useState(mockupView);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
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
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
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
  };

  const handleRemove = (id: number) => {
    startTransition(() => {
      addOptimisticCart({ type: "remove", id });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    });
  };

  const handleCheckout = () => {
    logger.info("usePOSLogic: handleCheckout called, cart length =", cartItems.length);
    if (cartItems.length === 0) return;
    logger.info("usePOSLogic: setting isPaymentModalOpen to true");
    setIsPaymentModalOpen(true);
  };

  const cartTotal = (() => {
    const totalSatang = optimisticCart.reduce((sum, item) => {
      const itemSatang = item.satang ?? Math.round(item.price * 100);
      return sum + itemSatang * item.quantity;
    }, 0);
    return (totalSatang * (1 + taxRate)) / 100;
  })();

  const handleConfirmPayment = (cashReceived: number) => {
    if (!dbKey) return;
    
    startTransition(async () => {
      addOptimisticCart({ type: "clear" });
      
      try {
        const receiptList = await receiptApi.completeCheckout(dbKey, {
          customerId: selectedCustomerId,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        });

        const change = cashReceived - cartTotal;
        showToast(
          `Payment Successful!\nChange: ${currency}${change.toFixed(2)}`,
          "success",
        );
        logger.action("payment_confirmed", { receiptId: receiptList.receipt_id });

        setCartItems([]);
        setSelectedCustomerId(undefined);
        setIsPaymentModalOpen(false);
      } catch (error) {
        logger.error("Payment failed:", error);
        showToast("Payment failed. Please try again.", "error");
      }
    });
  };

  const handleSetIsPaymentModalOpen = (isOpen: boolean) => {
    setIsPaymentModalOpen(isOpen);
    if (!isOpen && isMockupMode) {
      setMockupView("default");
    }
  };

  return {
    productsSource,
    categories,
    selectedCategory,
    handleCategoryChange,
    searchQuery,
    handleSearchChange,
    cartItems: optimisticCart,
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
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/features/usePOSLogic.tsx
git commit -m "perf(pos): eliminate Next.js layout thrashing by removing search params"
```

---

### Task 5: Isolate Product Grid from Cart Re-renders

**Files:**
- Modify: `src/components/pos/POSClient.tsx`
- Modify: `src/components/pos/POSProductGrid.tsx`

To prevent `usePOSLogic` cart updates from re-rendering the entire `POSProductGrid` inside `POSClient`, we can extract the cart to its own context or simply memoize the product grid. Since React Compiler is not fully managing this structure to prevent all re-renders yet, we explicitly use `React.memo`.

- [ ] **Step 1: Wrap `POSProductGrid` in `React.memo`**

Modify `src/components/pos/POSProductGrid.tsx` and export it wrapped in `memo`.

```tsx
// Inside src/components/pos/POSProductGrid.tsx
import { memo } from "react";
// ... imports

function POSProductGrid({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  settings,
  onAddToCart,
  currency,
}: POSProductGridProps) {
  // ... existing component code
}

export default memo(POSProductGrid);
```

- [ ] **Step 2: Stable references in `POSClient`**

We must ensure `usePOSLogic` provides stable references to `onAddToCart`, `onCategoryChange`, and `onSearchChange` to make `memo` effective. Since `usePOSLogic` doesn't `useCallback` them, we will wrap them in `useCallback` inside `usePOSLogic.tsx`.

Modify `src/hooks/features/usePOSLogic.tsx` (add `useCallback` where we return functions):

```tsx
import { useState, useEffect, useTransition, useOptimistic, useCallback } from "react";
// ... rest of imports

// In usePOSLogic:
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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

// ... Apply same useCallback to handleUpdateQuantity, handleRemove, handleCheckout, handleConfirmPayment
```

- [ ] **Step 3: Commit**

```bash
git add src/components/pos/POSProductGrid.tsx src/hooks/features/usePOSLogic.tsx
git commit -m "perf(pos): memoize POSProductGrid and stabilize POS callbacks to prevent cart re-renders"
```
