import { describe, it, expect, vi, beforeEach } from "vitest";
import UnifiedLogger, { log } from "../src/utils/Logger";

describe("UnifiedLogger", () => {
  it("should be defined and have standard levels", () => {
    expect(log).toBeDefined();
    expect(typeof log.info).toBe("function");
    expect(typeof log.error).toBe("function");
    expect(typeof log.debug).toBe("function");
    expect(typeof log.verbose).toBe("function");
  });

  it("should allow creating child loggers with prefixes", () => {
    const child = log.child("Test");
    expect(child.source).toBe("App:Test");
  });

  it("should allow setting and checking log levels", () => {
    const testLogger = new UnifiedLogger("TestLevel");
    testLogger.level = "error";
    expect(testLogger.level).toBe("error");

    // Test that it doesn't crash on standard calls
    testLogger.error("This is an error");
    testLogger.info("This should be filtered but not crash");
  });
});
