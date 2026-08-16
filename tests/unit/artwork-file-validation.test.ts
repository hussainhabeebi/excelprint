import { describe, expect, it } from "vitest";
import { MAX_ARTWORK_FILE_SIZE_BYTES, validateArtworkFile } from "@/lib/r2/validate";

describe("validateArtworkFile", () => {
  it("accepts a valid PDF", () => {
    const result = validateArtworkFile("design.pdf", "application/pdf", 1024);
    expect(result.valid).toBe(true);
    expect(result.extension).toBe("pdf");
  });

  it("accepts common design formats", () => {
    for (const [name, mime] of [
      ["logo.png", "image/png"],
      ["photo.jpg", "image/jpeg"],
      ["icon.svg", "image/svg+xml"],
    ] as const) {
      expect(validateArtworkFile(name, mime, 1024).valid).toBe(true);
    }
  });

  it("is lenient on inconsistent MIME reporting for design-tool formats", () => {
    expect(validateArtworkFile("file.ai", "application/octet-stream", 1024).valid).toBe(true);
    expect(validateArtworkFile("file.eps", "application/postscript", 1024).valid).toBe(true);
    expect(validateArtworkFile("file.psd", "", 1024).valid).toBe(true); // no mime reported at all
  });

  it("rejects a disallowed extension", () => {
    const result = validateArtworkFile("script.exe", "application/octet-stream", 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/unsupported/i);
  });

  it("rejects a spoofed extension whose mime type doesn't match", () => {
    // .pdf claiming to be a PNG — extension/mime mismatch on a well-defined type
    const result = validateArtworkFile("fake.pdf", "image/png", 1024);
    expect(result.valid).toBe(false);
  });

  it("rejects an empty file", () => {
    expect(validateArtworkFile("design.pdf", "application/pdf", 0).valid).toBe(false);
  });

  it("rejects a file over the size limit", () => {
    const result = validateArtworkFile("huge.pdf", "application/pdf", MAX_ARTWORK_FILE_SIZE_BYTES + 1);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/too large/i);
  });

  it("accepts a file exactly at the size limit", () => {
    expect(validateArtworkFile("design.pdf", "application/pdf", MAX_ARTWORK_FILE_SIZE_BYTES).valid).toBe(true);
  });
});
