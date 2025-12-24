import { describe, it, expect, vi, beforeEach } from "vitest";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene.js";

vi.mock("phaser", () => {
  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
        }

        load = { image: vi.fn(), on: vi.fn() };

        add = {
          image: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setDisplaySize: vi.fn().mockReturnThis(),
            setScrollFactor: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setTint: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setScale: vi.fn().mockReturnThis(),
            width: 100,
            height: 100,
          }),
          rectangle: vi
            .fn()
            .mockReturnValue({ setStrokeStyle: vi.fn().mockReturnThis() }),
          graphics: vi.fn().mockReturnValue({
            fillGradientStyle: vi.fn(),
            fillCircle: vi.fn(),
            setAlpha: vi.fn(),
          }),
          text: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
          }),
        };

        scale = { width: 800, height: 600 };

        registry = { get: vi.fn() };

        tweens = { add: vi.fn() };

        events = { on: vi.fn() };
      },
    },
  };
});

describe("CharacterSelectScene Layout", () => {
  let scene;

  beforeEach(() => {
    scene = new CharacterSelectScene();
    // Mock the necessary methods for create()
    scene.load = { image: vi.fn(), on: vi.fn() };
    scene.add = {
      image: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setDisplaySize: vi.fn().mockReturnThis(),
        setScrollFactor: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setTint: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        width: 100,
        height: 100,
      }),
      rectangle: vi
        .fn()
        .mockReturnValue({ setStrokeStyle: vi.fn().mockReturnThis() }),
      graphics: vi.fn().mockReturnValue({
        fillGradientStyle: vi.fn(),
        fillCircle: vi.fn(),
        setAlpha: vi.fn(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
      }),
    };
    scene.scale = { width: 1024, height: 768 }; // iPad resolution approx
    scene.registry = { get: vi.fn() };
    scene.tweens = { add: vi.fn() };
    scene.transition = { fadeIn: vi.fn() }; // Mock transition
    scene.buildGrid = vi.fn(); // Mock grid building to isolate layout tests
    scene.fitInArea = vi.fn();
    scene.selectCharacter = vi.fn();
  });

  it("should add the background image", () => {
    scene.create();
    expect(scene.add.image).toHaveBeenCalledWith(512, 384, "select_bg");
  });
});
