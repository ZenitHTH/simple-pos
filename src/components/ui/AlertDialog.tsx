"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

/**
 * Props for the AlertDialog component.
 */
interface AlertDialogProps {
  /** Whether the alert dialog is currently open. */
  isOpen: boolean;
  /** Callback triggered when the dialog is closed (e.g., clicking OK, backdrop, or close button). */
  onClose: () => void;
  /** The title of the alert dialog. */
  title: string;
  /** The message body to display in the alert. */
  message: string;
}

/**
 * A custom alert dialog component that replaces the native browser alert().
 * It uses the Modal component for consistent styling and provides an "OK" button.
 *
 * @param props - The component props.
 */
export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
}: AlertDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-[400px]"
    >
      <div role="alertdialog" aria-modal="true" className="flex flex-col gap-6">
        <div className="text-foreground/80 text-base leading-relaxed">
          {message}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} className="min-w-[100px]" variant="default">
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}
