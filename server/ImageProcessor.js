import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
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
 * @returns {Promise<Date|null>} Date object or null if fails
 */
export async function getPhotoDate(sourcePath) {
  try {
    const filename = path.basename(sourcePath);

    // 1. Try to parse from filename (YYYY-MM-DD_HH-MM-SS)
    const filenameMatch = filename.match(
      /^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/,
    );
    if (filenameMatch) {
      const [, year, month, day, hour, minute, second] = filenameMatch;
      const d = new Date(
        year,
        parseInt(month, 10) - 1,
        day,
        hour,
        minute,
        second,
      );
      if (!Number.isNaN(d.getTime())) {
        logger.debug(`Date parsed from filename for ${filename}: ${d}`);
        return d;
      }
    }

    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    let dateObj = null;

    if (metadata.exif) {
      try {
        const parsedExif = exifReader(metadata.exif);
        const exifTags = parsedExif.Photo || parsedExif.exif || {};
        const rawDate = exifTags.DateTimeOriginal || exifTags.CreateDate;

        if (rawDate) {
          if (typeof rawDate === "string" && rawDate.includes(":")) {
            const normalized = rawDate.replace(
              /^(\d{4}):(\d{2}):(\d{2})/,
              "$1-$2-$3",
            );
            dateObj = new Date(normalized);
          } else {
            dateObj = new Date(rawDate);
          }
        }
      } catch (exifErr) {
        logger.warn(`Failed to parse EXIF for ${sourcePath}:`, exifErr);
      }
    }

    if (!dateObj || Number.isNaN(dateObj.getTime())) {
      const stats = await fs.stat(sourcePath);
      dateObj = stats.mtime || stats.birthtime;
    }

    if (dateObj && !Number.isNaN(dateObj.getTime())) {
      return dateObj;
    }
  } catch (err) {
    logger.error(`Error getting date for ${sourcePath}:`, err);
  }
  return null;
}

/**
 * Processes an image, resizing and converting it to WebP if necessary, and saves it to a cache directory.
 * @param {string} cachePath - The full path where the processed image should be saved.
 * @param {string} sourcePath - The full path of the source image.
 * @returns {Promise<string>} The path to the processed (cached) image.
 */
export async function processImage(cachePath, sourcePath) {
  // Ensure the cache directory exists
  await fs.mkdir(path.dirname(cachePath), { recursive: true });

  // Process with sharp
  try {
    await sharp(sourcePath)
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

    const fileExtension = path.extname(sourcePath).toLowerCase();
    if (fileExtension === ".heic" || fileExtension === ".heif") {
      try {
        logger.info(`Fallback: Converting HEIC to JPEG: ${sourcePath}`);
        // Read buffer only when needed for heic-convert
        const imageBuffer = await fs.readFile(sourcePath);
        const jpegBuffer = await heicConvert({
          buffer: imageBuffer,
          format: "JPEG",
          quality: 1,
        });

        await sharp(jpegBuffer)
          .rotate()
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
        throw heicError;
      }
    } else {
      throw sharpError;
    }
  }
  return cachePath;
}
