import { describe, it, expect } from "vitest";
import ConfigManager from "../src/config/ConfigManager";

describe("ConfigManager Full Body Roster Extension", () => {
  it("should have fullBodyPath for all characters in the roster", () => {
    const roster = ConfigManager.getRoster();
    roster.forEach((character) => {
      expect(character).toHaveProperty("fullBodyPath");
      expect(typeof character.fullBodyPath).toBe("string");
      expect(character.fullBodyPath.length).toBeGreaterThan(0);
    });
  });

  it("should return the fullBodyPath when getting a specific character", () => {
    const roster = ConfigManager.getRoster();
    const firstCharId = roster[0].id;
    const character = ConfigManager.getCharacter(firstCharId);
    expect(character.fullBodyPath).toBeDefined();
  });
});
