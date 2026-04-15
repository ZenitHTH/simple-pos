import { invoke } from "@/lib/api/invoke";
import { Image, ProductImage } from "@/lib/types";

/**
 * API wrapper for image-related operations including storage and product linking.
 */
export const imageApi = {
  /** Saves an image file to the application's data directory. */
  save: async (
    key: string,
    data: number[],
    filename: string,
  ): Promise<Image> => {
    return await invoke("save_image", { key, data, filename });
  },

  /** Links an image to a specific product. */
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

  /** Unlinks an image from a specific product. */
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

  /** Removes all image links for a specific product. */
  clearProductImage: async (
    key: string,
    productId: number,
  ): Promise<number> => {
    return await invoke("clear_product_images", {
      key,
      productId,
    });
  },

  /** Retrieves all images associated with a specific product. */
  getByProduct: async (key: string, productId: number): Promise<Image[]> => {
    return await invoke("get_product_images", { key, productId });
  },

  /** Retrieves all uploaded images. */
  getAllImages: async (key: string): Promise<Image[]> => {
    return await invoke("get_all_images", { key });
  },

  /** Deletes an image file and its database record. */
  deleteImage: async (key: string, imageId: number): Promise<void> => {
    await invoke("delete_image", { key, imageId });
  },

  /** Retrieves all product-image linking records. */
  getAllImageLinks: async (key: string): Promise<ProductImage[]> => {
    return await invoke("get_all_image_links", { key });
  },

  /** Updates the display position/zoom settings for an image. */
  updatePosition: async (
    key: string,
    imageId: number,
    position: string,
  ): Promise<number> => {
    return await invoke("update_image_position", { key, imageId, position });
  },
};
