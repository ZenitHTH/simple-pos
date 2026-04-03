import React from "react";
import { FaBoxes, FaPlus, FaBoxOpen, FaTrash } from "react-icons/fa";
import { BackendProduct, Material, UNIT_OPTIONS } from "@/lib";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

interface MaterialSourceItemProps {
  material: Material;
  onDragStart: (e: React.DragEvent, material: Material) => void;
  onAdd: (material: Material) => void;
}

export function MaterialSourceItem({
  material,
  onDragStart,
  onAdd,
}: MaterialSourceItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, material)}
      className="bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 group flex cursor-grab items-center justify-between rounded-xl border p-4 transition-all active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2.5 text-base">
          <FaBoxes />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold">{material.name}</span>
          <span className="text-muted-foreground text-xs">
            {material.quantity} {material.type_}
          </span>
        </div>
      </div>
      <button
        onClick={() => onAdd(material)}
        className="bg-primary/5 text-primary hover:bg-primary/20 rounded-xl p-3 transition-colors"
      >
        <FaPlus className="text-sm" />
      </button>
    </div>
  );
}

interface ProductSelectionItemProps {
  product: BackendProduct;
  onSelect: (product: BackendProduct) => void;
}

export function ProductSelectionItem({
  product,
  onSelect,
}: ProductSelectionItemProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all"
    >
      <div className="bg-secondary/10 text-secondary-foreground rounded-lg p-3 text-lg">
        <FaBoxOpen />
      </div>
      <span className="text-base font-semibold">{product.title}</span>
    </button>
  );
}

interface RecipeTargetItemProps {
  item: {
    material_id: number;
    name: string;
    volume_use: number;
    unit: string;
  };
  onUpdate: (id: number, volume: number, unit: string) => void;
  onRemove: (id: number) => void;
}

export function RecipeTargetItem({
  item,
  onUpdate,
  onRemove,
}: RecipeTargetItemProps) {
  return (
    <div className="bg-muted/30 border-border animate-in zoom-in-95 grid grid-cols-[1fr_120px_160px_44px] items-center gap-x-4 rounded-2xl border px-5 py-4 shadow-sm">
      {/* Name */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-secondary/10 text-secondary-foreground shrink-0 rounded-lg p-2 text-sm">
          <FaBoxes />
        </div>
        <p className="truncate text-base font-bold">{item.name}</p>
      </div>

      {/* Volume */}
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          Volume
        </label>
        <Input
          type="number"
          min="0.0000"
          step="0.25"
          value={item.volume_use}
          onChange={(e) =>
            onUpdate(item.material_id, parseFloat(e.target.value), item.unit)
          }
          className="h-10 text-center text-sm font-semibold"
        />
      </div>

      {/* Unit */}
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          Unit
        </label>
        <Select
          value={item.unit}
          onChange={(val) =>
            onUpdate(item.material_id, item.volume_use, String(val))
          }
          options={UNIT_OPTIONS}
        />
      </div>

      {/* Delete */}
      <div className="flex items-end justify-center pb-0.5">
        <button
          onClick={() => onRemove(item.material_id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-xl transition-all"
          aria-label="Remove ingredient"
        >
          <FaTrash size={13} />
        </button>
      </div>
    </div>
  );
}
