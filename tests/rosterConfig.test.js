import { describe, it, expect } from "vitest";
import rosterConfig from "../src/config/rosterConfig";

describe("Roster Configuration", () => {
  it("should be an array", () => {
    expect(Array.isArray(rosterConfig)).toBe(true);
  });

  it("should have the correct number of characters", () => {
    // 7 characters as per requirements
    expect(rosterConfig.length).toBe(7);
  });

  it("should have required fields for each character", () => {
    rosterConfig.forEach((character) => {
      expect(character).toHaveProperty("id");
      expect(character).toHaveProperty("displayName");
      expect(character).toHaveProperty("portraitPath");
      expect(character).toHaveProperty("iconPath");
      // spritesheetPath is placeholder for now, maybe optional or required
      // expect(character).toHaveProperty('spritesheetPath');
    });
  });

  it("should contain the specific characters requested", () => {
    const ids = rosterConfig.map((c) => c.id);
    expect(ids).toContain("ann");
    expect(ids).toContain("mom");
    expect(ids).toContain("dad");
    expect(ids).toContain("brother");
    expect(ids).toContain("old_witch");
    expect(ids).toContain("fat");
    expect(ids).toContain("fresway_worker");
  });
});
