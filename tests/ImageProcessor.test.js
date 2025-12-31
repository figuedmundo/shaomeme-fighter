import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import sharp from "sharp";
import heicConvert from "heic-convert";
import * as fs from "node:fs/promises";
import { processImage } from "../server/ImageProcessor";

// Mock dependencies
const mockSharpInstance = {
  rotate: vi.fn().mockReturnThis(),
  resize: vi.fn().mockReturnThis(),
  webp: vi.fn().mockReturnThis(),
  toFile: vi.fn().mockResolvedValue(true),
};
vi.mock("sharp", () => ({
  __esModule: true,
  default: vi.fn(() => mockSharpInstance),
}));

vi.mock("heic-convert", () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(Buffer.from("mock-jpeg-data")),
}));

// We need a partial mock for fs.promises to just mock mkdir
vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal();
  const mockedMkdir = vi.fn(() => Promise.resolve());
  return {
    ...actual,
    mkdir: mockedMkdir,
    default: {
      ...actual,
      mkdir: mockedMkdir,
    },
  };
});

describe("ImageProcessor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const dummyBuffer = Buffer.from("dummy-image-data");
  const cachePath = "/mock/cache/image.webp";

  it("should process a standard image with sharp", async () => {
    const sourcePath = "/mock/photos/image.jpg";

    await processImage(dummyBuffer, cachePath, sourcePath);

    expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(cachePath), {
      recursive: true,
    });
    expect(sharp).toHaveBeenCalledWith(dummyBuffer);
    expect(mockSharpInstance.rotate).toHaveBeenCalled();
    expect(mockSharpInstance.resize).toHaveBeenCalled();
    expect(mockSharpInstance.webp).toHaveBeenCalled();
    expect(mockSharpInstance.toFile).toHaveBeenCalledWith(cachePath);
    expect(heicConvert).not.toHaveBeenCalled();
  });

  it("should use heic-convert fallback if sharp fails for a .heic file", async () => {
    const sourcePath = "/mock/photos/image.heic";

    // Make sharp fail on the first call, succeed on the second
    mockSharpInstance.toFile
      .mockRejectedValueOnce(new Error("Sharp fail"))
      .mockResolvedValueOnce(true);

    await processImage(dummyBuffer, cachePath, sourcePath);

    // Ensure mkdir was still called
    expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(cachePath), {
      recursive: true,
    });

    // Sharp was attempted twice
    expect(sharp).toHaveBeenCalledTimes(2);
    expect(sharp).toHaveBeenCalledWith(dummyBuffer); // First attempt
    expect(sharp).toHaveBeenCalledWith(Buffer.from("mock-jpeg-data")); // Second attempt

    // heic-convert was called in between
    expect(heicConvert).toHaveBeenCalledOnce();
    expect(heicConvert).toHaveBeenCalledWith({
      buffer: dummyBuffer,
      format: "JPEG",
      quality: 1,
    });

    // toFile was attempted twice
    expect(mockSharpInstance.toFile).toHaveBeenCalledTimes(2);
  });

  it("should throw error if non-heic file fails in sharp", async () => {
    const sourcePath = "/mock/photos/image.jpg";

    // Make sharp fail
    mockSharpInstance.toFile.mockRejectedValueOnce(new Error("Sharp fail"));

    await expect(
      processImage(dummyBuffer, cachePath, sourcePath),
    ).rejects.toThrow("Sharp fail");

    // Ensure fallback was not attempted
    expect(heicConvert).not.toHaveBeenCalled();
  });
});
