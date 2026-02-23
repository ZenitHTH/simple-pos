"use client";

import { useState, useCallback, useEffect } from "react";
import {
  BackendProduct,
  Material,
  recipeApi,
  productApi,
  materialApi,
  scaledToFloat,
} from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";

export interface SimpleRecipeItem {
  material_id: number;
  name: string;
  volume_use: number;
  unit: string;
}

export function useSimpleRecipe({ onSaved }: { onSaved?: () => void } = {}) {
  const { dbKey } = useDatabase();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);
  const [recipeItems, setRecipeItems] = useState<SimpleRecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (dbKey) {
      loadData();
    }
  }, [dbKey]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!dbKey) throw new Error("Database key not found");

      const [pData, mData] = await Promise.all([
        productApi.getAll(dbKey),
        materialApi.getAll(dbKey),
      ]);
      setProducts(pData);
      setMaterials(mData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = async (product: BackendProduct) => {
    setSelectedProduct(product);
    if (!dbKey) return;

    try {
      const list = await recipeApi.getListByProduct(dbKey, product.product_id);
      if (list) {
        const items = await recipeApi.getItems(dbKey, list.id);
        const mappedItems: SimpleRecipeItem[] = items.map((item) => {
          const material = materials.find((m) => m.id === item.material_id);
          return {
            material_id: item.material_id,
            name: material?.name || "Unknown Material",
            volume_use: scaledToFloat(item.volume_use, item.volume_use_precision),
            unit: item.unit,
          };
        });
        setRecipeItems(mappedItems);
      } else {
        setRecipeItems([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load recipe");
    }
  };

  const addMaterial = useCallback((material: Material) => {
    setRecipeItems((prev) => {
      if (prev.some((item) => item.material_id === material.id)) {
        setError(`${material.name} is already in the recipe.`);
        setTimeout(() => setError(null), 3000);
        return prev;
      }

      return [
        ...prev,
        {
          material_id: material.id,
          name: material.name,
          volume_use: 1,
          unit: material.type_ || "Pieces",
        },
      ];
    });
  }, []);

  const removeMaterial = (materialId: number) => {
    setRecipeItems((prev) => prev.filter((item) => item.material_id !== materialId));
  };

  const updateItem = (materialId: number, volume_use: number, unit: string) => {
    setRecipeItems((prev) =>
      prev.map((item) =>
        item.material_id === materialId ? { ...item, volume_use, unit } : item
      )
    );
  };

  const saveRecipe = async () => {
    if (!selectedProduct || !dbKey) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      // 1. Delete existing list if any
      const existingList = await recipeApi.getListByProduct(dbKey, selectedProduct.product_id);
      if (existingList) {
        await recipeApi.deleteList(dbKey, existingList.id);
      }

      if (recipeItems.length > 0) {
        // 2. Create new list
        const newList = await recipeApi.createList(dbKey, selectedProduct.product_id);

        // 3. Add items
        for (const item of recipeItems) {
          await recipeApi.addItem(
            dbKey,
            newList.id,
            item.material_id,
            item.volume_use,
            item.unit
          );
        }
      }

      setSuccessMsg("Recipe saved successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      onSaved?.();
    } catch (err: any) {
      setError(err.message || "Failed to save recipe");
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  return {
    products,
    materials,
    selectedProduct,
    recipeItems,
    loading,
    saving,
    error,
    successMsg,
    selectProduct,
    addMaterial,
    removeMaterial,
    updateItem,
    saveRecipe,
    setSelectedProduct,
  };
}
