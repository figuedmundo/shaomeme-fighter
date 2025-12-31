import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { processImage, getPhotoDate, formatDate } from "./ImageProcessor.js"; // Import ImageProcessor
import UnifiedLogger from "../src/utils/Logger.js";
import { updatePhotoDate } from "./dateUpdater.js";

const logger = new UnifiedLogger("Backend");
if (process.env.LOG_LEVEL) {
  logger.level = process.env.LOG_LEVEL;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Configuration: Path to photos and cache
const PHOTOS_DIR = process.env.PHOTOS_DIR || path.join(__dirname, "../photos");
const CACHE_DIR = process.env.CACHE_DIR || path.join(__dirname, "../cache");

// Ensure photos and cache dirs exist (Top-level await)
try {
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
  await fs.mkdir(CACHE_DIR, { recursive: true });
} catch (err) {
  logger.error("Failed to ensure directories exist:", err);
}

// Serve static photos and cache
app.use("/photos", express.static(PHOTOS_DIR));
app.use("/cache", express.static(CACHE_DIR));

// Soundtracks Directory
const SOUNDTRACKS_DIR = path.resolve("public/assets/audio/soundtracks");
// Ensure it exists
try {
  await fs.mkdir(SOUNDTRACKS_DIR, { recursive: true });
} catch (err) {
  logger.error("Failed to create soundtracks dir:", err);
}

// Placeholder response for invalid/missing city
const PLACEHOLDER_IMAGE = [
  {
    url: "/resources/logo.png",
    filename: "placeholder.png",
    type: "image/png",
  },
];

// API to list soundtracks
app.get("/api/soundtracks", async (req, res) => {
  try {
    const files = await fs.readdir(SOUNDTRACKS_DIR);
    const supportedExtensions = [".mp3", ".m4a", ".wav", ".ogg"];

    const audioFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });

    logger.info(`Found ${audioFiles.length} soundtracks`);
    res.json(audioFiles);
  } catch (err) {
    logger.error("Error scanning soundtracks:", err);
    res.json([]);
  }
});

// API to list photos
app.get("/api/photos", async (req, res) => {
  const { city } = req.query;

  // Sanitize city name if provided
  const sanitizedCity = city ? city.replace(/[^a-zA-Z0-9_-]/g, "") : "";
  const targetDir = path.join(PHOTOS_DIR, sanitizedCity);

  if (!city) {
    return res.json(PLACEHOLDER_IMAGE);
  }

  try {
    // Check if directory exists
    try {
      await fs.access(targetDir);
    } catch {
      return res.json(PLACEHOLDER_IMAGE);
    }

    const files = await fs.readdir(targetDir);

    // Load notes if they exist
    let notes = {};
    try {
      const notesPath = path.join(targetDir, "notes.json");
      const notesData = await fs.readFile(notesPath, "utf8");
      notes = JSON.parse(notesData);
    } catch (e) {
      // No notes found, ignore
    }

    // Filter for supported extensions
    const supportedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".heic",
      ".heif",
      ".webp",
    ];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });

    // 3. Process images
    const processedImages = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of imageFiles) {
      const sourcePath = path.join(targetDir, filename);
      const cacheFilename = `${path.parse(filename).name}.webp`;
      const cachePath = path.join(CACHE_DIR, sanitizedCity, cacheFilename);

      try {
        // Check cache and process if needed
        let cacheIsValid = false;
        try {
          // eslint-disable-next-line no-await-in-loop
          const cacheStats = await fs.stat(cachePath);
          // eslint-disable-next-line no-await-in-loop
          const sourceStats = await fs.stat(sourcePath);

          // Cache is valid if it exists AND is newer than source
          if (cacheStats.mtime > sourceStats.mtime) {
            cacheIsValid = true;
            logger.debug(`Cache hit for: ${cachePath}`);
          } else {
            logger.debug(`Cache stale for: ${cachePath}`);
          }
        } catch (error) {
          logger.debug(`Cache miss for: ${cachePath}`);
        }

        if (!cacheIsValid) {
          logger.debug(`Processing: ${cachePath}`);
          // eslint-disable-next-line no-await-in-loop
          await processImage(cachePath, sourcePath);
        }

        // eslint-disable-next-line no-await-in-loop
        const dateObj = await getPhotoDate(sourcePath);
        const date = dateObj ? formatDate(dateObj) : null;
        const isoDate = dateObj ? dateObj.toISOString() : null;

        const isBackground =
          path.parse(filename).name.toLowerCase() === "background" ||
          path.parse(filename).name.toLowerCase() === "arena";

        processedImages.push({
          url: `/cache/${sanitizedCity}/${cacheFilename}`,
          filename,
          type: "image/webp",
          isBackground,
          date,
          isoDate,
          note: notes[filename] || null,
        });
      } catch (error) {
        logger.error(`Failed to process ${filename}:`, error);
        // Continue to next image instead of failing everything
      }
    }

    // Filter out any failures
    const validImages = processedImages.filter((img) => img !== null);

    // 4. Handle management-specific data (orphaned notes)
    // If the request comes from the management tool (indicated by a flag or just always included)
    const orphanedNotes = [];
    Object.keys(notes).forEach((filename) => {
      if (!imageFiles.includes(filename)) {
        orphanedNotes.push({
          filename,
          note: notes[filename],
        });
      }
    });

    logger.debug(
      `Found ${validImages.length} images and ${orphanedNotes.length} orphans for city: ${city}`,
    );

    return res.json({
      photos: validImages,
      orphanedNotes,
    });
  } catch (err) {
    logger.error("Failed to scan photos directory:", err);
    return res.status(500).json({ error: "Failed to scan photos directory" });
  }
});

