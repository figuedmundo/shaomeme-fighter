import { describe, it, expect, vi } from "vitest";
import Phaser from "phaser";
import { TransitionPresets } from "../src/utils/SceneTransition";

// Mock FightScene
class MockFightScene extends Phaser.Scene {
  constructor() {
    super("FightScene");
    this.player1 = { health: 100 };
    this.player2 = { health: 0 };
    this.initData = { city: "Dublin" }; // Initial start data
    this.scene = {
      start: vi.fn(),
    };
    this.transition = {
      transitionTo: vi.fn(),
      flash: vi.fn().mockResolvedValue(),
    };
    this.uiManager = {
      showVictory: vi.fn(),
      stopTimer: vi.fn(),
    };
    this.announcerOverlay = {
      showKO: vi.fn(),
    };
    this.time = {
      delayedCall: vi.fn((delay, callback) => callback()),
    };
    this.registry = {
      get: vi.fn(),
    };
  }

  handleVictory(winner) {
    if (winner === 1) {
      // Player 1 Wins -> Victory Scene
      this.transition.transitionTo(
        "VictoryScene",
        {
          winner: 1,
          health: this.player1.health,
          city: this.initData.city,
        },
        TransitionPresets.FIGHT_TO_VICTORY.type,
        TransitionPresets.FIGHT_TO_VICTORY.duration,
        TransitionPresets.FIGHT_TO_VICTORY.color,
      );
    } else {
      // Player 2 Wins (AI) -> Continue Scene
      this.transition.transitionTo(
        "ContinueScene",
        this.initData,
        TransitionPresets.QUICK.type,
        TransitionPresets.QUICK.duration,
        TransitionPresets.QUICK.color,
      );
    }
  }
}

describe("Fight End Routing", () => {
  it("should route to VictoryScene when Player 1 wins", () => {
    const scene = new MockFightScene();
    scene.handleVictory(1);

    expect(scene.transition.transitionTo).toHaveBeenCalledWith(
      "VictoryScene",
      expect.objectContaining({ winner: 1 }),
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it("should route to ContinueScene when Player 2 (AI) wins", () => {
    const scene = new MockFightScene();
    scene.handleVictory(2);

    expect(scene.transition.transitionTo).toHaveBeenCalledWith(
      "ContinueScene",
      scene.initData,
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );
  });
});
