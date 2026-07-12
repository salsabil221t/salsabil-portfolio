"use client";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads an uploaded image file and returns a data URL, downscaled to
 * MAX_DIMENSION so it stays small enough to store alongside the rest of
 * the site content. SVGs pass through untouched (canvas would rasterize them).
 */
export async function resizeImageFile(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  if (file.type === "image/svg+xml") return dataUrl;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not read image"));
    el.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);

  const isPng = file.type === "image/png";
  return canvas.toDataURL(isPng ? "image/png" : "image/jpeg", JPEG_QUALITY);
}
