import { describe, it, expect } from "vitest";
import ConfigManager from "../src/config/ConfigManager";

describe("ConfigManager Aggressive Overhaul", () => {
  it("should return updated Hard difficulty values", () => {
    const config = ConfigManager.getDifficultyConfig("hard");
    // aggression 0.9, reactionTime 150-250ms, mistakeChance 0.05
    expect(config.aggression).toBe(0.9);
    expect(config.reactionTime.min).toBe(150);
    expect(config.reactionTime.max).toBe(250);
    expect(config.mistakeChance).toBe(0.05);
  });

  it("should return updated Nightmare difficulty values", () => {
    const config = ConfigManager.getDifficultyConfig("nightmare");
    // aggression 1.0, reactionTime 0-50ms, mistakeChance 0.0
    expect(config.aggression).toBe(1.0);
    expect(config.reactionTime.min).toBe(0);
    expect(config.reactionTime.max).toBe(50);
    expect(config.mistakeChance).toBe(0.0);
  });

  it("should verify all roster members are aggressive", () => {
    const roster = ConfigManager.getRoster();
    roster.forEach((fighter) => {
      expect(fighter.personality).toBe("aggressive");
    });
  });

  it("should return default difficulty as nightmare", () => {
    expect(ConfigManager.getDefaultDifficulty()).toBe("nightmare");
  });
});
