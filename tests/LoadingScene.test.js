import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "events";
import LoadingScene from "../src/scenes/LoadingScene";

describe("LoadingScene (JIT Loading)", () => {
  let scene;
  let game;

  beforeEach(() => {
    scene = new LoadingScene();
    game = {
      config: { width: 800, height: 600 },
      registry: { get: vi.fn(), set: vi.fn() },
    };

    scene.sys = {
      settings: { key: "LoadingScene" },
      game,
      events: new EventEmitter(),
    };
    scene.scale = { width: 800, height: 600 };

    // Mock Phaser Loader
    scene.load = {
      spritesheet: vi.fn(),
      image: vi.fn(),
      start: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      totalToLoad: 0,
    };

    // Mock Texture Manager
    scene.textures = {
      exists: vi.fn().mockReturnValue(false), // Default: asset missing
    };

    // Mock Scene Manager
    scene.scene = { start: vi.fn() };

    // Mock Display
    scene.add = {
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
      }),
      rectangle: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
    };

    // Mock Tweens/Time
    scene.tweens = { add: vi.fn() };
    scene.time = { delayedCall: vi.fn((delay, cb) => cb()) };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should queue assets if they are missing", () => {
    const data = {
      targetScene: "FightScene",
      targetData: {
        player1: "ann",
        player2: "dad",
        arena: "paris",
      },
    };

    scene.create(data);

    // Should load player1
    expect(scene.load.spritesheet).toHaveBeenCalledWith(
      "ann",
      expect.stringContaining("ann.png"),
      expect.any(Object),
    );

    // Should load player2
    expect(scene.load.spritesheet).toHaveBeenCalledWith(
      "dad",
      expect.stringContaining("dad.png"),
      expect.any(Object),
    );

    // Should load arena
    // Assuming arena background logic loads an image
    // Note: implementation detail might vary, let's assume standard path
    // or checks logic.
    // Actually, arena might be multiple layers. For MVP JIT, maybe just main BG.

    // Check that load.start() was called
    expect(scene.load.start).toHaveBeenCalled();
  });

  it("should NOT queue assets if they already exist", () => {
    scene.textures.exists.mockReturnValue(true); // Assets exist

    const data = {
      targetScene: "FightScene",
      targetData: {
        player1: "ann",
        player2: "dad",
      },
    };

    scene.create(data);

    expect(scene.load.spritesheet).not.toHaveBeenCalled();
    // Should transition immediately (via delayedCall mock)
    expect(scene.scene.start).toHaveBeenCalledWith(
      "FightScene",
      data.targetData,
    );
  });

  it("should transition when loading is complete", () => {
    const data = {
      targetScene: "FightScene",
      targetData: { player1: "new_char" },
    };

    // Simulate asset missing
    scene.textures.exists.mockReturnValue(false);

    scene.create(data);

    // Find the 'complete' listener
    const completeCallback = scene.load.on.mock.calls.find(
      (c) => c[0] === "complete",
    )[1];
    expect(completeCallback).toBeDefined();

    // Trigger complete
    completeCallback();

    expect(scene.scene.start).toHaveBeenCalledWith(
      "FightScene",
      data.targetData,
    );
  });
});
