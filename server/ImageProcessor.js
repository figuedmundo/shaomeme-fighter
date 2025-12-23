import sharp from "sharp";
import path from "path";
import * as fs from "node:fs/promises";
import heicConvert from "heic-convert"; // Only if sharp struggles with HEIC directly
import exifReader from "exif-reader";
import UnifiedLogger from "../src/utils/Logger.js";

const logger = new UnifiedLogger("Backend:ImageProcessor");

export const MAX_DIMENSION = 1920;
export const WEBP_QUALITY = 80;

/**
 * Formats a Date object to "Month Day, Year" (e.g., "May 21, 2023").
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Extracts the best available date from an image (EXIF DateTimeOriginal > CreateDate > File Birthtime).
 * @param {string} sourcePath
 * @returns {Promise<string|null>} Formatted date string or null if fails
 */
export async function getPhotoDate(sourcePath) {
  try {
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    let dateObj = null;

    if (metadata.exif) {
      try {
        const parsedExif = exifReader(metadata.exif);

        // exif-reader v2+ uses 'Photo' for SubIFD tags like DateTimeOriginal
        const exifTags = parsedExif.Photo || parsedExif.exif || {};

        if (exifTags.DateTimeOriginal) {
          dateObj = new Date(exifTags.DateTimeOriginal);
        } else if (exifTags.CreateDate) {
          dateObj = new Date(exifTags.CreateDate);
        }
      } catch (exifErr) {
        logger.warn(`Failed to parse EXIF for ${sourcePath}:`, exifErr);
      }
    }

    // Fallback to file creation time
    if (!dateObj || Number.isNaN(dateObj.getTime())) {
      const stats = await fs.stat(sourcePath);
      dateObj = stats.birthtime;
    }

    if (dateObj && !Number.isNaN(dateObj.getTime())) {
      return formatDate(dateObj);
    }
  } catch (err) {
    logger.error(`Error getting date for ${sourcePath}:`, err);
  }
  return null;
}

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

  // Process with sharp (try directly first to preserve metadata/orientation)
  try {
    await sharp(imageBuffer)
      .rotate() // Auto-rotate based on EXIF
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside" })
      .webp({ quality: WEBP_QUALITY })
      .toFile(cachePath);
    logger.info(`Successfully processed and cached: ${cachePath}`);
  } catch (sharpError) {
    logger.warn(
      `Direct sharp processing failed for ${sourcePath}. Trying fallback...`,
      sharpError,
    );

    // Fallback: Check if it was HEIC/HEIF and try heic-convert
    const fileExtension = path.extname(sourcePath).toLowerCase();
    if (fileExtension === ".heic" || fileExtension === ".heif") {
      try {
        logger.info(`Fallback: Converting HEIC to JPEG: ${sourcePath}`);
        // Attempt HEIC conversion using heic-convert
        const jpegBuffer = await heicConvert({
          buffer: imageBuffer,
          format: "JPEG",
          quality: 1,
        });

        // Retry sharp with the converted JPEG buffer
        // Note: Metadata might be lost here, but at least we get an image
        await sharp(jpegBuffer)
          .rotate() // Try rotate again just in case, though likely no tag
          .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside" })
          .webp({ quality: WEBP_QUALITY })
          .toFile(cachePath);

        logger.info(
          `Successfully processed and cached (via fallback): ${cachePath}`,
        );
        return cachePath;
      } catch (heicError) {
        logger.error(
          `Fallback HEIC conversion failed for ${sourcePath}:`,
          heicError,
        );
        throw heicError; // Throw the HEIC error if fallback fails
      }
    } else {
      // Not HEIC, re-throw the original sharp error
      throw sharpError;
    }
  }

  return cachePath;
}
