import { invoke } from "@/lib/api/invoke";
import { Material } from "@/lib/types";

/**
 * API wrapper for raw material and inventory operations.
 */
export const materialApi = {
  /** Retrieves all materials from the database. */
  getAll: async (key: string): Promise<Material[]> => {
    return await invoke("get_materials", { key });
  },

  /** Creates a new material entry. */
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

  /** Updates an existing material entry. */
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

  /** Deletes a material entry by its ID. */
  delete: async (key: string, id: number): Promise<number> => {
    return await invoke("delete_material", { key, id });
  },
};
