import { invoke } from "@/lib/api/invoke";
import { Material } from "@/lib/types";

export const materialApi = {
  getAll: async (key: string): Promise<Material[]> => {
    return await invoke("get_materials", { key });
  },

  create: async (
    key: string,
    name: string,
    type_: string,
    volume: number,
    quantity: number,
    tags: string[],
  ): Promise<Material> => {
    return await invoke("create_material", {
      key,
      name,
      type: type_,
      volume: Number(volume),
      quantity: Number(quantity),
      tags,
    });
  },

  update: async (
    key: string,
    id: number,
    name: string,
    type_: string,
    volume: number,
    quantity: number,
    tags: string[],
  ): Promise<Material> => {
    return await invoke("update_material", {
      key,
      id: Number(id),
      name,
      type: type_,
      volume: Number(volume),
      quantity: Number(quantity),
      tags,
    });
  },

  delete: async (key: string, id: number): Promise<number> => {
    return await invoke("delete_material", { key, id });
  },
};
