import { describe, it, expect } from "vitest";
import rosterConfig from "../src/config/rosterConfig";

describe("Roster Configuration", () => {
  it("should be an array", () => {
    expect(Array.isArray(rosterConfig)).toBe(true);
  });

  it("should have the correct number of characters", () => {
    // 7 characters from gameData.json
    expect(rosterConfig.length).toBe(7);
  });

  it("should have required fields for each character", () => {
    rosterConfig.forEach((char) => {
      expect(char).toHaveProperty("id");
      expect(char).toHaveProperty("displayName");
      expect(char).toHaveProperty("portraitPath");
      expect(char).toHaveProperty("iconPath");
    });
  });

  it("should contain the specific characters requested", () => {
    const ids = rosterConfig.map((c) => c.id);
    expect(ids).toContain("ann");
    expect(ids).toContain("mom");
    expect(ids).toContain("dad");
    expect(ids).toContain("fat");
  });
});
