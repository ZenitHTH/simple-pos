"use client";

import { useState, useEffect } from "react";
import { Image } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { convertFileSrc } from "@/lib/api/invoke";

interface ImagePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image | null;
  onUpdate: (position: string) => Promise<void>;
}

export default function ImagePositionModal({
  isOpen,
  onClose,
  image,
  onUpdate,
}: ImagePositionModalProps) {
  const [position, setPosition] = useState("center");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (image) {
      setPosition(image.image_object_position || "center");
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(position);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Image Position">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted relative h-48 w-48 overflow-hidden rounded-lg border shadow-inner">
            <img
              src={convertFileSrc(image.file_path)}
              alt={image.file_name}
              className="h-full w-full object-cover"
              style={{ objectPosition: position }}
            />
            {/* Crosshair Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-px w-full bg-white/30" />
              <div className="absolute h-full w-px bg-white/30" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Quick Presets</label>
              <div className="flex gap-1">
                {["top", "center", "bottom"].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPosition(pos)}
                    className={`rounded border px-3 py-1 text-xs transition-colors ${
                      position === pos
                        ? "bg-primary border-primary text-white"
                        : "bg-muted/10 hover:bg-muted/20 border-border"
                    }`}
                  >
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Custom CSS Position"
              placeholder="e.g. 50% 20% or center bottom"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-foreground px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Position"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
