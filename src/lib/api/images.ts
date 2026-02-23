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
    productId: number,
    imageId: number,
  ): Promise<ProductImage> => {
    return await invoke("link_product_image", {
      key,
      productId,
      imageId,
    });
  },

  unlink: async (
    key: string,
    productId: number,
    imageId: number,
  ): Promise<number> => {
    return await invoke("unlink_product_image", {
      key,
      productId,
      imageId,
    });
  },

  getByProduct: async (key: string, productId: number): Promise<Image[]> => {
    return await invoke("get_product_images", { key, productId });
  },

  getAllImages: async (key: string): Promise<Image[]> => {
    return await invoke("get_all_images", { key });
  },

  deleteImage: async (key: string, imageId: number): Promise<void> => {
    await invoke("delete_image", { key, imageId });
  },

  getAllImageLinks: async (key: string): Promise<ProductImage[]> => {
    return await invoke("get_all_image_links", { key });
  },
};
