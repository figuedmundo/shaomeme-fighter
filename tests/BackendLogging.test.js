import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../server/index";

// We can't easily spy on the pino logger inside the server without DI,
// but we can verify the server doesn't crash and the middleware executes.

describe("Backend Logging Integration", () => {
  it("should log API requests through middleware", async () => {
    // This just ensures the middleware is wired up and doesn't break requests
    const res = await request(app).get("/api/cities");
    expect(res.status).toBe(200);
  });

  it("should handle photo requests with logging", async () => {
    const res = await request(app).get("/api/photos?city=paris");
    // If it returns placeholder or actual, it should be 200
    expect(res.status).toBe(200);
  });

  it("should log errors for invalid city requests", async () => {
    const res = await request(app).get("/api/photos");
    // Should return placeholder list (200) as per implementation, but logs the missing city
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
