import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Material, scaledToFloat, UNIT_OPTIONS } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Controller } from "react-hook-form";

interface MaterialFormData {
  name: string;
  type_: string;
  volume: number;
  quantity: number;
  tags: string[];
}

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormData) => Promise<void>;
  initialData?: Material;
  isSubmitting?: boolean;
}

/**
 * MaterialModal component provides a form for creating or editing raw materials/inventory items.
 * It handles fields for name, volume, quantity, unit type, and tags.
 * 
 * @param {MaterialModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {(data: MaterialFormData) => Promise<void>} props.onSubmit - Callback to submit the material form data.
 * @param {Material} [props.initialData] - Optional initial material data for editing.
 * @param {boolean} [props.isSubmitting] - Whether the form is currently being submitted.
 */
export default function MaterialModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: MaterialModalProps) {
  const [tagInput, setTagInput] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialFormData>({
    defaultValues: {
      tags: [],
    },
  });

  const tags = watch("tags") || [];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          type_: initialData.type_,
          volume: scaledToFloat(initialData.volume, initialData.precision),
          quantity: initialData.quantity,
          tags: initialData.tags || [],
        });
      } else {
        reset({
          name: "",
          type_: "Pieces",
          volume: 1,
          quantity: 0,
          tags: [],
        });
      }
      setTagInput("");
    }
  }, [isOpen, initialData, reset]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue("tags", [...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Material" : "Add Material"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Material Name"
          error={errors.name?.message}
          {...register("name", {
            required: "Material name is required",
            minLength: { value: 1, message: "Name must not be empty" },
            maxLength: { value: 100, message: "Name is too long" },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Volume"
            type="number"
            min="0.0001"
            step="0.0001"
            error={errors.volume?.message}
            {...register("volume", {
              required: "Volume is required",
              min: { value: 0.0001, message: "Volume must be at least 0.0001" },
            })}
          />
          <Input
            label="Quantity"
            type="number"
            min="0"
            error={errors.quantity?.message}
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 0, message: "Quantity cannot be negative" },
            })}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="type_"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                label="Type / Unit"
                value={field.value}
                onChange={field.onChange}
                options={UNIT_OPTIONS}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl px-4 py-2 font-medium transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="border-border mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:bg-muted rounded-xl px-4 py-2 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-6 py-2 font-medium shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
            ) : null}
            {isSubmitting ? "Saving..." : "Save Material"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
