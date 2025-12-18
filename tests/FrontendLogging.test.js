import { describe, it, expect, vi, beforeEach } from "vitest";
import UnifiedLogger from "../src/utils/Logger";

// Mock pino to verify calls
vi.mock("pino", () => {
  const mockPino = {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    trace: vi.fn(),
    child: vi.fn().mockReturnThis(),
  };
  return {
    default: vi.fn(() => mockPino),
  };
});

describe("Frontend Logging Instrumentation", () => {
  it("should log high-frequency events as verbose (trace)", () => {
    const logger = new UnifiedLogger("Test");
    logger.verbose("Collision check");
    // Verbose maps to trace in pino
    expect(logger.pino.trace).toHaveBeenCalledWith("Collision check");
  });

  it("should support structured data in logs", () => {
    const logger = new UnifiedLogger("Test");
    logger.info("State change", { from: "IDLE", to: "ATTACK" });
    expect(logger.pino.info).toHaveBeenCalledWith("State change", {
      from: "IDLE",
      to: "ATTACK",
    });
  });

  it("should create nested child loggers correctly", () => {
    const logger = new UnifiedLogger("Parent");
    const child = logger.child("Child");
    expect(child.source).toBe("Parent:Child");
  });
});
