/**
 * @file scripts/rename_photos.js
 * @description
 * Scans all subdirectories in the `photos/` folder and renames images based on their creation date.
 *
 * Logic for determining date:
 * 1. File System Creation Time (mtime) - PRIMARY SOURCE (User uses update_photo_date.js to set this).
 * 2. EXIF Metadata - Secondary source (used for verification or if mtime is invalid).
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

/**
 * Extracts the best available date from an image.
 * Priorities:
 * 1. File Stats (mtime) - Because the user manually sets this to fix issues.
 * 2. EXIF - Fallback / Reference.
 */
async function getBestPhotoDate(sourcePath) {
  try {
    const filename = path.basename(sourcePath);

    // 1. Get Filesystem Date (mtime)
    // This is our primary source of truth because update_photo_date.js sets it.
    let mtimeDate = null;
    try {
      const stats = await fs.stat(sourcePath);
      mtimeDate = stats.mtime;
    } catch (statErr) {
      console.warn(`   [Warn] Could not stat file ${filename}`);
    }

    // 2. Get EXIF (for logging/comparison, or if mtime is somehow missing)
    let exifDate = null;
    try {
      const image = sharp(sourcePath);
      const metadata = await image.metadata();
      if (metadata.exif) {
        const parsedExif = exifReader(metadata.exif);
        const exifTags = parsedExif.Photo || parsedExif.exif || {};
        const rawDate = exifTags.DateTimeOriginal || exifTags.CreateDate;

        if (rawDate) {
          if (typeof rawDate === "string" && rawDate.includes(":")) {
            const normalized = rawDate.replace(
              /^(\d{4}):(\d{2}):(\d{2})/,
              "$1-$2-$3",
            );
            exifDate = new Date(normalized);
          } else {
            exifDate = new Date(rawDate);
          }
        }
      }
    } catch (exifErr) {
      // Ignore EXIF errors, we rely on mtime
    }

    // Decision Logic
    if (mtimeDate && !Number.isNaN(mtimeDate.getTime())) {
      // Use mtime as the authority
      return { date: mtimeDate, source: "filesystem (mtime)" };
    }

    if (exifDate && !Number.isNaN(exifDate.getTime())) {
      return { date: exifDate, source: "exif" };
    }

    return null;
  } catch (err) {
    console.error(`   [Error] getting date for ${sourcePath}:`, err.message);
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
      const result = await getBestPhotoDate(oldPath);

      if (result && result.date) {
        const ext = path.extname(file);
        const baseName = formatDateForFilename(result.date);
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
          console.log(
            `Renamed: ${file} -> ${newName} (Source: ${result.source})`,
          );
        } else {
          // console.log(`Skipped: ${file} (Already correct)`);
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
