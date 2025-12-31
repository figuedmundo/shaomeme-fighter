import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ASSETS_DIR = path.resolve("public/assets");
const PHOTOS_DIR = path.resolve("photos");
const MAX_WIDTH = 2048; // Max reasonable width for mobile
const MAX_HEIGHT = 2048;
const LARGE_FILE_THRESHOLD = 1024 * 1024; // 1MB

async function optimizeFile(filePath, stats) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Auto-rotate based on EXIF orientation tag before processing
    let pipeline = image.rotate();
    let mustSave = false;

    if (metadata.orientation && metadata.orientation !== 1) {
      mustSave = true; // Force save if we are fixing orientation
      console.log(`  -> Fixing orientation (was ${metadata.orientation})`);
    }

    // 1. Resize if too large
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      console.log(
        `  -> Resizing ${metadata.width}x${metadata.height} to fit ${MAX_WIDTH}x${MAX_HEIGHT}`,
      );
      pipeline = pipeline.resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // 2. Compress
    if (ext === ".png") {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    } else if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
    }

    // Process to buffer first to check result size
    const buffer = await pipeline.toBuffer();

    if (buffer.length < stats.size || mustSave) {
      const saved = (stats.size - buffer.length) / 1024 / 1024;
      await fs.writeFile(filePath, buffer);
      console.log(
        `  [Optimized] Saved ${saved.toFixed(2)} MB (${((buffer.length / stats.size) * 100).toFixed(0)}% of original)${mustSave ? " (Orientation Fixed)" : ""}`,
      );
    } else {
      console.log(
        `  [Skipped] Optimization resulted in larger file (likely already compressed).`,
      );
    }
  } catch (err) {
    console.error(`  [Error] Failed to optimize ${filePath}:`, err.message);
  }
}

async function checkAndOptimize(filePath) {
  try {
    const stats = await fs.stat(filePath);

    if (stats.size > LARGE_FILE_THRESHOLD) {
      console.log(
        `[Processing] ${path.basename(filePath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
      );
      await optimizeFile(filePath, stats);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

async function scanAndOptimize(dir, filterFn = () => true) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await scanAndOptimize(fullPath, filterFn);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (
            (ext === ".png" || ext === ".jpg" || ext === ".jpeg") &&
            filterFn(entry.name)
          ) {
            await checkAndOptimize(fullPath);
          }
        }
      }),
    );
  } catch (err) {
    // Directory might not exist, just warn
    console.warn(`Skipping scan for ${dir}:`, err.message);
  }
}

console.log("Starting Asset Optimization...");

// 1. Optimize Game Assets (All images)
console.log("--- Scanning Game Assets (public/assets) ---");
scanAndOptimize(ASSETS_DIR)
  .then(async () => {
    // 2. Optimize ALL Photo Reward Assets (Backgrounds + Memories)
    console.log("\n--- Scanning All Photo Arena Assets (photos/) ---");
    await scanAndOptimize(PHOTOS_DIR);
  })
  .then(() => console.log("\nOptimization complete."))
  .catch((err) => console.error("Fatal error:", err));
