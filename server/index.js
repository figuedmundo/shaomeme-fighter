import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { processImage } from "./ImageProcessor.js"; // Import ImageProcessor
import UnifiedLogger from "../src/utils/Logger.js";

const logger = new UnifiedLogger("Backend");
if (process.env.LOG_LEVEL) {
  logger.level = process.env.LOG_LEVEL;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

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

// Ensure photos dir exists
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// Ensure cache dir exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Serve static photos and cache
app.use("/photos", express.static(PHOTOS_DIR));
app.use("/cache", express.static(CACHE_DIR));

// Placeholder response for invalid/missing city
const PLACEHOLDER_IMAGE = [
  {
    url: "/resources/logo.png",
    filename: "placeholder.png",
    type: "image/png",
  },
];

// API to list photos
app.get("/api/photos", async (req, res) => {
  const { city } = req.query;

  // Sanitize city name if provided
  const sanitizedCity = city ? city.replace(/[^a-zA-Z0-9_-]/g, "") : "";
  const targetDir = path.join(PHOTOS_DIR, sanitizedCity);

  // Return placeholder if city is missing or directory doesn't exist
  if (!city || !fs.existsSync(targetDir)) {
    return res.json(PLACEHOLDER_IMAGE);
  }

  try {
    const files = await fs.promises.readdir(targetDir);

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

    // Process images in parallel
    const processedImages = await Promise.all(
      imageFiles.map(async (filename) => {
        const sourcePath = path.join(targetDir, filename);
        // Create a unique cache filename (e.g., maintain original name but .webp)
        const cacheFilename = `${path.parse(filename).name}.webp`;
        // Maintain city structure in cache
        const cachePath = path.join(CACHE_DIR, sanitizedCity, cacheFilename);

        try {
          await processImage(sourcePath, cachePath);
          return {
            url: `/cache/${sanitizedCity}/${cacheFilename}`,
            filename,
            type: "image/webp",
          };
        } catch (error) {
          logger.error(`Failed to process ${filename}:`, error);
          return null;
        }
      }),
    );

    // Filter out any failures
    const validImages = processedImages.filter((img) => img !== null);
    logger.debug(`Found ${validImages.length} valid images for city: ${city}`);

    return res.json(validImages);
  } catch (err) {
    logger.error("Failed to scan photos directory:", err);
    return res.status(500).json({ error: "Failed to scan photos directory" });
  }
});

// API to list available cities (subdirectories)
app.get("/api/cities", async (req, res) => {
  try {
    const files = await fs.promises.readdir(PHOTOS_DIR, {
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

    logger.debug(`Listed ${cities.length} cities`);
    return res.json(cities);
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
