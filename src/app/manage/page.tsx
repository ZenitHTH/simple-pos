"use client";

import { useEffect, useState } from "react";
import { productApi } from "@/lib/api";
import { BackendProduct, NewProduct } from "@/lib/types";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ProductModal from "./components/ProductModal";
import { useSettings } from "@/app/context/SettingsContext";
import SelectableOverlay from '../components/design-mode/SelectableOverlay';

export default function ManagePage() {
    const { settings } = useSettings();
    const [products, setProducts] = useState<BackendProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<BackendProduct | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productApi.getAll();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (product: BackendProduct) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await productApi.delete(id);
            setProducts(products.filter(p => p.product_id !== id));
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Failed to delete product");
        }
    };

    const handleModalSubmit = async (data: NewProduct) => {
        try {
            setIsSubmitting(true);
            if (editingProduct) {
                const updated = await productApi.update({
                    ...data,
                    product_id: editingProduct.product_id,
                });
                setProducts(products.map(p => p.product_id === updated.product_id ? updated : p));
            } else {
                const created = await productApi.create(data);
                setProducts([...products, created]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Failed to save product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.catagory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
                    <p className="text-muted">Manage your inventory items</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                >
                    <FaPlus />
                    <span>New Product</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card-bg focus:ring-2 focus:ring-primary/50 outline-none"
                />
            </div>

            {error && (
                <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div
                    className="relative group origin-top transition-transform duration-200 ease-out"
                    style={{
                        transform: `scale(${settings.manage_table_scale / 100})`,
                        marginBottom: `${(settings.manage_table_scale - 100) * 0.5}%`
                    }}
                >
                    <SelectableOverlay id="manage_table_scale" />
                    <div className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-muted/5 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-muted">ID</th>
                                    <th className="px-6 py-4 font-medium text-muted">Title</th>
                                    <th className="px-6 py-4 font-medium text-muted">Category</th>
                                    <th className="px-6 py-4 font-medium text-muted">Price</th>
                                    <th className="px-6 py-4 font-medium text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.product_id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4 text-muted">#{product.product_id}</td>
                                            <td className="px-6 py-4 font-medium">{product.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                                                    {product.catagory}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono">฿{(product.satang / 100).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 text-muted hover:text-primary transition-colors hover:bg-blue-50 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.product_id)}
                                                        className="p-2 text-muted hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={editingProduct}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
