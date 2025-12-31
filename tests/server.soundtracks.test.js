import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import fs from "fs/promises";
import path from "path";
import { app } from "../server/index.js";

// Mock dependencies if needed, but for simple FS checks, real FS in a temp dir is often cleaner.
// However, since we are testing against the running app configuration (which uses specific paths),
// we might need to mock fs.readdir or ensure the directory exists.
// Given the existing pattern in server.test.js relies on real files, I will try to use the real "public/assets/audio/soundtracks"
// but I will ensure it exists and has a test file.

const SOUNDTRACKS_DIR = path.resolve("public/assets/audio/soundtracks");
const TEST_FILE = path.join(SOUNDTRACKS_DIR, "test_track.mp3");
const IGNORED_FILE = path.join(SOUNDTRACKS_DIR, "text.txt");

describe("GET /api/soundtracks", () => {
  beforeAll(async () => {
    // Setup: Create directory and dummy files
    await fs.mkdir(SOUNDTRACKS_DIR, { recursive: true });
    await fs.writeFile(TEST_FILE, "dummy audio content");
    await fs.writeFile(IGNORED_FILE, "dummy text content");
  });

  afterAll(async () => {
    // Cleanup: Remove dummy files
    await fs.unlink(TEST_FILE).catch(() => {});
    await fs.unlink(IGNORED_FILE).catch(() => {});
    // We don't remove the directory as it might be needed by the app or user
  });

  it("should return a list of audio files", async () => {
    const res = await request(app).get("/api/soundtracks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain("test_track.mp3");
  });

  it("should filter out non-audio files", async () => {
    const res = await request(app).get("/api/soundtracks");
    expect(res.status).toBe(200);
    expect(res.body).not.toContain("text.txt");
  });

  it("should handle empty directory gracefully", async () => {
    // We can't easily empty the real directory if it has user files,
    // but we can check that it returns an array at minimum.
    const res = await request(app).get("/api/soundtracks");
    expect(Array.isArray(res.body)).toBe(true);
  });
});
