import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../server/index.js";

// Mock processImage to avoid actual image processing overhead/sharp issues
vi.mock("../server/ImageProcessor.js", () => ({
  processImage: vi.fn(async (source, dest) => dest),
}));

describe("Server API Integration", () => {
  it("GET /api/cities should return a list of cities", async () => {
    const res = await request(app).get("/api/cities");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // We know 'paris' exists in the repo, now returned as object { name: 'paris', ... }
    const paris = res.body.find((c) => c.name === "paris");
    expect(paris).toBeDefined();
  });

  it("GET /api/photos?city=paris should return processed images", async () => {
    const res = await request(app).get("/api/photos?city=paris");
    expect(res.status).toBe(200);
    expect(res.body.photos).toBeDefined();
    expect(Array.isArray(res.body.photos)).toBe(true);
    // Assuming photos/paris has files.
    expect(res.body.photos.length).toBeGreaterThan(0);

    const image = res.body.photos[0];
    expect(image).toHaveProperty("url");
    expect(image).toHaveProperty("filename");
    expect(image).toHaveProperty("type");
    // The server logic forces image/webp
    expect(image.type).toBe("image/webp");
  });

  it("GET /api/photos?city=invalid should return placeholder", async () => {
    const res = await request(app).get("/api/photos?city=invalid_city_name");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].filename).toBe("placeholder.png");
  });

  it("GET /api/photos (missing city) should return placeholder", async () => {
    const res = await request(app).get("/api/photos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].filename).toBe("placeholder.png");
  });
});
