"use client";

import { convertFileSrc } from "@/lib/api/invoke";
import { useState, useEffect } from "react";
import {
  BackendProduct,
  NewProduct,
  Category,
  Image,
  parseImageStyle,
} from "@/lib";
import { categoryApi, imageApi } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { FaImage, FaTrash } from "react-icons/fa";
import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { logger } from "@/lib/utils/logger";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    product: NewProduct,
    afterSubmit?: (saved: BackendProduct) => Promise<void>,
  ) => Promise<BackendProduct | undefined>;
  initialData?: BackendProduct;
  isSubmitting: boolean;
}

/**
 * ProductModal component provides a comprehensive form for creating or editing products.
 * It includes fields for title, category, price, stock tracking mode, and image upload/selection.
 * 
 * @param {ProductModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {(product: NewProduct, afterSubmit?: (saved: BackendProduct) => Promise<void>) => Promise<BackendProduct | undefined>} props.onSubmit - Callback to submit the product data.
 * @param {BackendProduct} [props.initialData] - Optional initial product data for editing.
 * @param {boolean} props.isSubmitting - Whether a submission is currently in progress.
 */
export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ProductModalProps) {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<NewProduct>({
    title: initialData?.title || "",
    category_id: initialData?.category_id || 0,
    satang: initialData?.satang || 0,
    use_recipe_stock: initialData?.use_recipe_stock || false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen && dbKey) {
      categoryApi.getAll(dbKey).then(setCategories).catch(logger.error);
    }
  }, [isOpen, dbKey]);

  // Reset form when opening for create, or set for edit
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        category_id: initialData?.category_id || 0,
        satang: initialData?.satang || 0,
        use_recipe_stock: initialData?.use_recipe_stock || false,
      });
      setSelectedImage(null);
      if (initialData && dbKey) {
        // Fetch existing images
        imageApi
          .getByProduct(dbKey, initialData.product_id)
          .then((imgs) => {
            if (imgs && imgs.length > 0) {
              setSelectedImage(imgs[0]);
            }
          })
          .catch(logger.error);
      }
    }
  }, [isOpen, initialData, dbKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit(formData, async (savedProduct) => {
      if (dbKey) {
        // Clear old links first
        await imageApi.clearProductImage(dbKey, savedProduct.product_id);

        if (selectedImage) {
          // Link the selected one
          await imageApi
            .linkToProduct(dbKey, savedProduct.product_id, selectedImage.id)
            .catch((err) => {
              logger.warn("Failed to link image:", err);
            });
        }
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && dbKey) {
      setIsUploading(true);
      const file = e.target.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      try {
        const savedImage = await imageApi.save(dbKey, bytes, file.name);
        setSelectedImage(savedImage);
      } catch (err) {
        logger.error("Failed to upload image:", err);
        await showAlert("Upload Error", "Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Helper to get image URL for display
  // Since `Image` has `file_path`, but webview can't read arbitrary files directly usually?
  // Tauri 2: Protocol `asset://` or `convertFileSrc`?
  // In Tauri v2, `convertFileSrc` is `convertFileSrc` from `@tauri-apps/api/core`.
  // It creates a URL like `asset://local/path/to/file`.
  // We need to import it.

  const getPrice = (satang: number) => (satang / 100).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Product" : "New Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="product-title"
          label="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
        />

        <Select
          label="Category"
          value={formData.category_id ? String(formData.category_id) : ""}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, category_id: parseInt(String(val), 10) }))
          }
          options={categories.map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          }))}
          placeholder="Select Category"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="product-price"
            label="Price (Satang)"
            type="number"
            required
            min="0"
            value={formData.satang}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                satang: parseInt(e.target.value) || 0,
              }))
            }
          />
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Display Price
            </label>
            <div className="border-border bg-muted/5 text-foreground flex h-11 items-center rounded-xl border px-3 py-2 text-sm font-semibold">
              ฿{getPrice(formData.satang)}
            </div>
          </div>
        </div>

        <div className="border-border bg-card/50 flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold">Recipe Stock Mode</label>
            <p className="text-muted-foreground text-xs">
              Track stock based on recipe ingredients instead of unit quantity.
            </p>
          </div>
          <Switch
            checked={formData.use_recipe_stock}
            onClick={() =>
              setFormData({
                ...formData,
                use_recipe_stock: !formData.use_recipe_stock,
              })
            }
          />
        </div>

        <Separator />

        {/* Image Section */}
        <div className="space-y-4">
          <label className="mb-1.5 block text-sm font-semibold">Product Image</label>
          <div className="flex flex-wrap gap-2">
            {selectedImage && (
              <div
                key={selectedImage.id}
                className="group relative h-16 w-16 overflow-hidden rounded border"
              >
                <img
                  src={convertFileSrc(selectedImage.file_path)}
                  alt={selectedImage.file_name}
                  className="h-full w-full object-cover"
                  style={parseImageStyle(selectedImage.image_object_position)}
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="bg-destructive text-destructive-foreground absolute top-0 right-0 rounded-bl p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            )}
            {!selectedImage && (
              <label className="border-border hover:bg-muted/10 flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded border border-dashed transition-colors">
                <FaImage className="text-muted-foreground mb-1" />
                <span className="text-muted-foreground text-xs">Add</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
