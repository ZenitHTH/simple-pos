"use client";

import React, { useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";

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
      console.error("Login failed:", err);
      setError("Invalid password or database error.");
    }
  };

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-card text-card-foreground border-border w-96 rounded-lg border p-8 shadow-md">
        <h1 className="text-foreground mb-6 text-center text-2xl font-bold">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-muted-foreground mb-1 block text-sm font-medium">
              Database Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-input focus:ring-primary bg-background text-foreground w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className={`text-primary-foreground w-full rounded-md px-4 py-2 font-medium ${
              isLoading
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none"
            }`}
          >
            {isLoading ? "Connecting..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
