import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Configuration: Path to photos
const PHOTOS_DIR = process.env.PHOTOS_DIR || path.join(__dirname, "../photos");

// Ensure photos dir exists
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// Serve static photos
app.use("/photos", express.static(PHOTOS_DIR));

// API to list photos
app.get("/api/photos", (req, res) => {
  const { city } = req.query;

  // Determine target directory: root or subdirectory
  let targetDir = PHOTOS_DIR;
  let urlPrefix = "/photos";

  if (city) {
    // Sanitize city name to prevent traversal attacks
    const sanitizedCity = city.replace(/[^a-zA-Z0-9_-]/g, "");
    targetDir = path.join(PHOTOS_DIR, sanitizedCity);
    urlPrefix = `/photos/${sanitizedCity}`;

    if (!fs.existsSync(targetDir)) {
      // For now, if city folder doesn't exist, just return empty list or fallback?
      // Returning empty is safer.
      return res.json([]);
    }
  }

  return fs.readdir(targetDir, (err, files) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      return res.status(500).json({ error: "Failed to scan photos directory" });
    }

    // Filter for images
    const images = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
    });

    // Return full URLs
    // Note: urlPrefix needs to allow for browser to find it.
    const imageUrls = images.map((file) => `${urlPrefix}/${file}`);

    return res.json(imageUrls);
  });
});

// API to list available cities (subdirectories)
app.get("/api/cities", (req, res) => {
  fs.readdir(PHOTOS_DIR, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      return res.status(500).json({ error: "Failed to scan cities" });
    }

    const cities = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return res.json(cities);
  });
});

// Serve static files from dist in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line no-console
    console.log("Serving production build from ../dist");
  } else {
    // eslint-disable-next-line no-console
    console.log(
      "Development mode: Frontend not served by Express. Use 'npm run dev'."
    );
  }
  // eslint-disable-next-line no-console
  console.log(`Serving photos from: ${PHOTOS_DIR}`);
});
