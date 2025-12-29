import { describe, it, expect, vi, beforeEach } from "vitest";
import AIInputController from "../src/systems/AIInputController";
import { FighterState } from "../src/components/Fighter";

// Mock dependencies
const mockScene = {
  time: { delayedCall: vi.fn() },
  events: { emit: vi.fn() },
};

const mockFighter = {
  x: 100,
  y: 0,
  health: 100,
  currentState: FighterState.IDLE,
  texture: { key: "fighter" },
};

const mockOpponent = {
  x: 300,
  y: 0,
  health: 100,
  currentState: FighterState.IDLE,
};

describe("AIInputController Refactor (Mercy Removal)", () => {
  let aiController;

  beforeEach(() => {
    // Reset mocks
    mockFighter.health = 100;
    mockOpponent.health = 100;
    mockFighter.currentState = FighterState.IDLE;
    mockOpponent.currentState = FighterState.IDLE;
  });

  it("should maintain high confidence when winning (Mercy Removal)", () => {
    // Scenario: AI dominating (100% health vs 10% opponent)
    mockFighter.health = 100;
    mockOpponent.health = 10;

    // Test on Hard difficulty (where mercy usually kicked in)
    aiController = new AIInputController(
      mockScene,
      mockFighter,
      mockOpponent,
      "hard",
    );

    const confidence = aiController.calculateConfidence();
    // (1.0 + (1 - 0.1)) / 2 = 0.95. Previous logic would multiply by 0.7 => 0.665
    // We expect it to stay near 0.95 or clamped to 1.0
    expect(confidence).toBeGreaterThan(0.9);
  });

  it("should return aggressive modifier close to 1.0 for Nightmare", () => {
    aiController = new AIInputController(
      mockScene,
      mockFighter,
      mockOpponent,
      "nightmare",
    );
    // Force personality to aggressive just in case
    aiController.personality = "aggressive";
    // Mock profile to ensure 1.0 base aggression
    aiController.profile = { aggression: 1.0, mistakeChance: 0.0 };
    aiController.confidence = 1.0; // Full confidence

    const modAggression = aiController.getModifiedAggression();
    expect(modAggression).toBeGreaterThanOrEqual(0.95);
  });

  it("should set mistake chance to 0 for Nightmare", () => {
    aiController = new AIInputController(
      mockScene,
      mockFighter,
      mockOpponent,
      "nightmare",
    );
    aiController.profile = { mistakeChance: 0.0 };
    aiController.confidence = 0.5; // Even match

    const mistakeChance = aiController.getModifiedMistakeChance();
    expect(mistakeChance).toBe(0.0);
  });
});
