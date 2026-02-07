"use client";

import { useState, useEffect } from "react";
import { BackendProduct, NewProduct, Category } from "@/lib/types";
import { categoryApi } from "@/lib/api";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select, Option } from "../../components/ui/Select";

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
    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: initialData?.title || "",
                catagory: initialData?.catagory || "",
                satang: initialData?.satang || 0,
            });
        }
    }, [isOpen, initialData]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getPrice = (satang: number) => (satang / 100).toFixed(2);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit Product" : "New Product"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <Select
                    label="Category"
                    value={formData.catagory}
                    onChange={(e) => setFormData({ ...formData, catagory: e.target.value })}
                >
                    <Option value="">Select Category</Option>
                    {categories.map((cat) => (
                        <Option key={cat.id} value={cat.name}>
                            {cat.name}
                        </Option>
                    ))}
                </Select>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price (Satang)"
                        type="number"
                        required
                        min="0"
                        value={formData.satang}
                        onChange={(e) => setFormData({ ...formData, satang: parseInt(e.target.value) || 0 })}
                    />
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
        </Modal>
    );
}
