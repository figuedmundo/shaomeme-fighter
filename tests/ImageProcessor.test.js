import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import * as fs from 'node:fs/promises'; // Use direct node:fs/promises import
import sharp from 'sharp'; // Will be mocked
import heicConvert from 'heic-convert';

// Mock sharp
const { mockSharpInstance } = vi.hoisted(() => ({
  mockSharpInstance: {
    resize: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toBuffer: vi.fn(async () => Buffer.from('mocked-webp-data')),
    toFile: vi.fn(async () => {}),
    metadata: vi.fn(async () => ({ format: 'jpeg' })),
  },
}));

vi.mock('sharp', () => {
  const sharpMock = vi.fn(() => mockSharpInstance);
  sharpMock.concurrency = vi.fn();
  return { default: sharpMock };
});

// Mock node:fs/promises
vi.mock('node:fs/promises', () => ({
  access: vi.fn(async (path) => Promise.reject(new Error('File not found'))), // Default to not found
  mkdir: vi.fn(async () => {}),
  readdir: vi.fn(async () => []),
  readFile: vi.fn(async (filePath) => {
    if (filePath.includes('heic')) {
      return Buffer.from('mocked-heic-data');
    }
    return Buffer.from('mocked-image-data');
  }),
  writeFile: vi.fn(async () => {}),
}));

// Mock heic-convert
vi.mock('heic-convert', () => ({
  default: vi.fn(async () => Buffer.from('mocked-converted-heic-data')),
}));

import { processImage, MAX_DIMENSION, WEBP_QUALITY } from '../server/ImageProcessor';

describe('ImageProcessor', () => {
  const PHOTOS_DIR = '/mock/photos';
  const CACHE_DIR = '/mock/cache';

  const mockedFs = vi.mocked(fs); // Cast to mocked version

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default mock implementations for fs methods
    mockedFs.access.mockImplementation(async (path) => {
      if (path.includes('cached_image.webp')) { // Only for the 'cached path exists' test
        return Promise.resolve();
      }
      return Promise.reject(new Error('File not found'));
    });
    mockedFs.mkdir.mockResolvedValue(undefined);
    mockedFs.readFile.mockImplementation(async (filePath) => {
      if (filePath.includes('heic')) {
        return Buffer.from('mocked-heic-data');
      }
      return Buffer.from('mocked-image-data');
    });
    mockedFs.writeFile.mockResolvedValue(undefined);
  });

  it('should process a JPG image to WebP and save to cache', async () => {
    const sourcePath = path.join(PHOTOS_DIR, 'city', 'image.jpg');
    const cachedPath = path.join(CACHE_DIR, 'city', 'image.webp');

    // Ensure access rejects for this test to trigger processing
    mockedFs.access.mockRejectedValue(new Error('File not found'));

    await processImage(sourcePath, cachedPath);

    expect(mockedFs.mkdir).toHaveBeenCalledWith(path.dirname(cachedPath), { recursive: true });
    expect(mockedFs.readFile).toHaveBeenCalledWith(sourcePath);
    expect(sharp).toHaveBeenCalledWith(expect.any(Buffer));
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside' });
    expect(mockSharpInstance.webp).toHaveBeenCalledWith({ quality: WEBP_QUALITY });
    expect(mockSharpInstance.toFile).toHaveBeenCalledWith(cachedPath);
    expect(heicConvert).not.toHaveBeenCalled();
  });

  it('should process an HEIC image to WebP and save to cache', async () => {
    const sourcePath = path.join(PHOTOS_DIR, 'city', 'iphone.heic');
    const cachedPath = path.join(CACHE_DIR, 'city', 'iphone.webp');

    // Ensure access rejects for this test to trigger processing
    mockedFs.access.mockRejectedValue(new Error('File not found'));

    await processImage(sourcePath, cachedPath);

    expect(mockedFs.mkdir).toHaveBeenCalledWith(path.dirname(cachedPath), { recursive: true });
    expect(mockedFs.readFile).toHaveBeenCalledWith(sourcePath);
    expect(heicConvert).toHaveBeenCalledWith({
      buffer: expect.any(Buffer),
      format: 'JPEG',
      quality: 1,
    });
    expect(sharp).toHaveBeenCalledWith(expect.any(Buffer)); // Should be called with the converted JPEG buffer
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside' });
    expect(mockSharpInstance.webp).toHaveBeenCalledWith({ quality: WEBP_QUALITY });
    expect(mockSharpInstance.toFile).toHaveBeenCalledWith(cachedPath);
  });

  it('should return cached path if the processed file already exists', async () => {
    const sourcePath = path.join(PHOTOS_DIR, 'city', 'cached_image.jpg');
    const cachedPath = path.join(CACHE_DIR, 'city', 'cached_image.webp');

    // Simulate cached file existing for fs.access
    mockedFs.access.mockResolvedValue(undefined);

    const result = await processImage(sourcePath, cachedPath);

    expect(mockedFs.access).toHaveBeenCalledWith(cachedPath);
    expect(mockedFs.mkdir).not.toHaveBeenCalled(); // Should not create dir if cached
    expect(mockedFs.readFile).not.toHaveBeenCalled();
    expect(sharp).not.toHaveBeenCalled();
    expect(heicConvert).not.toHaveBeenCalled();
    expect(result).toBe(cachedPath);
  });
});
