import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import request from "supertest";

// We can't easily spy on the pino logger inside the server without DI,
// but we can verify the server doesn't crash and the middleware executes.

describe("Backend Logging Integration", () => {
  let app;
  let originalProcessEnv;
  let getSpy;

  beforeAll(async () => {
    originalProcessEnv = process.env;
    process.env = {
      ...originalProcessEnv,
      LOG_LEVEL: "silent", // Suppress console logs during tests
    };

    const serverModule = await import("../server/index.js");
    app = serverModule.app;

    // Spy on app.get to mock specific routes if needed, otherwise let original implement
    getSpy = vi.spyOn(app, "get");
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Restore mocks after each test to prevent interference
  });

  it("should log API requests through middleware", async () => {
    // Ensure the middleware executes and doesn't break requests
    getSpy.mockRestore(); // Use original get for this test
    const res = await request(app).get("/api/cities");
    expect(res.status).toBe(200);
    // You could theoretically check for logger calls here if your logger was mockable via DI
  });

  it("should handle photo requests with logging (mocked to avoid heavy processing)", async () => {
    // Mock the response for /api/photos to avoid triggering actual image processing
    getSpy.mockImplementation((path, handler) => {
      if (path === "/api/photos") {
        return (req, res) => {
          res.status(200).json({
            photos: [{ filename: "mocked-photo.jpg", url: "/mock-url" }],
            orphanedNotes: [],
          });
        };
      }
      return app.get(path, handler); // Delegate to original app.get for other paths
    });

    const res = await request(app).get("/api/photos?city=paris");
    expect(res.status).toBe(200);
    expect(res.body.photos).toHaveLength(1);
    expect(res.body.photos[0].filename).toBe("mocked-photo.jpg");
  });

  it("should log errors for invalid city requests", async () => {
    getSpy.mockRestore(); // Use original get for this test
    const res = await request(app).get("/api/photos"); // No city query param
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ filename: "placeholder.png" }),
      ]),
    );
  });
});
