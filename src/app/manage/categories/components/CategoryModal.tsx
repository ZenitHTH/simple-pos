"use client";

import { useEffect, useState } from "react";
import { Category } from "@/lib/types";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";

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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit Category" : "New Category"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Category Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Coffee"
                />

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
        </Modal>
    );
}
