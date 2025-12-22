import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ASSETS_DIR = path.resolve("public/assets");
const MAX_WIDTH = 2048; // Max reasonable width for mobile
const MAX_HEIGHT = 2048;
const LARGE_FILE_THRESHOLD = 1024 * 1024; // 1MB

async function checkAndOptimize(filePath) {
  try {
    const stats = await fs.stat(filePath);

    if (stats.size > LARGE_FILE_THRESHOLD) {
      console.log(
        `[Large File] ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
      );

      const metadata = await sharp(filePath).metadata();

      if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
        console.log(
          `  -> Dimensions ${metadata.width}x${metadata.height} exceed max. Recommendation: Resize.`,
        );
      } else {
        console.log(`  -> Dimensions OK. Recommendation: Compress.`);
      }
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

async function scanAndOptimize(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  // Using Promise.all with map to avoid for...of and await in loop
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanAndOptimize(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
          await checkAndOptimize(fullPath);
        }
      }
    }),
  );
}

console.log("Starting Asset Scan...");
scanAndOptimize(ASSETS_DIR)
  .then(() => console.log("Scan complete."))
  .catch((err) => console.error("Scan failed:", err));
