import { invoke as tauriInvoke, convertFileSrc as tauriConvertFileSrc } from "@tauri-apps/api/core";
import { mockInvoke } from "./mock";
import { logger, sanitize } from "@/lib/utils/logger";

/**
 * Redacts sensitive fields from arguments for secure logging.
 */
function sanitizeArgs(args?: Record<string, any>): Record<string, any> | undefined {
  return args ? sanitize(args) : args;
}

/**
 * Generic wrapper for calling backend functions.
 * It detects if the application is running within Tauri and falls back to a mock implementation if not.
 * 
 * @template T - The expected return type of the command.
 * @param {string} command - The name of the Tauri command to invoke.
 * @param {Record<string, any>} [args] - Optional arguments to pass to the command.
 * @returns {Promise<T>} A promise resolving to the command's return value.
 */
export async function invoke<T>(command: string, args?: Record<string, any>): Promise<T> {
  // Check if we are running in a Tauri environment
  // @ts-ignore
  const isTauri = typeof window !== "undefined" && window.__TAURI_INTERNALS__;

  if (isTauri) {
    try {
      logger.debug(`[Tauri API] Invoking command: ${command}`, sanitizeArgs(args));
      return await tauriInvoke<T>(command, args);
    } catch (error) {
      // Check if the error is related to database access or decryption (common with wrong keys)
      const errorMsg = String(error).toLowerCase();
      const isAuthError = errorMsg.includes("no such table") || 
                          errorMsg.includes("file is not a database") ||
                          errorMsg.includes("invalid encryption key");

      if (isAuthError) {
        logger.warn(`Database access error [${command}] (possible auth issue):`, error);
      } else {
        logger.error(`Tauri invoke error [${command}]:`, error);
      }
      throw error;
    }
  }

  // Fallback to mock implementation
  logger.debug(`[Mock API] Invoking command: ${command}`, sanitizeArgs(args));
  return await mockInvoke<T>(command, args);
}

/**
 * A wrapper around Tauri's convertFileSrc that returns the source as-is
 * in a non-Tauri environment.
 */
export function convertFileSrc(filePath: string, protocol?: string): string {
    // @ts-ignore
    const isTauri = typeof window !== "undefined" && window.__TAURI_INTERNALS__;

    // Prevent conversion for mock images or data that is part of the public directory
    if (isTauri && !filePath.startsWith("/mock/")) {
        return tauriConvertFileSrc(filePath, protocol);
    }

    // Fallback: return as-is (e.g., for local mock images or public URLs)
    return filePath;
}
