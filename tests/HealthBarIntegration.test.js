import { describe, it, expect, vi, beforeEach } from "vitest";
import FightScene from "../src/scenes/FightScene";
import Fighter from "../src/components/Fighter";

// Mock Phaser
vi.mock("phaser", () => {
  return {
    default: {
      Scene: class {
        constructor() {
          this.events = { on: vi.fn(), once: vi.fn() };
          this.add = {
            graphics: vi.fn(() => ({
              clear: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              fillStyle: vi.fn().mockReturnThis(),
              fillPoints: vi.fn().mockReturnThis(),
              strokePoints: vi.fn().mockReturnThis(),
              fillRect: vi.fn().mockReturnThis(),
              lineStyle: vi.fn().mockReturnThis(),
              strokeRect: vi.fn().mockReturnThis(),
            })),
            text: vi.fn(() => ({
              setOrigin: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setText: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
            })),
            image: vi.fn(() => ({
              setDisplaySize: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setFlipX: vi.fn().mockReturnThis(),
              setTexture: vi.fn().mockReturnThis(),
              setTint: vi.fn().mockReturnThis(),
              clearTint: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
            })),
            rectangle: vi.fn(() => ({
              setOrigin: vi.fn().mockReturnThis(),
            })),
            existing: vi.fn(),
          };
          this.physics = {
            add: {
              staticGroup: vi.fn(() => ({ add: vi.fn() })),
              collider: vi.fn(),
              existing: vi.fn(),
            },
            world: { setBounds: vi.fn() },
          };
          this.input = {
            keyboard: {
              createCursorKeys: vi.fn(() => ({})),
              addKey: vi.fn(() => ({})),
            },
          };
          this.time = {
            addEvent: vi.fn(() => ({ remove: vi.fn() })),
            delayedCall: vi.fn(),
            now: 0,
          };
          this.tweens = { add: vi.fn() };
          this.registry = { get: vi.fn() };
          this.scale = { width: 1280, height: 720 };
          this.cameras = {
            main: {
              zoom: 1,
              scrollX: 0,
              scrollY: 0,
              ignore: vi.fn(),
              zoomTo: vi.fn(),
              width: 1280,
              height: 720,
            },
            add: vi.fn(() => ({
              setScroll: vi.fn().mockReturnThis(),
              setZoom: vi.fn().mockReturnThis(),
              setName: vi.fn().mockReturnThis(),
              ignore: vi.fn().mockReturnThis(),
            })),
          };
          this.textures = { exists: vi.fn(() => true) };
          this.anims = { exists: vi.fn(() => true), create: vi.fn() };
        }
      },
      GameObjects: {
        Sprite: class {
          constructor() {
            this.setOrigin = vi.fn().mockReturnThis();
            this.setCollideWorldBounds = vi.fn().mockReturnThis();
            this.setGravityY = vi.fn().mockReturnThis();
            this.play = vi.fn().mockReturnThis();
            this.on = vi.fn().mockReturnThis();
            this.anims = { play: vi.fn(), stop: vi.fn(), isPlaying: false };
            this.texture = { key: "test" };
          }
        },
      },
      Physics: {
        Arcade: {
          Sprite: class {
            constructor() {
              this.setOrigin = vi.fn().mockReturnThis();
              this.setCollideWorldBounds = vi.fn().mockReturnThis();
              this.setGravityY = vi.fn().mockReturnThis();
              this.play = vi.fn().mockReturnThis();
              this.on = vi.fn().mockReturnThis();
              this.anims = { play: vi.fn(), stop: vi.fn(), isPlaying: false };
              this.texture = { key: "test" };
              this.body = {
                setVelocity: vi.fn(),
                setAccelerationX: vi.fn(),
                setSize: vi.fn().mockReturnThis(),
                setOffset: vi.fn().mockReturnThis(),
              };
              this.setFlipX = vi.fn().mockReturnThis();
              this.setPosition = vi.fn().mockReturnThis();
              this.setVelocityX = vi.fn().mockReturnThis();
              this.setVelocityY = vi.fn().mockReturnThis();
              this.setScale = vi.fn().mockReturnThis();
            }
          },
        },
      },
      Math: {
        Clamp: (v, min, max) => Math.min(Math.max(v, min), max),
        Between: (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min),
        Linear: (a, b, f) => a + (b - a) * f,
        Distance: { Between: () => 100 },
      },
    },
  };
});

describe("Health Bar Integration", () => {
  let scene;

  beforeEach(async () => {
    vi.clearAllMocks();
    scene = new FightScene();

    // Manually setup only what we need instead of calling scene.create()
    const { width, height } = scene.scale;
    scene.player1 = new Fighter(scene, 300, height - 150, "p1");
    scene.player2 = new Fighter(scene, width - 300, height - 150, "p2");
    scene.player1.setOpponent(scene.player2);
    scene.player2.setOpponent(scene.player1);

    const UIManager = (await import("../src/systems/UIManager")).default;
    scene.uiManager = new UIManager(scene, {
      p1Character: "p1",
      p2Character: "p2",
    });

    // Mock hitFeedback for checkAttack
    scene.hitFeedback = {
      triggerHitFeedback: vi.fn(),
      triggerBlockFeedback: vi.fn(),
    };
  });

  it("should call uiManager.update() during scene update", () => {
    const uiUpdateSpy = vi.spyOn(scene.uiManager, "update");
    scene.update(0, 16);
    expect(uiUpdateSpy).toHaveBeenCalled();
  });

  it("should call uiManager.updateHealth() when a fighter takes damage", () => {
    const uiHealthSpy = vi.spyOn(scene.uiManager, "updateHealth");
    scene.player2.takeDamage(20);
    // Player 2 is playerNum 2
    expect(uiHealthSpy).toHaveBeenCalledWith(2, 80);
  });
});
