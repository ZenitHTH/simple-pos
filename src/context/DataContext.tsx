"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, use } from "react";
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
  Stock 
} from "@/lib";
import { useDatabase } from "./DatabaseContext";
import { logger } from "@/lib/utils/logger";

interface DataContextType {
  products: BackendProduct[];
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
      logger.info("Pre-fetching all management data for front-end cache...");
      
      const [pData, cData, custData, mData, sData] = await Promise.all([
        productApi.getAll(dbKey),
        categoryApi.getAll(dbKey),
        customerApi.getAll(dbKey),
        materialApi.getAll(dbKey),
        stockApi.getAll(dbKey)
      ]);

      setProducts(pData);
      setCategories(cData);
      setCustomers(custData);
      setMaterials(mData);
      setStocks(sData);
      setError(null);
      logger.info("Front-end cache warmed successfully.");
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

  const updateCache = {
    products: setProducts,
    categories: setCategories,
    customers: setCustomers,
    materials: setMaterials,
    stocks: setStocks,
  };

  // Expose for E2E testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateCache = updateCache;
    }
  }, [setProducts, setCategories, setCustomers, setMaterials, setStocks]);

  const value = {
    products,
    categories,
    customers,
    materials,
    stocks,
    loading,
    error,
    refreshAll,
    updateCache
  };

  return <DataContext value={value}>{children}</DataContext>;
}

export function useDataCache() {
  const context = use(DataContext);
  if (!context) {
    throw new Error("useDataCache must be used within a DataProvider");
  }
  return context;
}
