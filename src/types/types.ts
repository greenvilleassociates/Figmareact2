// types.ts

// 1. Union of supported image extensions
export type SupportedImageExtension =
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "webp"
  | "bmp"
  | "svg";

// 2. Union of supported MIME types
export type SupportedImageMime =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/bmp"
  | "image/svg+xml";

// 3. Array of extensions (useful for UI or validation)
export const SUPPORTED_IMAGE_EXTENSIONS: SupportedImageExtension[] = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
];

// 4. Array of MIME types
export const SUPPORTED_IMAGE_MIME_TYPES: SupportedImageMime[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/svg+xml",
];

// 5. Type guard for File objects
export function isSupportedImage(file: File): boolean {
  return SUPPORTED_IMAGE_MIME_TYPES.includes(file.type as SupportedImageMime);
}
