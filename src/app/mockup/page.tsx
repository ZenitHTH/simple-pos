"use client";

import { useEffect, useState } from "react";
import POSClient from "@/components/pos/POSClient";
import { Product } from "@/lib";
import { productApi, categoryApi } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";
import { logger } from "@/lib/utils/logger";

export default function MockupPage() {
  const { dbKey } = useDatabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!dbKey) return;
      try {
        // Use backend products or fall back to mock data
        const [backendProducts, backendCategories] = await Promise.all([
          productApi.getAll(dbKey),
          categoryApi.getAll(dbKey),
        ]);
        const catMap = Object.fromEntries(
          backendCategories.map((c) => [c.id, c.name]),
        );

        const mappedProducts: Product[] = backendProducts.map((p) => ({
          id: p.product_id,
          name: p.title,
          price: p.satang / 100, // Convert satang to unit
          category: catMap[p.category_id] || "Unknown",
          image: "",
          color: "#78350f",
        }));

        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
        } else {
          // Fallback mock data if API fails or is empty, for better "Mockup" experience
          setProducts(generateMockProducts());
        }
      } catch (error) {
        logger.error("Failed to load products, using mock data:", error);
        setProducts(generateMockProducts());
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [dbKey]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Mockup UI...
      </div>
    );
  }

  return (
    <>
      <div className="border-warning relative box-border h-full border-4">
        <div className="bg-warning text-warning-foreground absolute top-0 right-0 z-50 rounded-bl-lg px-4 py-1 font-bold">
          Design Mode
        </div>
        <POSClient initialProducts={products} />
      </div>
    </>
  );
}

function generateMockProducts(): Product[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Mock Product ${i + 1}`,
    price: 100 + i * 10,
    category: i % 2 === 0 ? "Food" : "Drink",
    image: "",
    color: i % 2 === 0 ? "#78350f" : "#14532d",
  }));
}
