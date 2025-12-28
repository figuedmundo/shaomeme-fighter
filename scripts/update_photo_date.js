/**
 * @file scripts/update_photo_date.js
 * @description
 * Manually updates the creation date of a specific photo file.
 * This is useful for correcting photos that have lost their metadata or have incorrect dates.
 *
 * Features:
 * - Updates File System timestamps (mtime/atime) for all file types.
 * - Updates internal EXIF metadata (DateTimeOriginal, CreateDate) for JPEG files.
 *
 * Usage:
 *   node scripts/update_photo_date.js <file_path> <YYYY-MM-DD HH:MM:SS>
 *
 * Example:
 *   node scripts/update_photo_date.js photos/tokyo/image1.jpg "2023-12-25 15:00:00"
 */

import fs from "node:fs/promises";
import path from "path";
import piexif from "piexifjs";

function toExifString(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");
  const SS = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}:${mm}:${dd} ${HH}:${MM}:${SS}`;
}

async function updateJpegExif(targetPath, date) {
  // EXIF format: "YYYY:MM:DD HH:MM:SS"
  const exifDate = toExifString(date);

  const fileBuffer = await fs.readFile(targetPath);
  const binary = fileBuffer.toString("binary");

  let exifObj;
  try {
    exifObj = piexif.load(binary);
  } catch (e) {
    console.warn("   Could not load existing EXIF, creating new container.");
    exifObj = {
      "0th": {},
      Exif: {},
      GPS: {},
      "1st": {},
      thumbnail: null,
    };
  }

  // Update DateTimeOriginal (36867) and CreateDate (36868)
  exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = exifDate;
  exifObj.Exif[piexif.ExifIFD.DateTimeDigitized] = exifDate;
  exifObj["0th"][piexif.ImageIFD.DateTime] = exifDate;

  const exifBytes = piexif.dump(exifObj);
  const newBinary = piexif.insert(exifBytes, binary);
  const newBuffer = Buffer.from(newBinary, "binary");

  await fs.writeFile(targetPath, newBuffer);
  console.log(`✅ Updated JPEG EXIF data (DateTimeOriginal: ${exifDate}).`);
}

async function updateDate() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(
      "Usage: node scripts/update_photo_date.js <file_path> <YYYY-MM-DD HH:MM:SS>",
    );
    process.exit(1);
  }

  const filePathInput = args[0];
  const dateStr = args[1]; // Expected "YYYY-MM-DD HH:MM:SS" or similar

  try {
    const fullPath = path.resolve(filePathInput);
    await fs.access(fullPath);

    const targetDate = new Date(dateStr);
    if (Number.isNaN(targetDate.getTime())) {
      throw new Error(`Invalid date string: ${dateStr}`);
    }

    console.log(
      `Updating ${path.basename(fullPath)} to ${targetDate.toString()}...`,
    );

    // 1. Update Filesystem Timestamps (mtime, atime)
    // This serves as the fallback for all file types
    await fs.utimes(fullPath, targetDate, targetDate);
    console.log("✅ Updated filesystem timestamps.");

    // 2. Update EXIF if JPEG
    const ext = path.extname(fullPath).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg") {
      await updateJpegExif(fullPath, targetDate);
    } else {
      console.warn(
        `⚠️  File is ${ext}. Only filesystem dates were updated. Internal EXIF data might still remain incorrect (tools like piexifjs only support JPEG).`,
      );
      console.warn(
        "   If the rename script still fails, you might need to convert this file to JPG or use an external tool like 'exiftool' to fix the internal metadata.",
      );
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

updateDate();
