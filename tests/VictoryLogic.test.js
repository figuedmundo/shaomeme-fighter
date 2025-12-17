import { describe, it, expect, vi, beforeEach } from "vitest";

// Import the module under test
import FightScene from "../src/scenes/FightScene";
import Fighter, { FighterState } from "../src/components/Fighter";
import VictorySlideshow from "../src/components/VictorySlideshow";

// 1. Define Mocks BEFORE imports
vi.mock("phaser", () => {
  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
        }

        add = { image: vi.fn(), rectangle: vi.fn(), dom: vi.fn() };

        physics = {
          add: { staticGroup: vi.fn(), collider: vi.fn() },
          world: { setBounds: vi.fn() },
          pause: vi.fn(),
        };

        scale = { width: 800, height: 600 };

        input = {
          keyboard: {
            createCursorKeys: vi.fn(),
            addKeys: vi.fn(),
            addKey: vi.fn(),
          },
        };

        load = { image: vi.fn(), once: vi.fn(), start: vi.fn() };

        textures = { exists: vi.fn() };

        scene = { start: vi.fn() };

        sound = { stopAll: vi.fn(), play: vi.fn(), add: vi.fn() };

        time = { delayedCall: vi.fn((delay, cb) => cb()) }; // Execute immediately for test

        cache = { audio: { exists: vi.fn() } };
      },
      Math: { Distance: { Between: vi.fn() } },
      Input: {
        Keyboard: {
          KeyCodes: { SPACE: 32, W: 87, S: 83, A: 65, D: 68, F: 70 },
        },
      },
      Physics: {
        Arcade: {
          Sprite: class {
            constructor() {
              this.body = { setSize: vi.fn(), setOffset: vi.fn(), blocked: {} };
              this.setCollideWorldBounds = vi.fn();
              this.setOrigin = vi.fn();
            }
          },
        },
      },
    },
  };
});

// Mock Fighter to avoid complex logic
vi.mock("../src/components/Fighter", () => {
  const FighterState = {
    IDLE: "IDLE",
    ATTACK: "ATTACK",
    HIT: "HIT",
    DIE: "DIE",
  };
  return {
    default: class {
      constructor() {
        this.health = 100;
        this.currentState = "IDLE";
        this.setControls = vi.fn();
        this.setFlipX = vi.fn();
        this.update = vi.fn();
        this.setState = vi.fn((s) => (this.currentState = s));
        this.setTint = vi.fn();
        this.clearTint = vi.fn();
        this.anims = { currentFrame: { index: 0 }, play: vi.fn() };
        this.texture = { key: "fighter" };
        this.takeDamage = vi.fn((amount) => {
          this.health -= amount;
          if (this.health <= 0) this.setState("DIE");
        });
      }
    },
    FighterState,
  };
});

vi.mock("../src/components/VictorySlideshow", () => {
  return {
    default: class {
      constructor(scene) {
        this.scene = scene;
      }

      show = vi.fn();
    },
  };
});

describe("Victory Logic in FightScene", () => {
  let scene;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    scene = new FightScene();
    // Simulate init/create manually since we mocked Phaser
    scene.init({ city: "TestCity" });

    // Manually attach mocked properties usually set in create()
    scene.player1 = new Fighter();
    scene.player2 = new Fighter();
    scene.slideshow = new VictorySlideshow(scene); // Use the mocked class instance
  });

  it("should trigger victory sequence when opponent health is 0", () => {
    // Simulate Player 2 dying
    scene.player1.health = 100;
    scene.player2.health = 0;
    scene.player2.currentState = FighterState.DIE;

    // Call update
    scene.update();

    // Verify
    expect(scene.isGameOver).toBe(true);
    expect(scene.physics.pause).toHaveBeenCalled();
    expect(scene.player1.setControls).toHaveBeenCalledWith(null, null, null);

    // Since we mocked time.delayedCall to execute immediately:
    expect(scene.slideshow.show).toHaveBeenCalledWith("TestCity");
  });

  it("should not trigger victory if both alive", () => {
    scene.player1.health = 100;
    scene.player2.health = 100;
    scene.update();
    expect(scene.isGameOver).toBe(false);
    expect(scene.slideshow.show).not.toHaveBeenCalled();
  });
});
