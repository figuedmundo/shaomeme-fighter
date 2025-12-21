import { describe, it, expect, vi } from "vitest";
import Phaser from "phaser";
import SceneTransition, {
  TransitionPresets,
  TransitionType,
} from "../src/utils/SceneTransition";

// Mock Phaser Scene
class MockScene extends Phaser.Scene {
  constructor() {
    super("MockScene");
    this.scale = { width: 800, height: 600 };
    this.cameras = {
      main: {
        fadeOut: vi.fn(),
        fadeIn: vi.fn(),
        flash: vi.fn(),
        once: vi.fn((event, callback) => callback()),
        scrollX: 0,
        scrollY: 0,
      },
    };
    this.add = {
      graphics: vi.fn(() => ({
        setDepth: vi.fn(),
        setScrollFactor: vi.fn(),
        clear: vi.fn(),
        fillStyle: vi.fn(),
        fillRect: vi.fn(),
        fillCircle: vi.fn(),
        destroy: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        closePath: vi.fn(),
        fillPath: vi.fn(),
      })),
    };
    this.tweens = {
      add: vi.fn((config) => {
        if (config.onComplete) config.onComplete();
      }),
    };
    this.scene = {
      start: vi.fn(),
    };
    this.registry = {
      get: vi.fn(),
    };
  }
}

describe("SceneTransition Integration", () => {
  it("should export valid presets", () => {
    expect(TransitionPresets.MENU_TO_SELECT).toBeDefined();
    expect(TransitionPresets.MENU_TO_SELECT.type).toBe(
      TransitionType.WIPE_RADIAL,
    );

    expect(TransitionPresets.SELECT_TO_ARENA).toBeDefined();
    expect(TransitionPresets.SELECT_TO_ARENA.type).toBe(
      TransitionType.WIPE_HORIZONTAL,
    );
  });

  it("should execute transitionTo with preset values", async () => {
    const mockScene = new MockScene();
    const transition = new SceneTransition(mockScene);

    // Spy on internal methods
    const wipeSpy = vi.spyOn(transition, "wipeRadial");
    const targetScene = "NextScene";
    const preset = TransitionPresets.MENU_TO_SELECT;

    await transition.transitionTo(
      targetScene,
      {},
      preset.type,
      preset.duration,
      preset.color,
    );

    expect(wipeSpy).toHaveBeenCalledWith(
      preset.duration,
      preset.color,
      "expand",
    );
    expect(mockScene.scene.start).toHaveBeenCalledWith(targetScene, {});
  });
});
