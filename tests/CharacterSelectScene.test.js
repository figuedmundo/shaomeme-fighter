import { describe, it, expect, vi, beforeEach } from "vitest";

import CharacterSelectScene from "../src/scenes/CharacterSelectScene";
import rosterConfig from "../src/config/rosterConfig";

// Mock Phaser class and Scene
vi.mock("phaser", () => {
  class Scene {
    constructor(key) {
      this.key = key;
      this.game = { config: { test: true } };
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
          clearTint: vi.fn().mockReturnThis(),
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
        container: vi.fn().mockReturnValue({
          add: vi.fn(),
        }),
      };
      this.scale = { width: 1024, height: 768 };
      this.scene = { start: vi.fn() };
    }
  }
  return {
    default: { Scene },
  };
});

describe("CharacterSelectScene", () => {
  let scene;

  beforeEach(() => {
    const mockTransition = {
      fadeIn: vi.fn().mockResolvedValue(),
      fadeOut: vi.fn().mockResolvedValue(),
      flash: vi.fn().mockResolvedValue(),
      transitionTo: vi.fn().mockResolvedValue(),
    };

    scene = new CharacterSelectScene({ transitionManager: mockTransition });

    // Inject mocks that depend on methods running
    scene.load = {
      image: vi.fn(),
      once: vi.fn((e, cb) => cb && cb()),
      start: vi.fn(),
    };

    scene.add.image = vi.fn().mockReturnValue({
      setOrigin: vi.fn().mockReturnThis(),
      setDisplaySize: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      setTexture: vi.fn().mockReturnThis(),
    });

    scene.add.graphics = vi.fn().mockReturnValue({
      fillGradientStyle: vi.fn().mockReturnThis(),
      fillCircle: vi.fn().mockReturnThis(),
      alpha: 0.5,
    });

    scene.leftPortrait = {
      setTexture: vi.fn(),
      setAlpha: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      width: 200,
      height: 400,
    };
    scene.rightPortrait = {
      setTexture: vi.fn(),
      setAlpha: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      clearTint: vi.fn().mockReturnThis(),
      width: 200,
      height: 400,
      scale: 1,
    };
    scene.nameText = { setText: vi.fn() };
    scene.selectBtn = {
      disableInteractive: vi.fn().mockReturnThis(),
      setAlpha: vi.fn().mockReturnThis(),
    };
    scene.aiQuestionMark = { destroy: vi.fn() };
    scene.gridItems = []; // Will be populated by buildGrid

    scene.tweens = {
      add: vi.fn(),
    };

    scene.transition = mockTransition;

    scene.registry = {
      get: vi.fn().mockReturnValue({
        playMusic: vi.fn(),
        playUi: vi.fn(),
        playAnnouncer: vi.fn(),
      }),
    };

    scene.time = {
      delayedCall: vi.fn().mockImplementation((d, cb) => cb()),
      addEvent: vi.fn().mockImplementation((config) => {
        if (config.callback) {
          // To simulate the roll completion, we call it multiple times
          // or just ensure the last call has the completion state.
          // Since confirmSelection uses a local 'elapsed' variable,
          // we need to call it enough times.
          const iterations = (config.repeat || 0) + 1;
          for (let i = 0; i < iterations; i += 1) {
            config.callback();
          }
        }
        return {
          destroy: vi.fn(),
          remove: vi.fn(),
        };
      }),
    };
  });

  it("should be defined", () => {
    expect(scene).toBeDefined();
  });

  it("should preload assets from config", () => {
    scene.preload();
    // Check if it calls load.image for each roster item
    rosterConfig.forEach((char) => {
      expect(scene.load.image).toHaveBeenCalledWith(
        `portrait_${char.id}`,
        char.portraitPath,
      );
      expect(scene.load.image).toHaveBeenCalledWith(
        `icon_${char.id}`,
        char.iconPath,
      );
    });
  });

  it("should select character and update state", () => {
    // Manually setup grid items mock
    scene.gridItems = rosterConfig.map(() => ({
      border: { setStrokeStyle: vi.fn() },
    }));

    // Select first character
    scene.selectCharacter(0);

    expect(scene.selectedCharacterIndex).toBe(0);
    expect(scene.leftPortrait.setTexture).toHaveBeenCalledWith(
      `full_body_${rosterConfig[0].id}`,
    );
    expect(scene.nameText.setText).toHaveBeenCalledWith(
      rosterConfig[0].displayName.toUpperCase(),
    );

    // Check visual highlight
    expect(scene.gridItems[0].border.setStrokeStyle).toHaveBeenCalledWith(
      4,
      0xffd700,
    );
  });

  it("should confirm selection and transition to ArenaSelectScene", async () => {
    scene.selectedCharacterIndex = 1;
    await scene.confirmSelection();

    // Since we mocked time.addEvent to run immediately, it will call revealOpponent
    // which calls transition.transitionTo
    expect(scene.transition.transitionTo).toHaveBeenCalled();
  });

  it("should ignore selection of invalid character index", () => {
    // Current index is 0 from beforeEach
    scene.selectCharacter(-1);
    expect(scene.selectedCharacterIndex).toBe(0); // Should not change

    scene.selectCharacter(999);
    expect(scene.selectedCharacterIndex).toBe(0); // Should not change
  });
});
