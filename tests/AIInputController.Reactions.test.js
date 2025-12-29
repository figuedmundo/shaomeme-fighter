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
  x: 200, // Close enough (range < 250)
  y: 0,
  health: 100,
  currentState: FighterState.IDLE,
  isAttacking: false,
};

describe("AIInputController God Reflexes", () => {
  let aiController;

  beforeEach(() => {
    // Reset mocks
    mockFighter.currentState = FighterState.IDLE;
    mockOpponent.currentState = FighterState.IDLE;
    mockOpponent.isAttacking = false;
  });

  it("should instantly block on attack startup (Nightmare)", () => {
    aiController = new AIInputController(
      mockScene,
      mockFighter,
      mockOpponent,
      "nightmare",
    );

    // Simulate opponent starting an attack
    mockOpponent.currentState = FighterState.ATTACK;
    mockOpponent.isAttacking = true;

    // Run update logic (which triggers monitorOpponent)
    aiController.update(0, 16);

    // AI should immediately switch action to BLOCK
    expect(aiController.currentAction).toBe("BLOCK");
    expect(aiController.cursorKeys.left.isDown).toBe(true); // Retreat/Block (Away from opponent)
  });

  it("should whiff punish when opponent misses (Nightmare)", () => {
    aiController = new AIInputController(
      mockScene,
      mockFighter,
      mockOpponent,
      "nightmare",
    );

    // Opponent attacks but is far away (whiff range)
    mockOpponent.x = 400; // > 140, < 250 from 100? No, 400-100=300. Too far.
    // Let's put opponent at 300. 300-100 = 200. Ideal whiff range.
    mockOpponent.x = 300;
    mockOpponent.currentState = FighterState.ATTACK;

    aiController.update(0, 16);

    // Should queue approach + attack
    expect(aiController.actionQueue.length).toBeGreaterThan(0);
    expect(aiController.actionQueue[0].type).toBe("APPROACH");
    expect(aiController.actionQueue[1].type).toBe("ATTACK");
  });

  it("should trigger wake-up pressure on knockdown", () => {
    aiController = new AIInputController(
      mockScene,
      mockFighter,
      mockOpponent,
      "nightmare",
    );

    // Opponent is knocked down
    mockOpponent.currentState = FighterState.CRUMPLE;

    aiController.update(0, 16);

    // Should queue wake-up pressure (Approach + Attack)
    expect(aiController.actionQueue.length).toBeGreaterThan(0);
    expect(aiController.actionQueue[0].type).toBe("APPROACH");
    // Depending on logic, it might be waiting or moving first
  });
});
