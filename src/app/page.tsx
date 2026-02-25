"use client";

import { Suspense, useEffect, useState } from "react";
import POSClient from "@/components/pos/POSClient";
import { Product } from "@/lib";
import { productApi, categoryApi } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";

function POSLoader() {
  const { dbKey } = useDatabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!dbKey) return;
      try {
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
          price: p.satang / 100,
          category: catMap[p.category_id] || "Unknown",
          image: p.image_path || "",
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [dbKey]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return <POSClient initialProducts={products} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <POSLoader />
    </Suspense>
  );
}
