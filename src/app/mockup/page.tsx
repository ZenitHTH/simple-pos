"use client";

import { useEffect, useState } from 'react';
import POSClient from '../components/POSClient';
import { Product } from '../types';
import { productApi } from '@/lib/api';

export default function MockupPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                // Use backend products or fall back to mock data
                const backendProducts = await productApi.getAll();
                const mappedProducts: Product[] = backendProducts.map(p => ({
                    id: p.product_id,
                    name: p.title,
                    price: p.satang / 100, // Convert satang to unit
                    category: p.catagory,
                    image: "",
                    color: "#78350f"
                }));

                if (mappedProducts.length > 0) {
                    setProducts(mappedProducts);
                } else {
                    // Fallback mock data if API fails or is empty, for better "Mockup" experience
                    setProducts(generateMockProducts());
                }
            } catch (error) {
                console.error("Failed to load products, using mock data:", error);
                setProducts(generateMockProducts());
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading Mockup UI...</div>;
    }

    return (
        <>
            <div className="border-4 border-yellow-400 box-border h-full relative">
                <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 font-bold z-50 rounded-bl-lg">
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
        color: i % 2 === 0 ? "#78350f" : "#14532d"
    }));
}
