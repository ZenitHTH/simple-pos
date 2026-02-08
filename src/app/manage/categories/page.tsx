"use client";

import { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";
import { Category } from "@/lib/types";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CategoryModal from "./components/CategoryModal";
import { useSettings } from "@/app/context/SettingsContext";
import SelectableOverlay from '../../components/design-mode/SelectableOverlay';

export default function CategoriesPage() {
    const { settings } = useSettings();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoryApi.delete(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete category");
        }
    };

    const handleModalSubmit = async (name: string) => {
        try {
            setIsSubmitting(true);
            if (editingCategory) {
                const updated = await categoryApi.update({ ...editingCategory, name });
                setCategories(categories.map(c => c.id === updated.id ? updated : c));
            } else {
                const created = await categoryApi.create(name);
                setCategories([...categories, created]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save category");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Category Management</h1>
                    <p className="text-muted">Manage product categories</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                >
                    <FaPlus />
                    <span>New Category</span>
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div
                    className="relative group origin-top transition-transform duration-200 ease-out"
                    style={{
                        transform: `scale(${settings.category_table_scale / 100})`,
                        marginBottom: `${(settings.category_table_scale - 100) * 0.5}%`,
                        fontSize: `${settings?.category_table_font_scale || 100}%`
                    }}
                >
                    <SelectableOverlay id="category_table_scale" />
                    <div className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-muted/5 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-muted">ID</th>
                                    <th className="px-6 py-4 font-medium text-muted">Name</th>
                                    <th className="px-6 py-4 font-medium text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4 text-muted">#{cat.id}</td>
                                        <td className="px-6 py-4 font-medium">{cat.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(cat)} className="p-2 hover:bg-blue-50 text-muted hover:text-primary rounded-lg transition-colors"><FaEdit /></button>
                                                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 text-muted hover:text-red-500 rounded-lg transition-colors"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingCategory}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
