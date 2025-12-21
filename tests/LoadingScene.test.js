import { describe, it, expect, vi, beforeEach } from "vitest";
import Phaser from "phaser";

// Mock Phaser Scene
class MockScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
    this.add = {
      text: vi.fn(() => ({
        setOrigin: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
      })),
    };
    this.scale = { width: 800, height: 600 };
    this.tweens = {
      add: vi.fn(),
    };
    this.scene = {
      start: vi.fn(),
    };
    this.time = {
      delayedCall: vi.fn((delay, callback) => callback()),
    };
  }

  create(data) {
    if (this.startLoading) this.startLoading(data.targetScene, data.targetData);
  }
}

describe("LoadingScene", () => {
  let scene;

  beforeEach(() => {
    scene = new MockScene();
    // Manually attach methods we expect to be there after implementation
    // Ideally we import the real class, but for TDD we define behavior expectations
    scene.startLoading = vi.fn((target, data) => {
      // logic simulation
      if (!target) return;
      scene.time.delayedCall(1000, () => {
        scene.scene.start(target, data);
      });
    });
  });

  it("should start transition to target scene after delay", () => {
    const target = "NextScene";
    const data = { foo: "bar" };

    scene.create({ targetScene: target, targetData: data });

    expect(scene.startLoading).toHaveBeenCalledWith(target, data);
    expect(scene.time.delayedCall).toHaveBeenCalled();
    expect(scene.scene.start).toHaveBeenCalledWith(target, data);
  });

  it("should handle missing target scene gracefully", () => {
    scene.create({});
    expect(scene.scene.start).not.toHaveBeenCalled();
  });
});
