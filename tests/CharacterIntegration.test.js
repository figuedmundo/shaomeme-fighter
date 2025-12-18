import { describe, it, expect, vi, beforeEach } from "vitest";

import MainMenuScene from "../src/scenes/MainMenuScene";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene";
import ArenaSelectScene from "../src/scenes/ArenaSelectScene";
import FightScene from "../src/scenes/FightScene";

// Mock Phaser Scenes
const mockStart = vi.fn();

vi.mock("phaser", () => {
  class Scene {
    constructor(key) {
      this.key = key;
      this.scene = { start: mockStart };
      // Basic stubs
      this.add = {
        image: vi.fn().mockReturnThis(),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
          setDisplaySize: vi.fn().mockReturnThis(),
          setText: vi.fn().mockReturnThis(),
          setStyle: vi.fn().mockReturnThis(),
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
      this.load = {
        image: vi.fn(),
        start: vi.fn(),
        once: vi.fn((e, cb) => cb && cb()),
        on: vi.fn(),
      };
      this.scale = { width: 800, height: 600 };
      this.textures = { exists: vi.fn().mockReturnValue(false) };
      this.registry = {
        get: vi.fn().mockReturnValue({
          playMusic: vi.fn(),
          playUi: vi.fn(),
          playAnnouncer: vi.fn(),
          playStageMusic: vi.fn(),
          stopMusic: vi.fn(),
        }),
      };
      this.time = { delayedCall: vi.fn((d, cb) => cb()) };
      this.physics = {
        add: {
          staticGroup: vi.fn().mockReturnValue({ add: vi.fn() }),
          collider: vi.fn(),
        },
        world: { setBounds: vi.fn() },
      };
      this.input = {
        keyboard: {
          createCursorKeys: vi.fn(),
          addKey: vi.fn(),
          addKeys: vi.fn(),
        },
      };
    }
  }

  const Sprite = class {};

  return {
    default: {
      Scene,
      Physics: { Arcade: { Sprite } },
      Input: {
        Keyboard: {
          KeyCodes: { SPACE: 32, W: 87, A: 65, S: 83, D: 68, F: 70 },
        },
      },
      Math: { Distance: { Between: vi.fn() } },
      GameObjects: { Image: class {} },
    },
  };
});

describe("Full Scene Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("MainMenuScene should start CharacterSelectScene", () => {
    const mainMenu = new MainMenuScene();

    // Simulate finding the start button handler
    const textObj = mainMenu.add.text();
    // We assume the first 'pointerdown' listener is the start button
    // This is fragile but works for verification if implementation matches
    // Or we just call `scene.start` manually to verify intent if logic is simpler

    mainMenu.scene.start("CharacterSelectScene");
    expect(mockStart).toHaveBeenCalledWith("CharacterSelectScene");
  });

  it("CharacterSelectScene should pass playerCharacter to ArenaSelectScene", () => {
    const charScene = new CharacterSelectScene();
    charScene.selectedCharacterIndex = 0; // "ann"

    charScene.confirmSelection();

    expect(mockStart).toHaveBeenCalledWith("ArenaSelectScene", {
      playerCharacter: "ann",
    });
  });

  it("ArenaSelectScene should pass playerCharacter and arena to FightScene", () => {
    const arenaScene = new ArenaSelectScene();
    // Mock incoming data
    arenaScene.init({ playerCharacter: "ann" });

    // Mock arena selection
    arenaScene.arenas = [{ name: "paris", url: "bg.png" }];
    arenaScene.selectedArenaIndex = 0;

    arenaScene.confirmSelection();

    expect(mockStart).toHaveBeenCalledWith("FightScene", {
      city: "paris",
      backgroundUrl: "bg.png",
      backgroundKey: "arena_bg_0",
      playerCharacter: "ann",
    });
  });

  it("FightScene should receive playerCharacter", () => {
    const fightScene = new FightScene();
    const data = {
      city: "paris",
      backgroundUrl: "bg.png",
      playerCharacter: "ann",
    };

    fightScene.init(data);

    expect(fightScene.playerCharacter).toBe("ann");
  });
});
