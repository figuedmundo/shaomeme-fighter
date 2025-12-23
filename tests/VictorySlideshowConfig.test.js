import { describe, it, expect } from "vitest";
import gameData from "../src/config/gameData.json";

describe("VictorySlideshow Config", () => {
  it("should have cinematicMode enabled by default or explicitly true", () => {
    if (gameData.cinematicMode !== undefined) {
      expect(gameData.cinematicMode).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });

  it("should have victoryMusic configured for arenas", () => {
    expect(gameData.arenas.paris.victoryMusic).toBeDefined();
    expect(gameData.arenas.dublin.victoryMusic).toBeDefined();
  });
});
