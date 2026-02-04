"use client";

import { useState, useEffect } from "react";
import { BackendProduct, NewProduct, Category } from "../../lib/types";
import { categoryApi } from "../../lib/api";
import { FaTimes } from "react-icons/fa";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: NewProduct) => void;
    initialData?: BackendProduct;
    isSubmitting: boolean;
}

export default function ProductModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting,
}: ProductModalProps) {
    const [formData, setFormData] = useState<NewProduct>({
        title: initialData?.title || "",
        catagory: initialData?.catagory || "",
        satang: initialData?.satang || 0,
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (isOpen) {
            categoryApi.getAll().then(setCategories).catch(console.error);
        }
    }, [isOpen]);

    // Reset form when opening for create, or set for edit
    // Note: This is a simple implementation. For production, consider useEffect to sync initialData.
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getPrice = (satang: number) => (satang / 100).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card-bg w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-border bg-muted/5">
                    <h2 className="text-xl font-bold">
                        {initialData ? "Edit Product" : "New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-foreground transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-border bg-zinc-800 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-400"
                            style={{ backgroundColor: '#27272a' }}
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border bg-zinc-800 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                            style={{
                                backgroundColor: '#27272a',
                                color: 'white',
                                colorScheme: 'dark',
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                            value={formData.catagory}
                            onChange={(e) =>
                                setFormData({ ...formData, catagory: e.target.value })
                            }
                        >
                            <option value="" style={{ backgroundColor: '#27272a', color: 'white' }}>Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name} style={{ backgroundColor: '#27272a', color: 'white' }}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Price (Satang)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-zinc-800 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                style={{ backgroundColor: '#27272a' }}
                                value={formData.satang}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        satang: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Display Price
                            </label>
                            <div className="px-3 py-2 rounded-lg border border-border bg-muted/10 text-muted">
                                ฿{getPrice(formData.satang)}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
