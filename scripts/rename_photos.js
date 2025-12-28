/**
 * @file scripts/rename_photos.js
 * @description
 * Scans all subdirectories in the `photos/` folder and renames images based on their creation date.
 *
 * It attempts to read the date from:
 * 1. EXIF Metadata (DateTimeOriginal or CreateDate)
 * 2. File System Creation Time (Birthtime) - Fallback
 *
 * The resulting filename format is: YYYY-MM-DD_HH-MM-SS.ext
 *
 * Usage:
 *   node scripts/rename_photos.js
 */

import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import exifReader from "exif-reader";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_DIR = path.join(__dirname, "../photos");

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function getRawPhotoDate(sourcePath) {
  try {
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    let dateObj = null;

    if (metadata.exif) {
      try {
        const parsedExif = exifReader(metadata.exif);
        const exifTags = parsedExif.Photo || parsedExif.exif || {};

        if (exifTags.DateTimeOriginal) {
          dateObj = new Date(exifTags.DateTimeOriginal);
        } else if (exifTags.CreateDate) {
          dateObj = new Date(exifTags.CreateDate);
        }
      } catch (exifErr) {
        console.warn(
          `Failed to parse EXIF for ${sourcePath}:`,
          exifErr.message,
        );
      }
    }

    // Fallback to file creation time
    if (!dateObj || Number.isNaN(dateObj.getTime())) {
      const stats = await fs.stat(sourcePath);
      dateObj = stats.birthtime;
    }

    return dateObj;
  } catch (err) {
    console.error(`Error getting date for ${sourcePath}:`, err.message);
    return null;
  }
}

function formatDateForFilename(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");
  const SS = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}_${HH}-${MM}-${SS}`;
}

async function renamePhotosInCity(cityDir) {
  const cityName = path.basename(cityDir);
  console.log(`Processing city: ${cityName}...`);

  try {
    const files = await fs.readdir(cityDir);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      const name = path.parse(file).name.toLowerCase();
      return (
        [".jpg", ".jpeg", ".png", ".heic", ".webp"].includes(ext) &&
        name !== "background" &&
        name !== "arena"
      );
    });

    // Use for...of sparingly for sequential async operations that cannot be parallelized easily due to renaming/collisions
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    for (const file of imageFiles) {
      const oldPath = path.join(cityDir, file);
      const date = await getRawPhotoDate(oldPath);

      if (date && !Number.isNaN(date.getTime())) {
        const ext = path.extname(file);
        const baseName = formatDateForFilename(date);
        let newName = `${baseName}${ext}`;
        let newPath = path.join(cityDir, newName);

        // Handle collisions
        let counter = 1;
        while ((await fileExists(newPath)) && newPath !== oldPath) {
          newName = `${baseName}_${counter}${ext}`;
          newPath = path.join(cityDir, newName);
          counter += 1;
        }

        if (oldPath !== newPath) {
          await fs.rename(oldPath, newPath);
          console.log(`Renamed: ${file} -> ${newName}`);
        } else {
          console.log(`Skipped: ${file} (Already named correctly)`);
        }
      } else {
        console.warn(`Could not determine date for ${file}, skipping.`);
      }
    }
    /* eslint-enable no-await-in-loop, no-restricted-syntax */
  } catch (err) {
    console.error(`Error processing city ${cityName}:`, err);
  }
}

async function main() {
  try {
    const cities = await fs.readdir(PHOTOS_DIR, { withFileTypes: true });
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    for (const dirent of cities) {
      if (dirent.isDirectory() && !dirent.name.startsWith(".")) {
        await renamePhotosInCity(path.join(PHOTOS_DIR, dirent.name));
      }
    }
    /* eslint-enable no-await-in-loop, no-restricted-syntax */
    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
