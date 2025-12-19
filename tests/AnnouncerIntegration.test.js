import { describe, it, expect, vi, beforeEach } from "vitest";
import FightScene from "../src/scenes/FightScene";
import { createMockScene } from "./setup";

describe("Announcer Integration", () => {
  let scene;
  let mockAudioManager;

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
    scene.fighters = { player: scene.player1, opponent: scene.player2 };

    // Registry / AudioManager
    mockAudioManager = {
      playAnnouncer: vi.fn(),
      playImpact: vi.fn(),
      playHitReaction: vi.fn(),
      playKO: vi.fn(),
      playStageMusic: vi.fn(),
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    };
    scene.registry.get.mockReturnValue(mockAudioManager);

    // Initialize Scene
    scene.init({});
    scene.create();
  });

  it("should initialize overlays in create()", () => {
    expect(scene.announcerOverlay).toBeDefined();
    // Combo overlay replaced by UIManager
    // expect(scene.comboOverlay).toBeDefined();
  });

  it("should run round start sequence", () => {
    // Trigger the delayed calls for Round 1 and Fight
    // Expect 2 delayed calls (Round 1 at 500ms, Fight at 2000ms)

    // We need to find the callbacks. create() was called in beforeEach.
    // scene.time.delayedCall should have been called twice.

    // Trigger them
    scene.time.delayedCall.mock.results.forEach((result) => {
      if (result.value && result.value.callback) {
        result.value.callback();
      }
    });

    expect(mockAudioManager.playAnnouncer).toHaveBeenCalledWith("round_1");
    expect(mockAudioManager.playAnnouncer).toHaveBeenCalledWith("fight");
  });

  it("should update combo on hits", () => {
    scene.comboCounter = 0;
    scene.processComboHit();
    expect(scene.comboCounter).toBe(1);

    scene.processComboHit();
    expect(scene.comboCounter).toBe(2);
    expect(mockAudioManager.playAnnouncer).not.toHaveBeenCalledWith("combo_3");

    scene.processComboHit(); // 3 Hits
    expect(mockAudioManager.playAnnouncer).toHaveBeenCalledWith("combo_3");
  });
});
