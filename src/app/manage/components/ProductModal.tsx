"use client";

import { useState } from "react";
import { BackendProduct, NewProduct } from "../../lib/types";
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
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            value={formData.catagory}
                            onChange={(e) =>
                                setFormData({ ...formData, catagory: e.target.value })
                            }
                        >
                            <option value="">Select Category</option>
                            <option value="Coffee">Coffee</option>
                            <option value="Tea">Tea</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Dessert">Dessert</option>
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
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
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
