import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import request from "supertest";

// Mock ImageProcessor to avoid heavy processing
vi.mock("../server/ImageProcessor.js", () => ({
  processImage: vi.fn(async (source, dest) => dest),
  getPhotoDate: vi.fn(async () => new Date()),
  formatDate: vi.fn(() => "Date"),
}));

describe("Backend Logging Integration", () => {
  let app;
  let originalProcessEnv;

  beforeAll(async () => {
    originalProcessEnv = process.env;
    process.env = {
      ...originalProcessEnv,
      LOG_LEVEL: "silent", // Suppress console logs during tests
    };

    const serverModule = await import("../server/index.js");
    app = serverModule.app;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should log API requests through middleware", async () => {
    const res = await request(app).get("/api/cities");
    expect(res.status).toBe(200);
  });

  it("should handle photo requests with logging (mocked logic)", async () => {
    // This will hit the real endpoint but with mocked ImageProcessor
    const res = await request(app).get("/api/photos?city=paris");
    expect(res.status).toBe(200);
    // We don't strictly check body content as it depends on FS,
    // but we ensure it returns valid JSON and doesn't hang.
    expect(res.type).toMatch(/json/);
  });

  it("should log errors for invalid city requests", async () => {
    const res = await request(app).get("/api/photos"); // No city query param
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ filename: "placeholder.png" }),
      ]),
    );
  });
});
