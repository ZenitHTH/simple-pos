"use client";

import { useState, useCallback } from "react";

/**
 * Hook to extract dominant colors from an HTMLImageElement using the Canvas API.
 * 
 * @returns {object} An object containing:
 * - colors: Array of hex color strings (top 3 most frequent).
 * - sampleImage: Function to trigger color extraction from an image element.
 * - isSampling: Boolean indicating if an extraction is currently in progress.
 */
export function useColorSampler() {
  const [colors, setColors] = useState<string[]>([]);
  const [isSampling, setIsSampling] = useState(false);

  const sampleImage = useCallback((imgElement: HTMLImageElement) => {
    if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) return;
    
    setIsSampling(true);
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Use a small representative size for extraction performance
      const size = 50;
      canvas.width = size;
      canvas.height = size;
      
      // Draw the image to the canvas
      ctx.drawImage(imgElement, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colorCounts: Record<string, number> = {};

      // Sample pixels
      const step = Math.max(1, Math.floor(imageData.length / 4000)) * 4; // Sample ~1000 pixels regardless of image size
      for (let i = 0; i < imageData.length; i += step) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Skip transparent or near-white/near-black if desired, 
        // but here we just collect them all.
        if (a < 128) continue; 

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      // Sort by frequency and pick top 3
      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([color]) => color);

      setColors(sortedColors);
    } catch (error) {
      console.error("Color sampling failed:", error);
    } finally {
      setIsSampling(false);
    }
  }, []);

  return { colors, sampleImage, isSampling };
}
