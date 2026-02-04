"use client";

import { useEffect, useState } from "react";
import { Category, NewCategory } from "../../../lib/types";
import { FaTimes } from "react-icons/fa";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: string) => Promise<void>;
    initialData?: Category;
    isSubmitting: boolean;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting,
}: CategoryModalProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
            } else {
                setName("");
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card-bg w-full max-w-md rounded-2xl shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold">
                        {initialData ? "Edit Category" : "New Category"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-foreground transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Category Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-border bg-zinc-800 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-400"
                                style={{ backgroundColor: '#27272a' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Coffee"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/10 transition-colors font-medium"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : "Save Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
