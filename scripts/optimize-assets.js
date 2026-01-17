import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import heicConvert from "heic-convert";

const ASSETS_DIR = path.resolve("public/assets");
const PHOTOS_DIR = path.resolve("photos");
const MAX_WIDTH = 2048; // Max reasonable width for mobile
const MAX_HEIGHT = 2048;
const LARGE_FILE_THRESHOLD = 1024 * 1024; // 1MB

async function optimizeFile(filePath, stats) {
  try {
    let ext = path.extname(filePath).toLowerCase();
    let inputBuffer = null;
    let isHeic = false;

    // Handle HEIC conversion first
    if (ext === ".heic") {
      isHeic = true;
      console.log(`  -> Converting HEIC to JPEG: ${path.basename(filePath)}`);
      const fileBuf = await fs.readFile(filePath);
      inputBuffer = await heicConvert({
        buffer: fileBuf,
        format: "JPEG",
        quality: 1, // High quality intermediate
      });
      // We will save as .jpg
      ext = ".jpg";
    }

    const image = inputBuffer ? sharp(inputBuffer) : sharp(filePath);
    const metadata = await image.metadata();

    // Do NOT auto-rotate. Preserve original orientation pixels and EXIF tags.
    let pipeline = image;

    if (filePath.startsWith(PHOTOS_DIR) && !isHeic) {
      // Only preserve metadata for native supported formats.
      // HEIC->JPEG conversion via heic-convert often strips EXIF,
      // so we rely on fs.utimes (file date) preservation below.
      console.log("  -> Preserving metadata (EXIF/Date)");
      pipeline = pipeline.withMetadata();
    }

    const mustSave = false;

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

    // Logic: Save if smaller, OR if we fixed orientation, OR if we converted from HEIC
    if (buffer.length < stats.size || mustSave || isHeic) {
      const saved = (stats.size - buffer.length) / 1024 / 1024;

      // Determine output path (change extension if HEIC)
      const dir = path.dirname(filePath);
      const { name } = path.parse(filePath);
      const newPath = isHeic ? path.join(dir, `${name}.jpg`) : filePath;

      await fs.writeFile(newPath, buffer);

      // CRITICAL: Preserve file modification time (creation date for the game)
      await fs.utimes(newPath, stats.atime, stats.mtime);

      if (isHeic) {
        // Remove original HEIC file
        await fs.unlink(filePath);
        console.log(
          `  [Converted] HEIC -> JPG. Saved ${(buffer.length / 1024 / 1024).toFixed(2)} MB. Original deleted.`,
        );
      } else {
        console.log(
          `  [Optimized] Saved ${saved.toFixed(2)} MB (${((buffer.length / stats.size) * 100).toFixed(0)}% of original)${mustSave ? " (Orientation Fixed)" : ""}`,
        );
      }
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
    const ext = path.extname(filePath).toLowerCase();

    // Optimize if large OR if it is a HEIC file (always convert HEIC)
    if (stats.size > LARGE_FILE_THRESHOLD || ext === ".heic") {
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
            (ext === ".png" ||
              ext === ".jpg" ||
              ext === ".jpeg" ||
              ext === ".heic") &&
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

async function main() {
  console.log("Starting Asset Optimization...");

  const targetArg = process.argv[2];

  if (targetArg) {
    const targetPath = path.resolve(targetArg);
    console.log(`--- Scanning Targeted Directory: ${targetPath} ---`);
    await scanAndOptimize(targetPath);
  } else {
    // Default Behavior: Scan known project directories

    // 1. Optimize Game Assets (All images)
    console.log("--- Scanning Game Assets (public/assets) ---");
    await scanAndOptimize(ASSETS_DIR);

    // 2. Optimize ALL Photo Reward Assets (Backgrounds + Memories)
    console.log("\n--- Scanning All Photo Arena Assets (photos/) ---");
    await scanAndOptimize(PHOTOS_DIR);
  }

  console.log("\nOptimization complete.");
}

main().catch((err) => console.error("Fatal error:", err));
