import { describe, it, expect, vi, beforeEach } from "vitest";
import AIInputController from "../src/systems/AIInputController";
import { FighterState } from "../src/components/Fighter";

// Mock dependencies
const mockScene = {
  events: { emit: vi.fn() },
  time: { now: 1000 },
};

describe("AI Difficulty Improvement", () => {
  let aiController;
  let me;
  let opponent;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock fighters
    me = {
      x: 100,
      y: 300,
      currentState: FighterState.IDLE,
      health: 100,
      isAttacking: () => me.currentState === FighterState.ATTACK,
      isBlocking: () => me.currentState === FighterState.BLOCK,
      isJumping: () => me.currentState === FighterState.JUMP,
      isCrouching: () => me.currentState === FighterState.CROUCH,
      texture: { key: "ann" },
    };

    opponent = {
      x: 300,
      y: 300,
      currentState: FighterState.IDLE,
      health: 100,
      isAttacking: () => opponent.currentState === FighterState.ATTACK,
      isBlocking: () => opponent.currentState === FighterState.BLOCK,
      isJumping: () => opponent.currentState === FighterState.JUMP,
      isCrouching: () => opponent.currentState === FighterState.CROUCH,
      texture: { key: "dad" },
    };
  });

  describe("Nightmare Difficulty", () => {
    it("should load nightmare configuration from gameData.json", () => {
      aiController = new AIInputController(
        mockScene,
        me,
        opponent,
        "nightmare",
      );
      expect(aiController.profile).toBeDefined();
      expect(aiController.profile.aggression).toBeGreaterThan(0.8);
      expect(aiController.profile.blockRate).toBeGreaterThan(0.8);
      expect(aiController.profile.reactionTime.max).toBeLessThanOrEqual(300);
    });
  });

  describe("Adaptive Difficulty (Confidence Scaling)", () => {
    beforeEach(() => {
      aiController = new AIInputController(mockScene, me, opponent, "medium");
    });

    it("should lower confidence when winning to trigger mercy (Player is losing)", () => {
      // AI is winning (High base confidence)
      me.health = 100;
      opponent.health = 20;

      const confidence = aiController.calculateConfidence();
      // Base would be 0.9, but Mercy (0.7x) makes it 0.63
      expect(confidence).toBeLessThan(0.7);
      expect(confidence).toBeGreaterThan(0.6);
    });

    it("should decrease reaction delay significantly in Nightmare mode when losing", () => {
      aiController = new AIInputController(
        mockScene,
        me,
        opponent,
        "nightmare",
      );

      // AI is losing
      me.health = 20;
      opponent.health = 100;

      const confidence = aiController.calculateConfidence();
      expect(confidence).toBeLessThan(0.3);
    });
  });

  describe("Combos and Action Queue", () => {
    beforeEach(() => {
      aiController = new AIInputController(mockScene, me, opponent, "hard");
    });

    it("should process actions from the action queue", () => {
      aiController.actionQueue = [
        { type: "ATTACK", duration: 100 },
        { type: "IDLE", duration: 100 },
      ];

      aiController.update(1000, 16);
      expect(aiController.currentAction).toBe("ATTACK");
      expect(aiController.attackKey.isDown).toBe(true);

      // Advance past first action duration (100ms)
      aiController.update(1116, 150);
      // After this update, first action is shifted.
      // Second action ("IDLE") is now at index 0.

      // Advance past second action duration (100ms)
      aiController.update(1266, 150);
      expect(aiController.currentAction).toBe("IDLE");
      expect(aiController.actionQueue.length).toBe(0);
    });

    it("should queue a combo when planCombo is called", () => {
      aiController.planCombo();
      expect(aiController.actionQueue.length).toBeGreaterThan(1);
      expect(aiController.actionQueue[0].type).toBe("ATTACK");
    });
  });

  describe("Spacing and Whiff Punishing", () => {
    beforeEach(() => {
      aiController = new AIInputController(mockScene, me, opponent, "hard");
    });

    it("should trigger a whiff punish when opponent misses an attack at a distance", () => {
      // Setup: Opponent is attacking but out of range
      opponent.currentState = FighterState.ATTACK;
      me.x = 100;
      opponent.x = 260; // Just outside range (range is ~140)

      // Mock random to pass aggression check
      const spy = vi.spyOn(Math, "random").mockReturnValue(0);

      aiController.monitorOpponent(16);

      // Should have queued an aggressive reaction
      expect(aiController.actionQueue.length).toBeGreaterThan(0);
      expect(aiController.actionQueue[0].type).toBe("APPROACH");

      spy.mockRestore();
    });
  });

  describe("Wake-up Logic", () => {
    beforeEach(() => {
      aiController = new AIInputController(mockScene, me, opponent, "hard");
    });

    it("should trigger a wake-up decision when transitioning from CRUMPLE to IDLE", () => {
      // 1. Set AI to CRUMPLE
      me.currentState = FighterState.CRUMPLE;
      aiController.update(1000, 16);

      // 2. Set AI back to IDLE (Wake up)
      me.currentState = FighterState.IDLE;

      // Mock random to force an ATTACK reversal
      const spy = vi.spyOn(Math, "random").mockReturnValue(0); // Should trigger first option

      aiController.update(1016, 16);

      // Should have queued something in the actionQueue for wake-up
      expect(aiController.actionQueue.length).toBeGreaterThan(0);

      spy.mockRestore();
    });
  });

  describe("Integrated Difficulty Comparison", () => {
    it("Nightmare AI should be much more active than Easy AI", () => {
      // Set to close range for attack triggers
      me.x = 100;
      opponent.x = 180; // Distance 80 < attackRange (140)

      const easyAI = new AIInputController(mockScene, me, opponent, "easy");
      const nightmareAI = new AIInputController(
        mockScene,
        me,
        opponent,
        "nightmare",
      );

      let easyAttacks = 0;
      let nightmareAttacks = 0;

      // Simulate 100 decision cycles
      for (let i = 0; i < 100; i += 1) {
        // Mock random to be biased towards middle to see difference in thresholds
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        easyAI.makeDecision();
        if (
          easyAI.currentAction === "ATTACK" ||
          easyAI.actionQueue.length > 0
        ) {
          easyAttacks += 1;
        }

        nightmareAI.makeDecision();
        if (
          nightmareAI.currentAction === "ATTACK" ||
          nightmareAI.actionQueue.length > 0
        ) {
          nightmareAttacks += 1;
        }

        vi.restoreAllMocks();
      }

      expect(nightmareAttacks).toBeGreaterThan(easyAttacks);
    });
  });
});
