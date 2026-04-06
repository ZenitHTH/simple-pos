"use client";

import { useEffect, useState } from "react";
import { Stock, BackendProduct } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: number, quantity: number) => Promise<void>;
  initialData?: Stock;
  products: BackendProduct[];
  isSubmitting: boolean;
}

export default function StockModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  products,
  isSubmitting,
}: StockModalProps) {
  const [productId, setProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setProductId(initialData.product_id);
        setQuantity(initialData.quantity);
      } else {
        setProductId(products.length > 0 ? products[0].product_id : 0);
        setQuantity(0);
      }
    }
  }, [isOpen, initialData, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId === 0) {
      alert("Please select a product");
      return;
    }
    onSubmit(productId, quantity);
  };

  const productOptions = products.map((p) => ({
    value: p.product_id,
    label: p.title,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Stock" : "Add Stock"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Product"
          value={productId}
          onChange={(value) => setProductId(Number(value))}
          options={productOptions}
          placeholder="Select a product..."
        />

        <Input
          label="Quantity"
          type="number"
          required
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="e.g., 100"
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
            {isSubmitting ? "Saving..." : "Save Stock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
