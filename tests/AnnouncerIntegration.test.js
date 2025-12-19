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
    // Now they are nested: Intro (2000ms) -> Round 1 -> Fight (1500ms)

    // Trigger repeatedly to handle nesting
    const triggerCalls = () => {
      const results = [...scene.time.delayedCall.mock.results];
      scene.time.delayedCall.mockClear(); // Clear to detect new calls
      results.forEach((result) => {
        if (result.value && result.value.callback) {
          result.value.callback();
        }
      });
    };

    triggerCalls(); // Triggers Intro (2000ms)
    triggerCalls(); // Triggers Round 1/Fight nesting

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
