import { describe, it, expect, vi, beforeEach } from "vitest";
import ConfigManager from "../src/config/ConfigManager";
import gameData from "../src/config/gameData.json";

describe("Difficulty Config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have a combat config in gameData", () => {
    expect(gameData.combat).toBeDefined();
  });

  it("should retrieve combat stats from ConfigManager", () => {
    // We expect these stats to be added to gameData.json
    // Mocking the data if it hasn't been added yet won't work for integration tests,
    // but ConfigManager just reads from the imported JSON.
    // For TDD, we expect this to fail initially if the keys are missing.

    // We will verify the structure AFTER implementation of 1.2
    // But here we define what we WANT.

    // Note: ConfigManager uses the live gameData.json file.
    // We can check if getCombatConfig returns the object.
    const combat = ConfigManager.getCombatConfig();
    expect(combat).toBeDefined();
  });

  it("should have global stats defined in combat config", () => {
    const combat = ConfigManager.getCombatConfig();
    // These specific keys are required by Spec 1.2
    expect(combat.global).toBeDefined();
    expect(combat.global.walkSpeed).toBe(160);
    expect(combat.global.jumpPower).toBe(-600);
    expect(combat.global.attackDamage).toBe(10);
    expect(combat.global.maxHealth).toBe(100);
  });

  it("should have difficulty profiles defined", () => {
    // Method to be added: ConfigManager.getDifficultyProfiles() or via getGameConfig
    // Assuming we access via gameData directly or a new getter
    // Let's add a getter to ConfigManager for difficulties

    // For now, let's assume it's under 'difficulty' in gameData
    // We'll update ConfigManager to expose it
    const difficulties = ConfigManager.data.difficulty;
    expect(difficulties).toBeDefined();
    expect(difficulties.easy).toBeDefined();
    expect(difficulties.medium).toBeDefined();
    expect(difficulties.hard).toBeDefined();

    expect(difficulties.medium.aggression).toBeDefined();
  });
});
