"use client";

import { useEffect, useState } from "react";
import { Category } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

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

        <div className="border-border mt-8 flex gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border-border hover:bg-muted/10 flex-1 rounded-xl border px-4 py-2.5 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary flex-1 rounded-xl px-4 py-2.5 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
