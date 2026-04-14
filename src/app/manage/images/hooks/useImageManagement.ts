import { useState, useEffect, useCallback } from "react";
import { invoke } from "@/lib/api/invoke";
import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { Image, ProductImage, BackendProduct, productApi } from "@/lib";
import { logger } from "@/lib/logger";

export function useImageManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const [images, setImages] = useState<Image[]>([]);
  const [links, setLinks] = useState<ProductImage[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Linking Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const fetchData = useCallback(async () => {
    if (!dbKey) return;
    if (images.length === 0) setLoading(true);
    try {
      // Parallel fetch
      const [imgs, lnks, prods] = await Promise.all([
        invoke<Image[]>("get_all_images", { key: dbKey }),
        invoke<ProductImage[]>("get_all_image_links", { key: dbKey }),
        productApi.getAll(dbKey),
      ]);
      setImages(imgs);
      setLinks(lnks);
      setProducts(prods);
    } catch (err) {
      logger.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  }, [dbKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (image: Image) => {
    if (!dbKey) return;
    // Check if used
    const usage = links.filter((l) => l.image_id === image.id);
    if (usage.length > 0) {
      if (
        !confirm(
          `This image is used by ${usage.length} products. Deleting it will unlink it from them. Continue?`,
        )
      ) {
        return;
      }
    } else {
      if (!confirm("Delete this image?")) return;
    }

    try {
      await invoke("delete_image", { key: dbKey, imageId: image.id });
      // Update state locally
      setImages((prev) => prev.filter((i) => i.id !== image.id));
      setLinks((prev) => prev.filter((l) => l.image_id !== image.id));
    } catch (err) {
      logger.error("Failed to delete image", err);
      await showAlert("Image Error", "Failed to delete image");
    }
  };

  const handleUpload = async () => {
    document.getElementById("image-upload-input")?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !dbKey) return;

    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const data = Array.from(bytes);

    try {
      await invoke("save_image", {
        key: dbKey,
        data: data,
        filename: file.name,
      });
      fetchData(); // Refresh all to get new ID and sort
    } catch (err) {
      logger.error("Upload failed", err);
      await showAlert("Image Error", "Upload failed: " + err);
    }
  };

  const openLinkModal = (img: Image) => {
    setSelectedImage(img);
    setProductSearch("");
    setIsLinkModalOpen(true);
  };

  const openPositionModal = (img: Image) => {
    setSelectedImage(img);
    setIsPositionModalOpen(true);
  };

  const handleUpdatePosition = async (position: string) => {
    if (!dbKey || !selectedImage) {
      logger.error("Cannot update position: dbKey or selectedImage missing");
      return;
    }

    try {
      logger.info(
        `Invoking update_image_position for image ${selectedImage.id} with pos: ${position}`,
      );

      await invoke("update_image_position", {
        key: dbKey,
        imageId: selectedImage.id,
        position,
      });

      // 1. Update images state locally
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedImage.id
            ? { ...img, image_object_position: position }
            : img,
        ),
      );

      // 2. Update selectedImage to keep modal data fresh if it stays open (though we close it)
      setSelectedImage((prev) =>
        prev ? { ...prev, image_object_position: position } : null,
      );

      // 3. Update local products state too
      setProducts((prev) =>
        prev.map((p) => {
          const isLinked = links.some(
            (l) =>
              l.image_id === selectedImage.id && l.product_id === p.product_id,
          );
          return isLinked ? { ...p, image_object_position: position } : p;
        }),
      );

      // 4. Force a data refresh from DB to be 100% sure
      await fetchData();

      setIsPositionModalOpen(false);
    } catch (err) {
      logger.error("Failed to update position:", err);
      await showAlert("Image Error", "Failed to update position. Check console for details.");
    }
  };

  const toggleLink = async (productId: number, isLinked: boolean) => {
    if (!dbKey || !selectedImage) return;

    try {
      if (isLinked) {
        await invoke("unlink_product_image", {
          key: dbKey,
          productId: productId,
          imageId: selectedImage.id,
        });
        setLinks((prev) =>
          prev.filter(
            (l) =>
              !(l.product_id === productId && l.image_id === selectedImage.id),
          ),
        );
      } else {
        // Enforce product exclusivity: Clear any other images currently linked to this product
        await invoke("clear_product_images", {
          key: dbKey,
          productId: productId,
        });

        await invoke("link_product_image", {
          key: dbKey,
          productId: productId,
          imageId: selectedImage.id,
        });

        // Update local state: remove all old links for this product, add the new one
        setLinks((prev) => [
          ...prev.filter((l) => l.product_id !== productId),
          { product_id: productId, image_id: selectedImage.id },
        ]);

        // Auto-close modal after selection as per "click only one" requirement
        setIsLinkModalOpen(false);
      }
    } catch (err) {
      logger.error("Failed to toggle link", err);
    }
  };

  const getProductUsage = (imageId: number) => {
    const productIds = links
      .filter((l) => l.image_id === imageId)
      .map((l) => l.product_id);
    return products.filter((p) => productIds.includes(p.product_id));
  };

  const filteredProductsToLink = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return {
    images,
    links,
    products,
    loading,
    isLinkModalOpen,
    setIsLinkModalOpen,
    isPositionModalOpen,
    setIsPositionModalOpen,
    selectedImage,
    productSearch,
    setProductSearch,
    handleDelete,
    handleUpload,
    onFileChange,
    openLinkModal,
    openPositionModal,
    handleUpdatePosition,
    toggleLink,
    getProductUsage,
    filteredProductsToLink,
  };
}
