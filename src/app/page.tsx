"use client";

import { useEffect, useState } from 'react';
import POSClient from './components/POSClient';
import { Product } from './types';
import { productApi } from '@/lib/api';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const backendProducts = await productApi.getAll();
        const mappedProducts: Product[] = backendProducts.map(p => ({
          id: p.product_id,
          name: p.title,
          price: p.satang / 100, // Convert satang to unit
          category: p.catagory, // Note: backend uses 'catagory' typo
          image: "", // Placeholder or default image logic could go here
          color: "#78350f" // Default color
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return <POSClient initialProducts={products} />;
}

