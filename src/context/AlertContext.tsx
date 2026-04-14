"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { AlertDialog } from "@/components/ui/AlertDialog";

/**
 * Type definition for the Alert Context.
 */
interface AlertContextType {
  /**
   * Shows a custom alert dialog that mimics browser's alert() but with custom UI.
   * @param title - The title of the alert.
   * @param message - The message body to display.
   * @returns A promise that resolves when the user closes the alert.
   */
  showAlert: (title: string, message: string) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * Provider component for the AlertDialog system.
 * Manages the global state of the alert dialog and provides the showAlert function.
 * 
 * @param props - Component props containing children.
 */
export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const resolveRef = useRef<(() => void) | null>(null);

  /**
   * Shows a custom alert dialog that mimics browser's alert() but with custom UI.
   * Returns a promise that resolves when the user closes the alert.
   */
  const showAlert = useCallback((newTitle: string, newMessage: string) => {
    return new Promise<void>((resolve) => {
      setTitle(newTitle);
      setMessage(newMessage);
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  /**
   * Handles closing the alert dialog and resolving the associated promise.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  }, []);

  return (
    <AlertContext value={{ showAlert }}>
      {children}
      <AlertDialog
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        message={message}
      />
    </AlertContext>
  );
}

/**
 * Hook to use the Alert system.
 * Must be used within an AlertProvider.
 * 
 * @returns The AlertContextType containing the showAlert function.
 * @throws Error if used outside of an AlertProvider.
 */
export function useAlert() {
  const context = React.use(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
