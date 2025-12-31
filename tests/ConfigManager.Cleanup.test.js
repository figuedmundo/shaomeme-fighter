import { describe, it, expect } from "vitest";
import gameData from "../src/config/gameData.json";

describe("Config Integrity", () => {
  it("should not contain victoryMusic in arena definitions", () => {
    Object.values(gameData.arenas).forEach((arena) => {
      expect(arena).not.toHaveProperty("victoryMusic");
    });
  });
});
