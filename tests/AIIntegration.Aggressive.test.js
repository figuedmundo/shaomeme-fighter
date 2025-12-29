import { describe, it, expect, vi, beforeEach } from "vitest";
import AIInputController from "../src/systems/AIInputController";
import { FighterState } from "../src/components/Fighter";

// Mock Phaser scene with physics
const mockScene = {
  time: { delayedCall: vi.fn(), now: 0 },
  events: { emit: vi.fn(), on: vi.fn(), once: vi.fn(), off: vi.fn() },
  add: { existing: vi.fn() },
  physics: { add: { existing: vi.fn() } },
  anims: { exists: vi.fn(), create: vi.fn(), generateFrameNumbers: vi.fn() },
  input: { keyboard: { checkDown: vi.fn() } },
};

// Mock Fighter implementation to avoid full Phaser dependency issues in unit test env
class MockFighter {
  constructor(scene, x, y, texture) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.currentState = FighterState.IDLE;
    this.texture = { key: texture };
    this.body = {
      blocked: { down: true },
      setSize: vi.fn(),
      setOffset: vi.fn(),
    };
    this.anims = {
      isPlaying: false,
      currentAnim: { key: "idle" },
      play: vi.fn(),
    };
    this.setCollideWorldBounds = vi.fn();
    this.setOrigin = vi.fn();
    this.setScale = vi.fn();
    this.setVelocityX = vi.fn();
    this.setVelocityY = vi.fn();
    this.setFlipX = vi.fn();
    this.play = vi.fn();
    this.on = vi.fn();
    this.once = vi.fn();
  }
}

describe("AI Integration: Aggressive Nightmare", () => {
  let aiController;
  let aiFighter;
  let victimFighter;

  beforeEach(() => {
    aiFighter = new MockFighter(mockScene, 100, 0, "ann");
    victimFighter = new MockFighter(mockScene, 300, 0, "dad");

    aiController = new AIInputController(
      mockScene,
      aiFighter,
      victimFighter,
      "nightmare",
    );
    // Force aggressive personality
    aiController.personality = "aggressive";
  });

  it("should aggressively close distance and attack idle opponent", () => {
    // Simulate 2 seconds of game time
    const iterations = 120; // 60fps * 2s
    let approached = false;
    let attacked = false;

    for (let i = 0; i < iterations; i += 1) {
      aiController.update(i * 16, 16);

      // Simulate movement based on keys (simplified)
      if (aiController.cursorKeys.right.isDown) {
        aiFighter.x += 2;
        approached = true;
      }

      // Check attack signal
      if (aiController.attackKey.isDown) {
        attacked = true;
      }

      // Stop if both happened (optimization)
      if (approached && attacked) break;
    }

    expect(approached).toBe(true);
    expect(attacked).toBe(true);
  });
});
