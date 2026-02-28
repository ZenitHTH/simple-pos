import { invoke as tauriInvoke, convertFileSrc as tauriConvertFileSrc } from "@tauri-apps/api/core";
import { mockInvoke } from "./mock";
import { logger } from "../logger";

/**
 * A wrapper around Tauri's invoke that falls back to a mock implementation
 * if the Tauri bridge is not available (e.g., when running in a standard browser).
 */
export async function invoke<T>(command: string, args?: Record<string, any>): Promise<T> {
    // Check if we are running in a Tauri environment
    // @ts-ignore
    const isTauri = typeof window !== "undefined" && window.__TAURI_INTERNALS__;

    if (isTauri) {
        try {
            return await tauriInvoke<T>(command, args);
        } catch (error) {
            logger.error(`Tauri invoke error [${command}]:`, error);
            throw error;
        }
    }

    // Fallback to mock implementation
    logger.debug(`[Mock API] Invoking command: ${command}`, args);
    return await mockInvoke<T>(command, args);
}

/**
 * A wrapper around Tauri's convertFileSrc that returns the source as-is
 * in a non-Tauri environment.
 */
export function convertFileSrc(filePath: string, protocol?: string): string {
    // @ts-ignore
    const isTauri = typeof window !== "undefined" && window.__TAURI_INTERNALS__;

    if (isTauri) {
        return tauriConvertFileSrc(filePath, protocol);
    }

    // Fallback: return as-is (e.g., for local mock images or public URLs)
    return filePath;
}
