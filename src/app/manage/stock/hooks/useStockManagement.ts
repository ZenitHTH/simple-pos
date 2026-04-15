"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { stockApi, productApi } from "@/lib";
import { Stock, BackendProduct } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { logger } from "@/lib/utils/logger";
import { useDataCache } from "@/context/DataContext";

export function useStockManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const { stocks, products, updateCache, refreshAll } = useDataCache();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const targetProductId = searchParams.get("product_id");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Still need this for the deep-link search logic, but it uses cached products
  useEffect(() => {
    if (targetProductId && products.length > 0) {
      const product = products.find(
        (p) => p.product_id === Number(targetProductId),
      );
      if (product) {
        setSearchQuery(product.title);
      }
    }
  }, [targetProductId, products]);

  const getProductName = (productId: number): string => {
    const product = products.find((p) => p.product_id === productId);
    return product ? product.title : `Product #${productId}`;
  };

  const handleCreate = () => {
    setEditingStock(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };

  const handleDelete = async (stockId: number) => {
    if (!confirm("Are you sure you want to delete this stock entry?") || !dbKey)
      return;
    try {
      await stockApi.remove(dbKey, stockId);
      updateCache.stocks(stocks.filter((s) => s.stock_id !== stockId));
    } catch (err) {
      logger.error("Failed to delete stock:", err);
      await showAlert("Stock Error", "Failed to delete stock entry");
    }
  };

  const handleModalSubmit = async (productId: number, quantity: number) => {
    if (!dbKey) return;
    try {
      setIsSubmitting(true);
      if (editingStock) {
        const updated = await stockApi.update(dbKey, productId, quantity);
        updateCache.stocks(
          stocks.map((s) =>
            s.stock_id === editingStock.stock_id ? updated : s,
          ),
        );
      } else {
        const created = await stockApi.add(dbKey, productId, quantity);
        updateCache.stocks([...stocks, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      logger.error("Failed to save stock:", err);
      await showAlert("Stock Error", "Failed to save stock entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    const productName = getProductName(stock.product_id);
    return productName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return {
    stocks: filteredStocks,
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingStock,
    isSubmitting,
    getProductName,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalSubmit,
  };
}
