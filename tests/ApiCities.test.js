import request from "supertest";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { app } from "../server/index.js";

// Mock filesystem
const mockPhotosDir = path.join(__dirname, "mock_photos_api_test");

describe("GET /api/cities", () => {
  beforeAll(() => {
    // Setup mock directories and files
    if (fs.existsSync(mockPhotosDir)) {
      fs.rmSync(mockPhotosDir, { recursive: true, force: true });
    }
    fs.mkdirSync(mockPhotosDir, { recursive: true });

    // 1. City with photos (Paris)
    const parisDir = path.join(mockPhotosDir, "paris");
    fs.mkdirSync(parisDir);
    fs.writeFileSync(path.join(parisDir, "photo1.jpg"), "fake content");
    fs.writeFileSync(path.join(parisDir, "photo2.png"), "fake content");
    fs.writeFileSync(path.join(parisDir, "background.png"), "fake content"); // Should be ignored in count? Spec says "exclude system files like background.png... only count valid photo extensions that are NOT backgrounds"

    // 2. City with NO photos (Tokyo) - empty folder
    const tokyoDir = path.join(mockPhotosDir, "tokyo");
    fs.mkdirSync(tokyoDir);

    // 3. City with ONLY background (London) - should have count 0
    const londonDir = path.join(mockPhotosDir, "london");
    fs.mkdirSync(londonDir);
    fs.writeFileSync(path.join(londonDir, "background.png"), "fake content");
    fs.writeFileSync(path.join(londonDir, "arena.png"), "fake content");

    // 4. City with mixed content (Dublin)
    const dublinDir = path.join(mockPhotosDir, "dublin");
    fs.mkdirSync(dublinDir);
    fs.writeFileSync(path.join(dublinDir, "view.jpg"), "fake content");
    fs.writeFileSync(path.join(dublinDir, ".DS_Store"), "fake content"); // System file

    // Mock process.env.PHOTOS_DIR logic is tricky with ES modules re-import.
    // Instead, we might need to rely on the server using the actual dir or mocking fs.promises.readdir
    // BUT since we can't easily change the const PHOTOS_DIR inside the running server module without specialized mocking,
    // We will spy on fs.promises.readdir.
  });

  afterAll(() => {
    // Cleanup
    if (fs.existsSync(mockPhotosDir)) {
      fs.rmSync(mockPhotosDir, { recursive: true, force: true });
    }
  });

  it("should return a list of cities with photo counts", async () => {
    // We need to mock fs.promises.readdir to return our structure because the server uses a hardcoded or env-based path.
    // However, vitest mocking of built-in modules can be complex with top-level awaits in ESM.
    // A simpler approach for this specific test might be to verify the *logic* if we can extract it,
    // or assume the server reads from the env var if we set it before import?
    // The server reads PHOTOS_DIR at top level.

    // Let's try mocking fs.promises.readdir completely to simulate the structure regardless of actual path.

    const mockReaddir = vi
      .spyOn(fs.promises, "readdir")
      .mockImplementation(async (dirPath, options) => {
        // If listing the root photos dir
        if (!dirPath.includes(path.sep)) return []; // Fallback

        // Return Mock Cities List
        if (options && options.withFileTypes) {
          return [
            { name: "paris", isDirectory: () => true },
            { name: "tokyo", isDirectory: () => true },
            { name: "london", isDirectory: () => true },
            { name: "dublin", isDirectory: () => true },
            { name: "file.txt", isDirectory: () => false },
          ];
        }

        // Return files for specific cities
        if (dirPath.endsWith("paris"))
          return ["photo1.jpg", "photo2.png", "background.png"];
        if (dirPath.endsWith("tokyo")) return [];
        if (dirPath.endsWith("london")) return ["background.png", "arena.png"];
        if (dirPath.endsWith("dublin")) return ["view.jpg", ".DS_Store"];

        return [];
      });

    const res = await request(app).get("/api/cities");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Check format
    const paris = res.body.find((c) => c.name === "paris");
    expect(paris).toBeDefined();
    expect(paris).toHaveProperty("photoCount");

    // Paris: 2 photos (photo1.jpg, photo2.png) - background.png excluded
    expect(paris.photoCount).toBe(2);

    // Tokyo: 0 photos
    const tokyo = res.body.find((c) => c.name === "tokyo");
    expect(tokyo.photoCount).toBe(0);

    // London: 0 photos (only background/arena)
    const london = res.body.find((c) => c.name === "london");
    expect(london.photoCount).toBe(0);

    // Dublin: 1 photo (view.jpg) - .DS_Store excluded
    const dublin = res.body.find((c) => c.name === "dublin");
    expect(dublin.photoCount).toBe(1);

    mockReaddir.mockRestore();
  });
});
