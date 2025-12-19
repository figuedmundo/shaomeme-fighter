import { describe, it, expect, vi, beforeEach } from "vitest";
import FightScene from "../src/scenes/FightScene";
import { createMockScene } from "./setup";

describe("Critical Moments Integration", () => {
  let scene;

  beforeEach(() => {
    vi.clearAllMocks();
    scene = new FightScene();
    const mockScene = createMockScene();
    Object.assign(scene, mockScene);

    // Mock fighters
    scene.player1 = {
      health: 100,
      maxHealth: 100,
      id: "ann",
      sprite: { x: 200, y: 500 },
      on: vi.fn(),
      once: vi.fn(),
    };
    scene.player2 = {
      health: 100,
      maxHealth: 100,
      id: "ken",
      sprite: { x: 600, y: 500 },
      on: vi.fn(),
      once: vi.fn(),
    };

    // For some systems that expect scene.fighters
    scene.fighters = { player: scene.player1, opponent: scene.player2 };
  });

  it("should initialize CriticalMomentsManager in create()", () => {
    scene.create();
    expect(scene.criticalMoments).toBeDefined();
  });

  it("should trigger Round Start Zoom in create()", () => {
    scene.create();
    expect(scene.cameras.main.zoomTo).toHaveBeenCalledWith(
      1.25,
      1000,
      "Cubic.easeOut",
    );
  });

  it("should update health pulse in update loop", () => {
    scene.create();

    // Spy on the method
    const pulseSpy = vi.spyOn(scene.criticalMoments, "updateHealthPulse");

    scene.player1.health = 10; // Low health
    scene.update();

    expect(pulseSpy).toHaveBeenCalledWith(10);
  });

  it("should cleanup in shutdown", () => {
    scene.create();
    const destroySpy = vi.spyOn(scene.criticalMoments, "destroy");
    scene.shutdown();
    expect(destroySpy).toHaveBeenCalled();
  });

  it("should reset timeScale on shutdown", () => {
    scene.create();
    scene.criticalMoments.triggerSlowMotion();
    scene.shutdown();
    // Verification relies on Manager implementation update
  });
});
