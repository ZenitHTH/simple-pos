import { invoke } from "./invoke";

/**
 * Gets the rendering engine of the current platform.
 * Returns 'webview2' for Windows, 'webkitgtk' for Linux, and 'webkit' for macOS.
 *
 * @returns {Promise<string>} The rendering engine name.
 */
export const getRenderingEngine = async (): Promise<string> => {
  try {
    return await invoke("get_rendering_engine");
  } catch (error) {
    console.error("Failed to get rendering engine:", error);
    return "unknown";
  }
};
