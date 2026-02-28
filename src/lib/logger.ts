import { info, error, warn, debug } from "@tauri-apps/plugin-log";

// We check if the environment has Tauri available
// Using typeof window ensures we don't crash in SSR (Next.js server)
const isTauri = () => {
    // @ts-ignore
    return typeof window !== "undefined" && window.__TAURI__ !== undefined;
}

export const logger = {
    info: async (message: string, ...args: any[]) => {
        if (isTauri()) {
            await info(message, ...args);
        } else {
            console.info("[INFO]", message, ...args);
        }
    },
    error: async (message: string, ...args: any[]) => {
        if (isTauri()) {
            await error(message, ...args);
        } else {
            console.error("[ERROR]", message, ...args);
        }
    },
    warn: async (message: string, ...args: any[]) => {
        if (isTauri()) {
            await warn(message, ...args);
        } else {
            console.warn("[WARN]", message, ...args);
        }
    },
    debug: async (message: string, ...args: any[]) => {
        if (isTauri()) {
            await debug(message, ...args);
        } else {
            console.debug("[DEBUG]", message, ...args);
        }
    },
};
