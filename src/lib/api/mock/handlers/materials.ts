import { state } from "@/lib/api/mock/state";
import { Material } from "@/lib/types";

export const materialHandlers = {
  get_materials: () => state.materials,
  create_material: ({
    name,
    type,
    volume,
    quantity,
  }: {
    name: string;
    type: string;
    volume: number;
    quantity: number;
  }) => {
    const newMaterial: Material = {
      id: Math.max(0, ...state.materials.map((m) => m.id)) + 1,
      name,
      type_: type,
      volume,
      precision: 4,
      quantity,
    };
    state.materials.push(newMaterial);
    return newMaterial;
  },
  update_material: ({
    id,
    name,
    type,
    volume,
    quantity,
  }: {
    id: number;
    name: string;
    type: string;
    volume: number;
    quantity: number;
  }) => {
    const material = state.materials.find((m) => m.id === id);
    if (material) {
      material.name = name;
      material.type_ = type;
      material.volume = volume;
      material.quantity = quantity;
    }
    return material;
  },
  delete_material: ({ id }: { id: number }) => {
    const count = state.materials.length;
    state.materials = state.materials.filter((m) => m.id !== id);
    state.recipeItems = state.recipeItems.filter((ri) => ri.material_id !== id);
    return count - state.materials.length;
  },
};
