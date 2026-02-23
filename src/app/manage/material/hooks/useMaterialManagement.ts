"use client";
import { useState, useMemo, useEffect } from "react";
import { materialApi } from "@/lib";
import { Material } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";

export function useMaterialManagement() {
  const { dbKey } = useDatabase();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterials = async () => {
    if (!dbKey) return;
    try {
      setLoading(true);
      const data = await materialApi.getAll(dbKey);
      setMaterials(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch materials");
      console.error(err);
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
    } catch (err: any) {
      alert(`Failed to delete material: ${err.message || err}`);
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
        );
      } else {
        await materialApi.create(
          dbKey,
          data.name,
          data.type_,
          parseFloat(data.volume),
          parseInt(data.quantity, 10),
        );
      }

      await fetchMaterials();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Failed to save material: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [materials, searchQuery]);

  return {
    materials: filteredMaterials,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingMaterial,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalSubmit,
    refresh: fetchMaterials,
  };
}
