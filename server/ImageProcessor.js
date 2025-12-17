import sharp from 'sharp';
import path from 'path';
import * as fs from 'node:fs/promises';
import heicConvert from 'heic-convert'; // Only if sharp struggles with HEIC directly

export const MAX_DIMENSION = 1920;
export const WEBP_QUALITY = 80;

/**
 * Processes an image, resizing and converting it to WebP if necessary, and saves it to a cache directory.
 * @param {string} sourcePath - The full path to the original image file.
 * @param {string} cachePath - The full path where the processed image should be saved.
 * @returns {Promise<string>} The path to the processed (cached) image.
 */
export async function processImage(sourcePath, cachePath) {
  try {
    // 1. Check if cached version exists
    await fs.access(cachePath);
    return cachePath; // Already cached
  } catch (error) {
    // Not cached, proceed with processing
  }

  // Ensure the cache directory exists
  await fs.mkdir(path.dirname(cachePath), { recursive: true });

  let imageBuffer = await fs.readFile(sourcePath);
  const fileExtension = path.extname(sourcePath).toLowerCase();

  // Handle HEIC conversion
  if (fileExtension === '.heic' || fileExtension === '.heif') {
    try {
      // Attempt HEIC conversion using heic-convert
      imageBuffer = await heicConvert({
        buffer: imageBuffer, // the HEIC buffer
        format: 'JPEG',      // output format
        quality: 1           // the quality setting between 0 and 1
      });
      // Sharp can then process the JPEG buffer
    } catch (heicError) {
      console.error(`Error converting HEIC file ${sourcePath}:`, heicError);
      // Fallback or re-throw, depending on desired behavior
      throw new Error(`Failed to convert HEIC image: ${sourcePath}`);
    }
  }

  // Process with sharp
  await sharp(imageBuffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(cachePath);

  return cachePath;
}
