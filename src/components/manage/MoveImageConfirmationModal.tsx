"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FaExclamationTriangle } from "react-icons/fa";

interface MoveImageConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentProductName: string | undefined;
}

export default function MoveImageConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  currentProductName,
}: MoveImageConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move Image Confirmation"
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-amber-500">
          <FaExclamationTriangle size={24} />
          <h3 className="text-lg font-semibold">Exclusivity Rule</h3>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            This image is already linked to{" "}
            <strong className="text-foreground">"{currentProductName}"</strong>.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed italic">
            The exclusivity rule ensures that an image is linked to only one
            product at a time.
          </p>
          <p className="text-foreground font-medium">
            Do you want to move this image and link it to the new product?
          </p>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-5"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="rounded-xl px-5 shadow-md transition-all hover:scale-[1.02]"
          >
            Confirm & Move
          </Button>
        </div>
      </div>
    </Modal>
  );
}
