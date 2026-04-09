import { state } from "../state";
import { Image } from "../../../types";

export const imageHandlers = {
  save_image: ({ filename }: { filename: string }) => {
    const newImage: Image = {
      id: Math.max(0, ...state.images.map((i) => i.id)) + 1,
      file_name: filename,
      file_hash: Math.random().toString(36).substring(7),
      file_path: `/mock/images/${filename}`,
      created_at: new Date().toISOString(),
    };
    state.images.push(newImage);
    return newImage;
  },
  link_product_image: ({
    productId,
    imageId,
  }: {
    productId: number;
    imageId: number;
  }) => {
    const newLink = { product_id: productId, image_id: imageId };
    state.productImages.push(newLink);
    return newLink;
  },
  unlink_product_image: ({
    productId,
    imageId,
  }: {
    productId: number;
    imageId: number;
  }) => {
    const count = state.productImages.length;
    state.productImages = state.productImages.filter(
      (pi) => !(pi.product_id === productId && pi.image_id === imageId),
    );
    return count - state.productImages.length;
  },
  get_product_images: ({ productId }: { productId: number }) => {
    const imageIds = state.productImages
      .filter((pi) => pi.product_id === productId)
      .map((pi) => pi.image_id);
    return state.images.filter((img) => imageIds.includes(img.id));
  },
  get_all_images: () => state.images,
  delete_image: ({ imageId }: { imageId: number }) => {
    state.images = state.images.filter((img) => img.id !== imageId);
    state.productImages = state.productImages.filter((pi) => pi.image_id !== imageId);
  },
  get_all_image_links: () => state.productImages,
};
