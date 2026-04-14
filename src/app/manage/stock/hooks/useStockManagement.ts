"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { stockApi, productApi } from "@/lib";
import { Stock, BackendProduct } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { logger } from "@/lib/logger";

export function useStockManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const targetProductId = searchParams.get("product_id");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!dbKey) return;
      try {
        setLoading(true);
        const [stockData, productData] = await Promise.all([
          stockApi.getAll(dbKey),
          productApi.getAll(dbKey),
        ]);
        setStocks(stockData);
        setProducts(productData);

        // If product_id is provided in URL, pre-fill search query with product title
        if (targetProductId) {
          const product = productData.find(
            (p) => p.product_id === Number(targetProductId),
          );
          if (product) {
            setSearchQuery(product.title);
          }
        }
      } catch (err) {
        logger.error("Failed to fetch stock data:", err);
        setError("Failed to load stock data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dbKey, targetProductId]);

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
      setStocks(stocks.filter((s) => s.stock_id !== stockId));
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
        setStocks(
          stocks.map((s) =>
            s.stock_id === editingStock.stock_id ? updated : s,
          ),
        );
      } else {
        const created = await stockApi.add(dbKey, productId, quantity);
        setStocks([...stocks, created]);
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
