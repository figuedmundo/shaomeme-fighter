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

function formatDateForFilename(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");
  const SS = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}_${HH}-${MM}-${SS}`;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
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
  // Important: Set utimes AFTER writing the file
  await fs.utimes(targetPath, date, date);
}

/**
 * Updates the date of a photo file, including file system timestamp, EXIF (if JPEG),
 * and RENAMES the file to match the new date (YYYY-MM-DD_HH-MM-SS).
 *
 * @param {string} filePath - Full path to the file
 * @param {string} dateStr - New date string
 * @returns {Promise<string>} The new filename (basename only)
 */
export async function updatePhotoDate(filePath, dateStr) {
  const fullPath = path.resolve(filePath);
  await fs.access(fullPath);

  const targetDate = new Date(dateStr);
  if (Number.isNaN(targetDate.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  // 1. Update EXIF (if JPEG) and Filesystem Timestamp
  const ext = path.extname(fullPath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") {
    await updateJpegExif(fullPath, targetDate);
  } else {
    // Just update filesystem timestamps for non-JPEGs
    await fs.utimes(fullPath, targetDate, targetDate);
  }

  // 2. Rename the file based on the new date
  const dir = path.dirname(fullPath);
  const baseName = formatDateForFilename(targetDate);
  let newName = `${baseName}${ext}`;
  let newPath = path.join(dir, newName);

  // Handle collisions (e.g., if another photo has the exact same second)
  let counter = 1;
  /* eslint-disable no-await-in-loop */
  while ((await fileExists(newPath)) && newPath !== fullPath) {
    newName = `${baseName}_${counter}${ext}`;
    newPath = path.join(dir, newName);
    counter += 1;
  }
  /* eslint-enable no-await-in-loop */

  if (fullPath !== newPath) {
    await fs.rename(fullPath, newPath);
    console.log(`Renamed: ${path.basename(fullPath)} -> ${newName}`);

    // Also remove the cache file for the OLD name to avoid orphans/stale cache
    // The server typically handles cache, but it's good practice to invalidate
    // Note: We don't have easy access to CACHE_DIR here, so we'll leave cache cleanup
    // to the server logic or let it be regenerated on next request.
  }

  return newName;
}
