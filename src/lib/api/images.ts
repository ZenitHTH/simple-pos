import { invoke } from "./invoke";
import { Image, ProductImage } from "../types";

export const imageApi = {
  save: async (
    key: string,
    data: number[],
    filename: string,
  ): Promise<Image> => {
    return await invoke("save_image", { key, data, filename });
  },

  linkToProduct: async (
    key: string,
    product_id: number,
    image_id: number,
  ): Promise<ProductImage> => {
    return await invoke("link_product_image", {
      key,
      product_id,
      image_id,
    });
  },

  unlink: async (
    key: string,
    product_id: number,
    image_id: number,
  ): Promise<number> => {
    return await invoke("unlink_product_image", {
      key,
      product_id,
      image_id,
    });
  },

  getByProduct: async (key: string, product_id: number): Promise<Image[]> => {
    return await invoke("get_product_images", { key, product_id });
  },

  getAllImages: async (key: string): Promise<Image[]> => {
    return await invoke("get_all_images", { key });
  },

  deleteImage: async (key: string, image_id: number): Promise<void> => {
    await invoke("delete_image", { key, image_id });
  },

  getAllImageLinks: async (key: string): Promise<ProductImage[]> => {
    return await invoke("get_all_image_links", { key });
  },
  updatePosition: async (
    key: string,
    image_id: number,
    position: string,
  ): Promise<number> => {
    return await invoke("update_image_position", { key, image_id, position });
  },
};
