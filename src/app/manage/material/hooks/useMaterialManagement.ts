"use client";
import { useState, useMemo, useEffect } from "react";
import { materialApi } from "@/lib";
import { Material } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { logger } from "@/lib/logger";

export function useMaterialManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterials = async () => {
    if (!dbKey) return;
    try {
      if (materials.length === 0) setLoading(true);
      const data = await materialApi.getAll(dbKey);
      setMaterials(data);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch materials",
      );
      logger.error("Failed to fetch materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [dbKey]);

  const handleCreate = () => {
    setEditingMaterial(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Are you sure you want to delete this material?") ||
      !dbKey
    ) {
      return;
    }

    try {
      await materialApi.delete(dbKey, id);
      await fetchMaterials();
    } catch (err: unknown) {
      await showAlert(
        "Material Error",
        `Failed to delete material: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const handleModalSubmit = async (data: any) => {
    if (!dbKey) return;
    try {
      setIsSubmitting(true);

      if (editingMaterial) {
        await materialApi.update(
          dbKey,
          editingMaterial.id,
          data.name,
          data.type_,
          parseFloat(data.volume),
          parseInt(data.quantity, 10),
          data.tags,
        );
      } else {
        await materialApi.create(
          dbKey,
          data.name,
          data.type_,
          parseFloat(data.volume),
          parseInt(data.quantity, 10),
          data.tags,
        );
      }

      await fetchMaterials();
      setIsModalOpen(false);
    } catch (err: unknown) {
      await showAlert(
        "Material Error",
        `Failed to save material: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => m.tags?.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [materials, searchQuery, selectedTags]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    materials.forEach(m => {
      m.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [materials]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return {
    materials: filteredMaterials,
    allTags,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    toggleTag,
    isModalOpen,
    setIsModalOpen,
    editingMaterial,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalSubmit,
    refresh: fetchMaterials,
  };}
