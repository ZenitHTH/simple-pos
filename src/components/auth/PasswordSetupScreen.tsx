import React, { useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import {
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { cn } from "@/lib";
import { Input } from "@/components/ui/Input";

interface PasswordSetupScreenProps {
  onSuccess?: () => void;
}

export default function PasswordSetupScreen({
  onSuccess,
}: PasswordSetupScreenProps) {
  const { login, isLoading } = useDatabase();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await login(password);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : String(err) || "Failed to setup database",
      );
    }
  };

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-card text-card-foreground border-border w-full max-w-md rounded-2xl border p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <FaShieldAlt className="text-primary text-2xl" />
          </div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">
            Create a secure password for your database to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Create Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  // Only allow English letters, numbers, standard special characters, and control keys
                  if (
                    e.key.length === 1 && 
                    !/^[\x20-\x7E]+$/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="English/Numbers/Special chars only"
                autoFocus
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute right-0 top-[34px] flex h-11 items-center pr-3 z-10"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key.length === 1 && 
                    !/^[\x20-\x7E]+$/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Repeat your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground absolute right-0 top-[34px] flex h-11 items-center pr-3 z-10"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 flex items-center rounded-lg p-3 text-sm font-medium">
              <FaExclamationTriangle className="mr-2 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {(/[^\x00-\x7F]/.test(password) ||
            /[^\x00-\x7F]/.test(confirmPassword)) && (
            <div className="mb-4 flex items-center rounded-lg border border-warning/20 bg-warning/10 p-3 text-sm font-medium text-warning">
              <FaExclamationTriangle className="mr-2 h-4 w-4 shrink-0" />
              Warning: detailed characters detected. Please check your keyboard
              language (English recommended).
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "text-primary-foreground shadow-primary/30 flex w-full transform items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
              "bg-primary hover:bg-primary/90",
            )}
          >
            Next <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}
