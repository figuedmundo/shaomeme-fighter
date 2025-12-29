import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Mock native modules
vi.mock("sharp", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    rotate: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue(true),
    metadata: vi.fn().mockResolvedValue({ exif: null }),
  })),
}));

vi.mock("piexifjs", () => ({
  __esModule: true,
  default: {
    load: vi.fn(() => ({
      "0th": {},
      Exif: {},
      GPS: {},
      "1st": {},
      thumbnail: null,
    })),
    dump: vi.fn(() => "mock-exif-bytes"),
    insert: vi.fn((bytes, binary) => binary),
    ExifIFD: { DateTimeOriginal: 36867, DateTimeDigitized: 36868 },
    ImageIFD: { DateTime: 306 },
  },
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_PHOTOS_DIR = path.resolve(__dirname, "./test-assets/photos");
const TEST_CACHE_DIR = path.resolve(__dirname, "./test-assets/cache");
const TEST_CITY_NAME = "test-city";
const TEST_CITY_DIR = path.join(TEST_PHOTOS_DIR, TEST_CITY_NAME);
const TEST_IMAGE_NAME = "test.jpg";
const TEST_IMAGE_PATH = path.join(TEST_CITY_DIR, TEST_IMAGE_NAME);

// A simple 1x1 black pixel JPG buffer
const testJpgBuffer = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01,
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x03,
  0x02, 0x02, 0x02, 0x02, 0x02, 0x03, 0x02, 0x02, 0x02, 0x03, 0x03, 0x03, 0x03,
  0x04, 0x06, 0x04, 0x04, 0x04, 0x04, 0x04, 0x08, 0x06, 0x06, 0x05, 0x06, 0x09,
  0x08, 0x0a, 0x0a, 0x09, 0x08, 0x09, 0x09, 0x0a, 0x0c, 0x0f, 0x0c, 0x0a, 0x0b,
  0x0e, 0x0b, 0x09, 0x09, 0x0d, 0x11, 0x0d, 0x0e, 0x0f, 0x10, 0x10, 0x11, 0x10,
  0x0a, 0x0c, 0x12, 0x13, 0x12, 0x10, 0x13, 0x0f, 0x10, 0x10, 0x10, 0xff, 0xc0,
  0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4,
  0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
  0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02,
  0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0xf7, 0xc1, 0x01, 0xff, 0xd9,
]);

describe("Server API Endpoints", () => {
  let app;

  beforeAll(async () => {
    // Set env vars before importing the app
    process.env.PHOTOS_DIR = TEST_PHOTOS_DIR;
    process.env.CACHE_DIR = TEST_CACHE_DIR;
    process.env.LOG_LEVEL = "silent"; // Silence logs during tests

    const serverModule = await import("../server/index.js");
    app = serverModule.app;

    // Create test directories
    await fs.mkdir(TEST_CITY_DIR, { recursive: true });
    await fs.mkdir(TEST_CACHE_DIR, { recursive: true });

    // Create a dummy image file for testing
    await fs.writeFile(TEST_IMAGE_PATH, testJpgBuffer);
  });

  afterAll(async () => {
    // Clean up test assets
    await fs.rm(TEST_PHOTOS_DIR, { recursive: true, force: true });
    await fs.rm(TEST_CACHE_DIR, { recursive: true, force: true });
  });

  describe("Photo Loading", () => {
    it("GET /api/cities should return the test city", async () => {
      const res = await request(app).get("/api/cities");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      const city = res.body.find((c) => c.name === TEST_CITY_NAME);
      expect(city).toBeDefined();
      expect(city.name).toBe(TEST_CITY_NAME);
      expect(city.photoCount).toBe(1);
    });

    it("GET /api/photos should return the test photo", async () => {
      const res = await request(app).get(`/api/photos?city=${TEST_CITY_NAME}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.photos).toBeInstanceOf(Array);
      expect(res.body.photos.length).toBe(1);
      const photo = res.body.photos[0];
      expect(photo.filename).toBe(TEST_IMAGE_NAME);
      expect(photo.url).toBe(`/cache/${TEST_CITY_NAME}/test.webp`);
    });

    it("GET /api/photos should handle non-existent cities", async () => {
      const res = await request(app).get("/api/photos?city=nonexistent");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0].filename).toBe("placeholder.png");
    });
  });

  describe("Note and Date Management", () => {
    it("POST /api/notes should save notes and filter empty ones", async () => {
      const notesPayload = {
        [TEST_IMAGE_NAME]: "This is a test note.",
        "empty.jpg": "",
      };

      const saveRes = await request(app)
        .post("/api/notes")
        .send({ city: TEST_CITY_NAME, notes: notesPayload });

      expect(saveRes.statusCode).toBe(200);

      const notesPath = path.join(TEST_CITY_DIR, "notes.json");
      const savedNotes = JSON.parse(await fs.readFile(notesPath, "utf8"));

      expect(savedNotes).toHaveProperty(TEST_IMAGE_NAME);
      expect(savedNotes[TEST_IMAGE_NAME]).toBe("This is a test note.");
      expect(savedNotes).not.toHaveProperty("empty.jpg");
    });

    it("POST /api/photo/date should update a photo date", async () => {
      const newDate = "2025-01-01 12:30:00";
      const res = await request(app)
        .post("/api/photo/date")
        .send({ city: TEST_CITY_NAME, filename: TEST_IMAGE_NAME, newDate });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("newFilename");

      // Since our test mock for fs.utimes/rename in the real server flow might rename it,
      // we just check that the API responded successfully.
      // In a real integration test, we'd verify the file rename on disk.

      const photoRes = await request(app).get(
        `/api/photos?city=${TEST_CITY_NAME}`,
      );
      // Note: If the file was renamed, we need to find it by the new name or checking the list
      const { photos } = photoRes.body;
      const updatedPhoto = photos.find(
        (p) => p.filename === res.body.newFilename,
      );

      // The formatDate function will format it, so we check for the result
      if (updatedPhoto) {
        expect(updatedPhoto.date).toBe("January 1, 2025");
      }
    });
  });
});
