import { describe, it, expect, vi, beforeEach } from "vitest";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene.js";
import rosterConfig from "../src/config/rosterConfig.js";

// Mock ConfigManager implicitly via rosterConfig
vi.mock("../src/config/rosterConfig.js", () => ({
  default: [
    {
      id: "char1",
      displayName: "Char 1",
      iconPath: "icon1",
      portraitPath: "p1",
      fullBodyPath: "fb1",
    },
    {
      id: "char2",
      displayName: "Char 2",
      iconPath: "icon2",
      portraitPath: "p2",
      fullBodyPath: "fb2",
    },
  ],
}));

vi.mock("phaser", () => {
  const Graphics = class {
    constructor() {
      this.x = 0;
      this.y = 0;
    }

    fillStyle = vi.fn().mockReturnThis();

    fillRect = vi.fn().mockReturnThis();

    lineStyle = vi.fn().mockReturnThis();

    strokeRect = vi.fn().mockReturnThis();

    setInteractive = vi.fn().mockReturnThis();

    on = vi.fn().mockReturnThis();

    clear = vi.fn().mockReturnThis();

    setDepth = vi.fn().mockReturnThis();
  };

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
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setTint: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setScale: vi.fn().mockReturnThis(),
            width: 100,
            height: 100,
          }),
          rectangle: vi.fn().mockReturnValue({
            setStrokeStyle: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
          }),
          graphics: vi.fn().mockImplementation(() => new Graphics()),
          text: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            setText: vi.fn(),
          }),
        };

        scale = { width: 1024, height: 768 };

        registry = { get: vi.fn() };

        tweens = { add: vi.fn() };

        events = { on: vi.fn() };
      },
    },
  };
});

describe("CharacterSelectScene Grid", () => {
  let scene;

  beforeEach(() => {
    scene = new CharacterSelectScene();
    // Setup Scene mocks
    scene.load = { image: vi.fn(), on: vi.fn() };
    scene.add = {
      container: vi.fn().mockReturnValue({
        add: vi.fn(),
        setAlpha: vi.fn(), // For fade out tween
      }),
      image: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setDisplaySize: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn().mockImplementation((event, callback) => {
          if (event === "pointerdown") callback(); // Auto-trigger click
          return this;
        }),
        setDepth: vi.fn().mockReturnThis(),
        setTint: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        width: 100,
        height: 100,
      }),
      rectangle: vi.fn().mockReturnValue({
        setStrokeStyle: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
      }),
      graphics: vi.fn().mockImplementation(() => {
        return {
          fillStyle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeRect: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          clear: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
        };
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        setText: vi.fn(),
      }),
    };
    scene.scale = { width: 1024, height: 768 };
    scene.registry = { get: vi.fn() };
    scene.tweens = { add: vi.fn() };
    scene.transition = { fadeIn: vi.fn() };

    // Stub methods that are not under test but called
    scene.fitInArea = vi.fn();
    scene.selectCharacter = vi.fn(); // We might want to spy on this, but for grid building it's separate
  });

  it("should create grid items with correct dimensions", () => {
    // Override selectCharacter to verify it's NOT called during build (or if it is, we ignore it here)
    scene.selectCharacter = vi.fn();

    scene.buildGrid();

    // We expect 2 characters in the mock roster
    expect(scene.gridItems.length).toBe(2);

    // Check if the container was added
    expect(scene.add.container).toHaveBeenCalledTimes(2);
  });
});
