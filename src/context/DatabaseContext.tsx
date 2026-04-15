"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { invoke } from "@/lib/api/invoke";
import { logger } from "@/lib/utils/logger";

interface DatabaseContextType {
  dbKey: string | null;
  isLoggedIn: boolean;
  login: (key: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  dbExists: boolean | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [dbKey, setDbKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbExists, setDbExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDb = async () => {
      try {
        const exists: boolean = await invoke("check_database_exists");
        setDbExists(exists);
      } catch (err) {
        logger.error("Failed to check database:", err);
        // If check fails, we don't know if it exists.
        // Better to keep it null or set a specific state to show error UI.
        // For now, setting it to null or handling it in the guard is safer.
        setDbExists(null);
      }
    };
    checkDb();
  }, []);

  const login = async (key: string) => {
    setIsLoading(true);
    try {
      await invoke("initialize_database", { key });
      setDbKey(key);
      setDbExists(true); // Ensure we mark it as existing after successful init
    } catch (error: any) {
      const errorMsg = String(error).toLowerCase();
      const isAuthError = errorMsg.includes("no such table") || 
                          errorMsg.includes("file is not a database") ||
                          errorMsg.includes("invalid encryption key");

      if (isAuthError) {
        logger.warn("Database login failed: Invalid key or unauthorized access.");
      } else {
        logger.error("Failed to initialize DB. Please check your credentials and try again.", error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setDbKey(null);
  };

  return (
    <DatabaseContext
      value={{ dbKey, isLoggedIn: !!dbKey, login, logout, isLoading, dbExists }}
    >
      {children}
    </DatabaseContext>
  );
}

export function useDatabase() {
  const context = React.use(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
