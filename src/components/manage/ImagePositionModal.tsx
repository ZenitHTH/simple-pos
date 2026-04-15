"use client";

import { useState, useEffect, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Image } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import NumberSlider from "@/components/ui/NumberSlider";
import { convertFileSrc } from "@/lib/api/invoke";
import { logger } from "@/lib/utils/logger";
import { useAlert } from "@/context/AlertContext";

interface ImagePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image | null;
  onUpdate: (position: string) => Promise<void>;
}

/**
 * ImagePositionModal component provides a specialized interface for adjusting how an image is displayed.
 * It uses a cropping tool to determine the object-position and zoom level for the image.
 * 
 * @param {ImagePositionModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {Image | null} props.image - The image object to adjust.
 * @param {(position: string) => Promise<void>} props.onUpdate - Callback to save the new position string.
 */
export default function ImagePositionModal({
  isOpen,
  onClose,
  image,
  onUpdate,
}: ImagePositionModalProps) {
  const { showAlert } = useAlert();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPercentages, setCroppedAreaPercentages] =
    useState<Area | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaSize, setMediaSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Initialize from existing packed string - Step 1: Just the Zoom
  useEffect(() => {
    if (isOpen && image) {
      if (image.image_object_position) {
        const parts = image.image_object_position.split("|");
        const initialScale = parts.length > 1 ? parseFloat(parts[1]) || 1 : 1;
        setZoom(initialScale);
      } else {
        setZoom(1);
      }
      setCrop({ x: 0, y: 0 });
      setIsDirty(false);
      setMediaSize(null);
    }
  }, [image, isOpen]);

  // Step 2: Set initial pixel crop once media is loaded
  const onMediaLoaded = useCallback(
    (mSize: { width: number; height: number }) => {
      setMediaSize(mSize);
      if (image?.image_object_position && !isDirty) {
        const parts = image.image_object_position.split("|");
        const posParts = parts[0].split(" ");
        const pX = parseFloat(posParts[0]) || 50;
        const pY = parseFloat(posParts[1]) || 50;

        const currentZoom = parts.length > 1 ? parseFloat(parts[1]) || 1 : 1;

        // Calculate pixel offset from center
        // crop.x in pixels = (50 - pX) * (image_width_at_zoom_1 - container_width) / 100 ??
        // Actually, react-easy-crop internal math:
        const widthPercent = 100 / currentZoom;
        const cropXPercentage = ((50 - pX) * (100 - widthPercent)) / 100;
        const cropYPercentage = ((50 - pY) * (100 - widthPercent)) / 100;

        // Convert image-percentage-offset to pixels
        setCrop({
          x: (cropXPercentage * mSize.width) / 100,
          y: (cropYPercentage * mSize.height) / 100,
        });
        // Important: don't set isDirty to true here, this is initialization
      }
    },
    [image],
  );

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
    setIsDirty(true);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    setIsDirty(true);
  };

  const onCropComplete = useCallback((croppedArea: Area) => {
    setCroppedAreaPercentages(croppedArea);
  }, []);

  const onCropAreaChange = useCallback((croppedArea: Area) => {
    setCroppedAreaPercentages(croppedArea);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the latest area from either state or calculate it partially
      // But react-easy-crop always fires onCropComplete, so we should have it.
      const area = croppedAreaPercentages || {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      logger.info("Current Cropper Area:", area);
      logger.info("Current Zoom Level:", zoom);

      let pX = 50;
      let pY = 50;

      // The math for object-position derived from cropper percentages:
      // x: top-left X of crop area relative to image (0-100)
      // width: width of crop area relative to image (0-100)
      if (area.width < 99.9) {
        // pX = (x / (100 - width)) * 100
        pX = (area.x / (100 - area.width)) * 100;
      }

      if (area.height < 99.9) {
        // pY = (y / (100 - height)) * 100
        pY = (area.y / (100 - area.height)) * 100;
      }

      // Final clamping and rounding
      pX = Math.round(Math.max(0, Math.min(100, pX)));
      pY = Math.round(Math.max(0, Math.min(100, pY)));

      const packedPosition = `${pX}% ${pY}%|${zoom.toFixed(2)}`;
      logger.info("Final Packed Position for Save:", packedPosition);

      await onUpdate(packedPosition);
      onClose();
    } catch (err) {
      logger.error("Critical: Failed to save position:", err);
      await showAlert("Image Error", "Error saving: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Image Details">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-6">
          <div className="text-muted-foreground text-center text-sm">
            Use the grid to position your image. Use sliders for detail control.
          </div>

          <div className="flex w-full justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-xl border bg-black shadow-2xl [&_img]:max-w-none">
              <Cropper
                image={convertFileSrc(image.file_path)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropAreaChange={onCropAreaChange}
                onCropComplete={onCropComplete}
                onMediaLoaded={onMediaLoaded}
                showGrid={true}
                objectFit="cover"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 px-1">
            <NumberSlider
              label="Zoom Level"
              value={zoom}
              onChange={onZoomChange}
              min={1}
              max={3}
              step={0.1}
              unit="x"
            />

            <NumberSlider
              label="X Precision (Horizontal)"
              value={Math.round(crop.x)}
              onChange={(val) => onCropChange({ ...crop, x: val })}
              min={mediaSize ? -mediaSize.width : -300}
              max={mediaSize ? mediaSize.width : 300}
              step={1}
              unit="px"
            />

            <NumberSlider
              label="Y Precision (Vertical)"
              value={Math.round(crop.y)}
              onChange={(val) => onCropChange({ ...crop, y: val })}
              min={mediaSize ? -mediaSize.width : -300}
              max={mediaSize ? mediaSize.width : 300}
              step={1}
              unit="px"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? "Saving..." : "Save Position"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
