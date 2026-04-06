import { useEffect } from "react";
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
}

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormData) => Promise<void>;
  initialData?: Material;
  isSubmitting?: boolean;
}

export default function MaterialModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: MaterialModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<MaterialFormData>();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          type_: initialData.type_,
          volume: scaledToFloat(initialData.volume, initialData.precision),
          quantity: initialData.quantity,
        });
      } else {
        reset({
          name: "",
          type_: "Pieces",
          volume: 1,
          quantity: 0,
        });
      }
    }
  }, [isOpen, initialData, reset]);

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