// API to save photo notes (Management Only)
app.post("/api/notes", async (req, res) => {
  const { city, notes } = req.body;

  if (!city || !notes) {
    return res.status(400).json({ error: "City and notes are required" });
  }

  // Sanitize city name
  const sanitizedCity = city.replace(/[^a-zA-Z0-9_-]/g, "");
  const notesPath = path.join(PHOTOS_DIR, sanitizedCity, "notes.json");

  try {
    // Filter out empty notes before saving
    const notesToSave = Object.entries(notes).reduce((acc, [key, value]) => {
      if (value && String(value).trim()) {
        acc[key] = value;
      }
      return acc;
    }, {});

    await fs.writeFile(notesPath, JSON.stringify(notesToSave, null, 2));
    logger.info(
      `Saved notes for city: ${sanitizedCity}. Kept ${Object.keys(notesToSave).length} of ${Object.keys(notes).length} notes.`,
    );
    return res.json({ success: true });
  } catch (err) {
    logger.error(`Failed to save notes for ${sanitizedCity}:`, err);
    return res.status(500).json({ error: "Failed to save notes" });
  }
});

// API to update photo date (Management Only)
app.post("/api/photo/date", async (req, res) => {
  const { city, filename, newDate } = req.body;

  if (!city || !filename || !newDate) {
    return res
      .status(400)
      .json({ error: "City, filename, and newDate are required" });
  }

  const sanitizedCity = city.replace(/[^a-zA-Z0-9_-]/g, "");
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "");
  const photoPath = path.join(PHOTOS_DIR, sanitizedCity, sanitizedFilename);
  const notesPath = path.join(PHOTOS_DIR, sanitizedCity, "notes.json");

  try {
    // 1. Update Date & Rename File
    const newFilename = await updatePhotoDate(photoPath, newDate);
    logger.info(
      `Updated date for ${sanitizedFilename} -> ${newFilename} in ${sanitizedCity}`,
    );

    // 2. Migrate Note (if exists)
    if (newFilename !== sanitizedFilename) {
      try {
        let notes = {};
        try {
          const notesData = await fs.readFile(notesPath, "utf8");
          notes = JSON.parse(notesData);
        } catch (e) {
          // No notes or read error, ignore
        }

        if (notes[sanitizedFilename]) {
          notes[newFilename] = notes[sanitizedFilename];
          delete notes[sanitizedFilename];
          await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
          logger.info(
            `Migrated note from ${sanitizedFilename} to ${newFilename}`,
          );
        }
      } catch (noteErr) {
        logger.warn("Failed to migrate note during rename:", noteErr);
      }
    }

    return res.json({
      success: true,
      message: "Date updated and file renamed successfully",
      newFilename,
    });
  } catch (err) {
    logger.error(`Failed to update date for ${sanitizedFilename}:`, err);
    return res
      .status(500)
      .json({ error: "Failed to update date", details: err.message });
  }
});

// API to list available cities (subdirectories) with photo counts
app.get("/api/cities", async (req, res) => {
  try {
    const files = await fs.readdir(PHOTOS_DIR, {
      withFileTypes: true,
    });

    const cities = files
      .filter((dirent) => {
        return (
          dirent.isDirectory() &&
          !dirent.name.startsWith(".") &&
          dirent.name !== "__MACOSX" &&
          dirent.name !== "System Volume Information"
        );
      })
      .map((dirent) => dirent.name);

    // Calculate photo counts for each city
    const citiesWithCounts = await Promise.all(
      cities.map(async (city) => {
        try {
          const cityPath = path.join(PHOTOS_DIR, city);
          const cityFiles = await fs.readdir(cityPath);

          const supportedExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".heic",
            ".heif",
            ".webp",
          ];

          const validPhotos = cityFiles.filter((file) => {
            // const lowerName = file.toLowerCase(); // Unused
            const ext = path.extname(file).toLowerCase();
            const nameWithoutExt = path.parse(file).name.toLowerCase();

            // Check extension
            if (!supportedExtensions.includes(ext)) return false;

            // Exclude backgrounds and arena images (not rewards)
            if (nameWithoutExt === "background" || nameWithoutExt === "arena")
              return false;

            return true;
          });

          return {
            name: city,
            photoCount: validPhotos.length,
          };
        } catch (err) {
          logger.error(`Failed to count photos for ${city}:`, err);
          return { name: city, photoCount: 0 };
        }
      }),
    );

    logger.debug(`Listed ${citiesWithCounts.length} cities with counts`);
    return res.json(citiesWithCounts);
  } catch (err) {
    logger.error("Failed to scan cities:", err);
    return res.status(500).json({ error: "Failed to scan cities" });
  }
});

// Serve static files from dist in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

// Start server only if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    logger.info(
      `Server initialization - PORT: ${PORT}, LOG_LEVEL: ${logger.level}`,
    );
    logger.info(`Server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV === "production") {
      logger.info("Serving production build from ../dist");
    } else {
      logger.info(
        "Development mode: Frontend not served by Express. Use 'npm run dev'.",
      );
    }
    logger.info(`Serving photos from: ${PHOTOS_DIR}`);
  });
}
