import { useState, useEffect } from "react";
import { categoryApi } from "@/lib";
import { Category } from "@/lib";
import { logger } from "@/lib/logger";

import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";

export function useCategoryManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!dbKey) return;
      try {
        // Only show loading if we have no categories yet (first load of the session)
        if (categories.length === 0) setLoading(true);
        const data = await categoryApi.getAll(dbKey);
        setCategories(data);
      } catch (err) {
        logger.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [dbKey]);

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?") || !dbKey)
      return;
    try {
      await categoryApi.delete(dbKey, id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      logger.error("Failed to delete category:", err);
      await showAlert("Category Error", "Failed to delete category");
    }
  };

  const handleModalSubmit = async (name: string) => {
    if (!dbKey) return;
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        const updated = await categoryApi.update(dbKey, {
          ...editingCategory,
          name,
        });
        setCategories(
          categories.map((c) => (c.id === updated.id ? updated : c)),
        );
      } else {
        const created = await categoryApi.create(dbKey, name);
        setCategories([...categories, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      logger.error("Failed to save category:", err);
      await showAlert("Category Error", "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    categories,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalSubmit,
  };
}
