"use client";

import React, { useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import { logger } from "@/lib/utils/logger";
import { Input } from "@/components/ui/Input";

export default function LoginScreen() {
  const { login, isLoading } = useDatabase();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(password);
    } catch (err: unknown) {
      logger.error("Login failed:", err);
      setError("Invalid password or database error.");
    }
  };

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-card text-card-foreground border-border w-96 rounded-2xl border p-8 shadow-xl">
        <h1 className="text-foreground mb-6 text-center text-2xl font-bold">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Database Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            error={error || undefined}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`text-primary-foreground h-11 w-full rounded-xl px-4 py-2 font-bold shadow-lg transition-all ${isLoading
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 hover:shadow-primary/20"
              }`}
          >
            {isLoading ? "Connecting..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
