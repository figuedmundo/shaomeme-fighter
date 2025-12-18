import sharp from "sharp";
import path from "path";
import * as fs from "node:fs/promises";
import heicConvert from "heic-convert"; // Only if sharp struggles with HEIC directly
import UnifiedLogger from "../src/utils/Logger.js";

const logger = new UnifiedLogger("Backend:ImageProcessor");

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
    logger.debug(`Cache hit for: ${cachePath}`);
    return cachePath; // Already cached
  } catch (error) {
    // Not cached, proceed with processing
    logger.debug(`Cache miss for: ${cachePath}. Processing...`);
  }

  // Ensure the cache directory exists
  await fs.mkdir(path.dirname(cachePath), { recursive: true });

  let imageBuffer;
  try {
    imageBuffer = await fs.readFile(sourcePath);
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error(`File is empty: ${sourcePath}`);
    }
  } catch (readError) {
    logger.error(`Error reading file ${sourcePath}:`, readError);
    throw readError;
  }

  const fileExtension = path.extname(sourcePath).toLowerCase();

  // Handle HEIC conversion
  if (fileExtension === ".heic" || fileExtension === ".heif") {
    try {
      logger.info(`Converting HEIC to JPEG: ${sourcePath}`);
      // Attempt HEIC conversion using heic-convert
      imageBuffer = await heicConvert({
        buffer: imageBuffer, // the HEIC buffer
        format: "JPEG", // output format
        quality: 1, // the quality setting between 0 and 1
      });
      // Sharp can then process the JPEG buffer
    } catch (heicError) {
      logger.error(`Error converting HEIC file ${sourcePath}:`, heicError);
      // Fallback or re-throw, depending on desired behavior
      throw new Error(`Failed to convert HEIC image: ${sourcePath}`);
    }
  }

  // Process with sharp
  try {
    await sharp(imageBuffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside" })
      .webp({ quality: WEBP_QUALITY })
      .toFile(cachePath);
    logger.info(`Successfully processed and cached: ${cachePath}`);
  } catch (sharpError) {
    logger.error(`Sharp processing failed for ${sourcePath}:`, sharpError);
    throw sharpError;
  }

  return cachePath;
}
