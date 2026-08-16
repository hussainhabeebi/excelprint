export const ALLOWED_ARTWORK_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "svg", "psd", "ai", "eps"] as const;
export type AllowedArtworkExtension = (typeof ALLOWED_ARTWORK_EXTENSIONS)[number];

/**
 * Plausible MIME types per extension. Design-tool MIME reporting is
 * inconsistent across browsers/OSes (a .ai or .eps file is frequently
 * reported as application/octet-stream, application/postscript, or even
 * empty), so this is a soft cross-check against obvious spoofing, not the
 * sole gate — AGENTS.md rule "never trust a client-supplied content-type
 * header alone" means don't rely on it in isolation, not that we ignore
 * it. The hard requirements are extension allow-list + size limit.
 */
const PLAUSIBLE_MIME_TYPES_BY_EXTENSION: Record<AllowedArtworkExtension, string[]> = {
  pdf: ["application/pdf"],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  svg: ["image/svg+xml"],
  psd: ["image/vnd.adobe.photoshop", "application/octet-stream", "application/x-photoshop"],
  ai: ["application/postscript", "application/pdf", "application/illustrator", "application/octet-stream"],
  eps: ["application/postscript", "image/eps", "application/octet-stream"],
};

export const MAX_ARTWORK_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB — print files (PSD/AI) run large.

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  extension?: AllowedArtworkExtension;
}

export function validateArtworkFile(fileName: string, mimeType: string, sizeBytes: number): FileValidationResult {
  if (sizeBytes <= 0) {
    return { valid: false, error: "The file appears to be empty." };
  }
  if (sizeBytes > MAX_ARTWORK_FILE_SIZE_BYTES) {
    return { valid: false, error: `File is too large (max ${MAX_ARTWORK_FILE_SIZE_BYTES / (1024 * 1024)} MB).` };
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_ARTWORK_EXTENSIONS.includes(extension as AllowedArtworkExtension)) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed: ${ALLOWED_ARTWORK_EXTENSIONS.join(", ").toUpperCase()}.`,
    };
  }
  const validExtension = extension as AllowedArtworkExtension;

  if (mimeType) {
    const plausible = PLAUSIBLE_MIME_TYPES_BY_EXTENSION[validExtension];
    if (!plausible.includes(mimeType)) {
      return { valid: false, error: "The file's content type doesn't match its extension." };
    }
  }

  return { valid: true, extension: validExtension };
}
