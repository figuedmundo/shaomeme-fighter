import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import * as fs from "node:fs/promises"; // Use direct node:fs/promises import
import sharp from "sharp"; // Will be mocked
import heicConvert from "heic-convert";

import { processImage } from "../server/ImageProcessor";

// Mock sharp instance
const mockSharpInstance = {
  rotate: vi.fn().mockReturnThis(),
  resize: vi.fn().mockReturnThis(),
  webp: vi.fn().mockReturnThis(),
  toBuffer: vi.fn(async () => Buffer.from("mocked-webp-data")),
  toFile: vi.fn(async () => {}),
  metadata: vi.fn(async () => ({ format: "jpeg" })),
};

vi.mock("sharp", () => {
  const sharpMock = vi.fn((input) => {
    // Simulate failure for HEIC buffer if we want to test fallback
    // In the test setup below, HEIC files return "mocked-heic-data" buffer
    if (
      Buffer.isBuffer(input) &&
      input.toString().includes("mocked-heic-data")
    ) {
      // Verify if we are being called with the raw HEIC buffer or the converted JPEG
      // This is tricky. Let's make the FIRST call fail if it's heic data.
      // But sharpMock returns an instance. We can't throw here easily unless we track calls.
      // Instead, let's make .toFile() throw if it's the raw HEIC buffer?
      // Or just let the test logic handle the rejection.
    }
    return mockSharpInstance;
  });
  sharpMock.concurrency = vi.fn();
  return { default: sharpMock };
});

// Mock node:fs/promises
vi.mock("node:fs/promises", () => ({
  access: vi.fn(async (filePath) => {
    if (filePath.includes("cached_image.webp")) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("File not found"));
  }),
  mkdir: vi.fn(async () => {}),
  readdir: vi.fn(async () => []),
  readFile: vi.fn(async (filePath) => {
    if (filePath.includes("heic")) {
      return Buffer.from("mocked-heic-data");
    }
    return Buffer.from("mocked-image-data");
  }),
  writeFile: vi.fn(async () => {}),
}));

// Mock heic-convert
vi.mock("heic-convert", () => ({
  default: vi.fn(async () => Buffer.from("mocked-converted-jpeg-data")),
}));

describe("ImageProcessor", () => {
  const PHOTOS_DIR = "/mock/photos";
  const CACHE_DIR = "/mock/cache";

  const mockedFs = vi.mocked(fs); // Cast to mocked version

  beforeEach(() => {
    vi.clearAllMocks();
    mockedFs.access.mockImplementation(async (targetPath) => {
      if (targetPath.includes("cached_image.webp")) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("File not found"));
    });
    mockedFs.mkdir.mockResolvedValue(undefined);
    mockedFs.readFile.mockImplementation(async (filePath) => {
      if (filePath.includes("heic")) {
        return Buffer.from("mocked-heic-data");
      }
      return Buffer.from("mocked-image-data");
    });
    mockedFs.writeFile.mockResolvedValue(undefined);

    // Reset sharp mock behavior
    mockSharpInstance.toFile.mockResolvedValue(undefined);
  });

  it("should process a JPG image to WebP and save to cache", async () => {
    const sourcePath = path.join(PHOTOS_DIR, "city", "image.jpg");
    const cachedPath = path.join(CACHE_DIR, "city", "image.webp");

    mockedFs.access.mockRejectedValue(new Error("File not found"));

    await processImage(sourcePath, cachedPath);

    expect(mockedFs.mkdir).toHaveBeenCalledWith(path.dirname(cachedPath), {
      recursive: true,
    });
    expect(mockedFs.readFile).toHaveBeenCalledWith(sourcePath);
    expect(sharp).toHaveBeenCalledWith(expect.any(Buffer));
    expect(mockSharpInstance.rotate).toHaveBeenCalled();
    expect(mockSharpInstance.toFile).toHaveBeenCalledWith(cachedPath);
    expect(heicConvert).not.toHaveBeenCalled();
  });

  it("should process an HEIC image via fallback if direct sharp fails", async () => {
    const sourcePath = path.join(PHOTOS_DIR, "city", "iphone.heic");
    const cachedPath = path.join(CACHE_DIR, "city", "iphone.webp");

    mockedFs.access.mockRejectedValue(new Error("File not found"));

    // Make sharp fail ONCE (for the HEIC buffer) then succeed (for the converted JPEG)
    mockSharpInstance.toFile
      .mockRejectedValueOnce(new Error("unsupported image format"))
      .mockResolvedValueOnce(undefined);

    await processImage(sourcePath, cachedPath);

    expect(mockedFs.readFile).toHaveBeenCalledWith(sourcePath);

    // Should have tried sharp first
    expect(sharp).toHaveBeenCalledTimes(2);
    // 1st call with raw heic
    expect(sharp).toHaveBeenNthCalledWith(1, Buffer.from("mocked-heic-data"));

    // Then heic-convert
    expect(heicConvert).toHaveBeenCalledWith({
      buffer: expect.any(Buffer),
      format: "JPEG",
      quality: 1,
    });

    // Then sharp again with converted data
    expect(sharp).toHaveBeenNthCalledWith(
      2,
      Buffer.from("mocked-converted-jpeg-data"),
    );

    expect(mockSharpInstance.toFile).toHaveBeenCalledTimes(2); // One fail, one success
  });

  it("should process an HEIC image directly if sharp supports it", async () => {
    const sourcePath = path.join(PHOTOS_DIR, "city", "iphone.heic");
    const cachedPath = path.join(CACHE_DIR, "city", "iphone.webp");

    mockedFs.access.mockRejectedValue(new Error("File not found"));
    // sharp.toFile succeeds by default in our mock setup

    await processImage(sourcePath, cachedPath);

    expect(mockedFs.readFile).toHaveBeenCalledWith(sourcePath);
    expect(sharp).toHaveBeenCalledTimes(1);
    expect(sharp).toHaveBeenCalledWith(Buffer.from("mocked-heic-data"));
    expect(heicConvert).not.toHaveBeenCalled(); // No fallback needed
  });

  it("should return cached path if the processed file already exists", async () => {
    const sourcePath = path.join(PHOTOS_DIR, "city", "cached_image.jpg");
    const cachedPath = path.join(CACHE_DIR, "city", "cached_image.webp");

    mockedFs.access.mockResolvedValue(undefined);

    const result = await processImage(sourcePath, cachedPath);

    expect(mockedFs.access).toHaveBeenCalledWith(cachedPath);
    expect(mockedFs.mkdir).not.toHaveBeenCalled();
    expect(result).toBe(cachedPath);
  });
});
