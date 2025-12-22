import { describe, it, expect, vi, beforeEach } from "vitest";
import ArenaSelectScene from "../src/scenes/ArenaSelectScene";

// Mock Phaser (same as existing)
vi.mock("phaser", () => {
  class Scene {
    constructor(key) {
      this.key = key;
      this.sys = { settings: { key } };
      this.load = {
        image: vi.fn(),
        start: vi.fn(),
        on: vi.fn((event, cb) => {
          if (event === "complete") cb();
          return this.load;
        }),
        once: vi.fn((event, cb) => {
          if (event === "complete") cb();
          return this.load;
        }),
      };
      this.add = {
        image: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setDisplaySize: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setTexture: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
          setText: vi.fn().mockReturnThis(),
        }),
        graphics: vi.fn().mockReturnValue({
          fillGradientStyle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
        }),
        rectangle: vi.fn().mockReturnValue({
          setStrokeStyle: vi.fn().mockReturnThis(),
          setFillStyle: vi.fn().mockReturnThis(),
        }),
      };
      this.scale = { width: 1024, height: 768 };
      this.scene = { start: vi.fn() };
      this.registry = { get: vi.fn() }; // For audioManager
    }
  }
  return {
    default: { Scene },
  };
});

describe("ArenaSelectScene - Opponent Preservation", () => {
  let scene;
  let mockTransition;

  beforeEach(() => {
    mockTransition = {
      transitionTo: vi.fn().mockResolvedValue(),
      fadeIn: vi.fn(),
      wipeHorizontal: vi.fn(),
    };

    // Inject mock transition manager via config if possible, or override property
    scene = new ArenaSelectScene({ transitionManager: mockTransition });
    scene.fightBtn = { disableInteractive: vi.fn() };
    scene.arenas = [{ name: "Test Arena", url: "test.png" }];
    scene.selectedArenaIndex = 0;
  });

  it("should use passed opponent character when confirming selection", async () => {
    const data = {
      playerCharacter: "fighter1",
      opponentCharacter: "fighter2",
    };

    // Simulate init
    scene.init(data);

    // Act
    await scene.confirmSelection();

    // Assert
    expect(mockTransition.transitionTo).toHaveBeenCalledWith(
      "LoadingScene",
      expect.objectContaining({
        targetData: expect.objectContaining({
          playerCharacter: "fighter1",
          opponentCharacter: "fighter2",
        }),
      }),
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it("should generate random opponent if none passed (fallback)", async () => {
    const data = {
      playerCharacter: "fighter1",
      // No opponentCharacter
    };

    scene.init(data);

    await scene.confirmSelection();

    expect(mockTransition.transitionTo).toHaveBeenCalledWith(
      "LoadingScene",
      expect.objectContaining({
        targetData: expect.objectContaining({
          playerCharacter: "fighter1",
        }),
      }),
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );

    // Check that opponentCharacter IS defined (generated)
    const callArgs = mockTransition.transitionTo.mock.calls[0];
    const { targetData } = callArgs[1];
    expect(targetData.opponentCharacter).toBeDefined();
    expect(targetData.opponentCharacter).not.toBeNull();
  });
});
