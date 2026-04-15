import { handlers } from "./handlers";
import { logger } from "@/lib/utils/logger";

/**
 * Mock implementation of Tauri's invoke.
 * Intercepts commands and routes them to the appropriate handler.
 */
export async function mockInvoke<T>(command: string, args?: Record<string, any>): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const handler = (handlers as any)[command];

    if (handler) {
        try {
            return handler(args) as T;
        } catch (error) {
            logger.error(`[Mock API] Error in handler for command "${command}":`, error);
            throw error;
        }
    }

    logger.warn(`[Mock API] No mock handler implemented for command: ${command}`);
    throw new Error(`[Mock API] Command not found: ${command}`);
}
