import { describe, it, expect, vi, beforeEach } from "vitest";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene.js";

// Mock Phaser
vi.mock("phaser", () => {
  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
        }

        load = {
          image: vi.fn(),
          on: vi.fn(),
        };

        add = {
          image: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setDisplaySize: vi.fn().mockReturnThis(),
          }),
          rectangle: vi
            .fn()
            .mockReturnValue({ setStrokeStyle: vi.fn().mockReturnThis() }),
          graphics: vi.fn().mockReturnValue({
            fillGradientStyle: vi.fn(),
            fillCircle: vi.fn(),
          }),
          text: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
          }),
        };

        scale = { width: 800, height: 600 };

        registry = {
          get: vi.fn(),
        };

        tweens = {
          add: vi.fn(),
        };

        events = {
          on: vi.fn(),
        };
      },
    },
  };
});

describe("CharacterSelectScene Asset Loading", () => {
  let scene;

  beforeEach(() => {
    scene = new CharacterSelectScene();
    scene.load = {
      image: vi.fn(),
      on: vi.fn(),
    };
  });

  it("should load the select_bg image in preload", () => {
    scene.preload();
    expect(scene.load.image).toHaveBeenCalledWith(
      "select_bg",
      "/assets/images/backgrounds/select_bg.png",
    );
  });
});
