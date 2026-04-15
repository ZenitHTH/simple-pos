"use client";
import { useState, useEffect, useCallback } from "react";
import {
  BackendProduct,
  Material,
  recipeApi,
  productApi,
  materialApi,
} from "@/lib";
import { RecipeItem, RecipeList, RecipeRow } from "@/lib/types/recipe";
import { useDatabase } from "@/context/DatabaseContext";
import { logger } from "@/lib/utils/logger";

export function useRecipeTable() {
  const { dbKey } = useDatabase();
  const [rows, setRows] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!dbKey) return;
    try {
      setLoading(true);
      const [products, materials] = await Promise.all([
        productApi.getAll(dbKey),
        materialApi.getAll(dbKey),
      ]);

      const result: RecipeRow[] = [];
      for (const product of products) {
        const list = await recipeApi.getListByProduct(
          dbKey,
          product.product_id,
        );
        if (!list) continue;
        const items = await recipeApi.getItems(dbKey, list.id);
        if (items.length === 0) continue;
        result.push({ product, list, items, materials });
      }
      setRows(result);
    } catch (e) {
      logger.error("Failed to load recipe table", e);
    } finally {
      setLoading(false);
    }
  }, [dbKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, refresh };
}
