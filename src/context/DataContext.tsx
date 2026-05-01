"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  use,
  useMemo,
} from "react";
import { invoke } from "@/lib/api/invoke";
import {
  productApi,
  categoryApi,
  customerApi,
  materialApi,
  stockApi,
  BackendProduct,
  Category,
  Customer,
  Material,
  Stock,
  Product, // Import UI type
} from "@/lib";
import { useDatabase } from "./DatabaseContext";
import { logger } from "@/lib/utils/logger";

interface DataContextType {
  products: BackendProduct[];
  mappedProducts: Product[]; // New field
  categories: Category[];
  customers: Customer[];
  materials: Material[];
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  updateCache: {
    products: (data: BackendProduct[]) => void;
    categories: (data: Category[]) => void;
    customers: (data: Customer[]) => void;
    materials: (data: Material[]) => void;
    stocks: (data: Stock[]) => void;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { dbKey } = useDatabase();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    if (!dbKey) return;

    try {
      setLoading(true);
      logger.info("Atomic Warming: Fetching consolidated management data...");

      const data = await invoke("get_full_management_data");
      const {
        products: pData,
        categories: cData,
        customers: custData,
        materials: mData,
        stocks: sData,
      } = data as any;

      setProducts(pData);
      setCategories(cData);
      setCustomers(custData);
      setMaterials(mData);
      setStocks(sData);
      setError(null);
      logger.info("Front-end cache warmed successfully (1 round-trip).");
    } catch (err) {
      logger.error("Failed to warm front-end cache:", err);
      setError("Failed to load application data.");
    } finally {
      setLoading(false);
    }
  }, [dbKey]);

  // Initial load when DB is unlocked
  useEffect(() => {
    if (dbKey) {
      refreshAll();
    }
  }, [dbKey, refreshAll]);

  const updateCache = useMemo(
    () => ({
      products: setProducts,
      categories: setCategories,
      customers: setCustomers,
      materials: setMaterials,
      stocks: setStocks,
    }),
    [setProducts, setCategories, setCustomers, setMaterials, setStocks],
  );

  // Expose for E2E testing (Development only)
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      (window as any).updateCache = updateCache;
    }
  }, [updateCache]);

  const mappedProducts = useMemo(() => {
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
    return products.map((p) => ({
      id: p.product_id,
      name: p.title,
      price: p.satang / 100,
      satang: p.satang,
      category: catMap[p.category_id] || "Unknown",
      image: p.image_path || "",
      image_object_position: p.image_object_position,
    }));
  }, [products, categories]);

  const value = useMemo(
    () => ({
      products,
      mappedProducts,
      categories,
      customers,
      materials,
      stocks,
      loading,
      error,
      refreshAll,
      updateCache,
    }),
    [
      products,
      mappedProducts,
      categories,
      customers,
      materials,
      stocks,
      loading,
      error,
      refreshAll,
      updateCache,
    ],
  );

  return <DataContext value={value}>{children}</DataContext>;
}

export function useDataCache() {
  const context = use(DataContext);
  if (!context) {
    throw new Error("useDataCache must be used within a DataProvider");
  }
  return context;
}
