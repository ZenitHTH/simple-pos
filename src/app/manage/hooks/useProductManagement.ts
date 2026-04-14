import { useState, useEffect } from "react";
import { productApi, categoryApi } from "@/lib";
import { BackendProduct, NewProduct, Category } from "@/lib";
import { logger } from "@/lib/logger";

import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";

export function useProductManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    BackendProduct | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    if (!dbKey) return;
    try {
      if (products.length === 0) setLoading(true);
      const [data, fetchedCategories] = await Promise.all([
        productApi.getAll(dbKey),
        categoryApi.getAll(dbKey),
      ]);
      setProducts(data);
      setCategories(fetchedCategories);
    } catch (err) {
      logger.error("Failed to fetch products:", err);
      setError("Failed to load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dbKey]);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: BackendProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?") || !dbKey)
      return;

    try {
      await productApi.delete(dbKey, id);
      setProducts(products.filter((p) => p.product_id !== id));
    } catch (err) {
      logger.error("Failed to delete product:", err);
      await showAlert("Product Error", String(err));
    }
  };

  const handleModalSubmit = async (
    data: NewProduct,
    afterSubmit?: (saved: BackendProduct) => Promise<void>,
  ): Promise<BackendProduct | undefined> => {
    if (!dbKey) return;
    try {
      setIsSubmitting(true);
      let result: BackendProduct;
      if (editingProduct) {
        const updated = await productApi.update(dbKey, {
          ...data,
          product_id: editingProduct.product_id,
        });
        result = updated;
      } else {
        const created = await productApi.create(dbKey, data);
        result = created;
      }

      if (afterSubmit) {
        await afterSubmit(result);
      }

      // Re-fetch to get updated state (including images)
      await fetchProducts();

      setIsModalOpen(false);
      return result;
    } catch (err) {
      logger.error("Failed to save product:", err);
      await showAlert("Product Error", String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryName =
      categories.find((c) => c.id === product.category_id)?.name || "Unknown";
    return (
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleToggleStockMode = async (
    productId: number,
    currentMode: boolean,
  ) => {
    if (!dbKey) return;
    const nextMode = !currentMode;
    // Optimistic update — flip immediately so the Switch responds right away
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === productId ? { ...p, use_recipe_stock: nextMode } : p,
      ),
    );
    try {
      await productApi.setStockMode(dbKey, productId, nextMode);
    } catch (err) {
      // Roll back on failure
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === productId
            ? { ...p, use_recipe_stock: currentMode }
            : p,
        ),
      );
      logger.error("Failed to toggle stock mode:", err);
      await showAlert("Product Error", "Failed to toggle stock mode");
    }
  };

  return {
    products: filteredProducts,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalSubmit,
    handleToggleStockMode,
  };
}
