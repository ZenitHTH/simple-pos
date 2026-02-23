"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { invoke } from "@/lib/api/invoke";

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
        console.error("Failed to check database:", err);
        // Assume it exists to fail safely into login screen or show error
        setDbExists(true);
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
    } catch (error) {
      console.error("Failed to initialize DB:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setDbKey(null);
  };

  return (
    <DatabaseContext.Provider
      value={{ dbKey, isLoggedIn: !!dbKey, login, logout, isLoading, dbExists }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
