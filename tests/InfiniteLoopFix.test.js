import { describe, it, expect, vi, beforeEach } from "vitest";
import FightScene from "../src/scenes/FightScene";
import Fighter, { FighterState } from "../src/components/Fighter";

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
              generateTexture: vi.fn().mockReturnThis(),
              fillCircle: vi.fn().mockReturnThis(),
              fillPoints: vi.fn().mockReturnThis(),
              strokePoints: vi.fn().mockReturnThis(),
              fillRect: vi.fn().mockReturnThis(),
              lineStyle: vi.fn().mockReturnThis(),
              strokeRect: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
            })),
            text: vi.fn(() => ({
              setOrigin: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setText: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
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
              destroy: vi.fn(),
            })),
            rectangle: vi.fn(() => ({
              setOrigin: vi.fn().mockReturnThis(),
            })),
            existing: vi.fn(),
            particles: vi.fn(() => ({
              stop: vi.fn(),
              setParticleTint: vi.fn(),
              emitParticleAt: vi.fn(),
              destroy: vi.fn(),
            })),
          };
          this.physics = {
            add: {
              staticGroup: vi.fn(() => ({ add: vi.fn() })),
              collider: vi.fn(),
              existing: vi.fn(),
            },
            world: {
              setBounds: vi.fn(),
              pause: vi.fn(),
              resume: vi.fn(),
            },
            pause: vi.fn(),
            resume: vi.fn(),
          };
          this.input = {
            keyboard: {
              createCursorKeys: vi.fn(() => ({})),
              addKey: vi.fn(() => ({})),
              checkDown: vi.fn(() => false),
            },
          };
          this.time = {
            addEvent: vi.fn(() => ({ remove: vi.fn() })),
            delayedCall: vi.fn((delay, cb) => {
              // For test, we can capture the callback or simulate immediate
              if (delay < 100) cb();
            }),
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
              shake: vi.fn(),
            },
            add: vi.fn(() => ({
              setScroll: vi.fn().mockReturnThis(),
              setZoom: vi.fn().mockReturnThis(),
              setName: vi.fn().mockReturnThis(),
              ignore: vi.fn().mockReturnThis(),
            })),
          };
          this.textures = {
            exists: vi.fn(() => true),
            addCanvas: vi.fn(),
          };
          this.anims = {
            exists: vi.fn(() => true),
            create: vi.fn(),
            pauseAll: vi.fn(),
            resumeAll: vi.fn(),
            generateFrameNumbers: vi.fn(() => [{}]),
          };
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
              this.body = {
                setVelocity: vi.fn(),
                setAccelerationX: vi.fn(),
                setSize: vi.fn().mockReturnThis(),
                setOffset: vi.fn().mockReturnThis(),
                blocked: { down: true },
              };
              this.setCollideWorldBounds = vi.fn().mockReturnThis();
              this.setOrigin = vi.fn().mockReturnThis();
              this.setScale = vi.fn().mockReturnThis();
              this.setFlipX = vi.fn().mockReturnThis();
              this.setPosition = vi.fn().mockReturnThis();
              this.setVelocityX = vi.fn().mockReturnThis();
              this.setVelocityY = vi.fn().mockReturnThis();
              this.play = vi.fn().mockReturnThis();
              this.on = vi.fn().mockReturnThis();
              this.once = vi.fn().mockReturnThis();
              this.setTint = vi.fn().mockReturnThis();
              this.clearTint = vi.fn().mockReturnThis();
              this.anims = {
                play: vi.fn(),
                stop: vi.fn(),
                isPlaying: false,
                currentFrame: { index: 0 },
                currentAnim: { key: "idle" },
              };
              this.texture = { key: "test" };
            }
          },
        },
      },
      Math: {
        Clamp: (v, min, max) => Math.min(Math.max(v, min), max),
        Between: (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min),
        Linear: (a, b, f) => a + (b - a) * f,
        Distance: { Between: () => 50 },
      },
    },
  };
});

describe("Infinite Loop Bug Fix", () => {
  let scene;

  beforeEach(async () => {
    vi.clearAllMocks();
    scene = new FightScene();

    // Setup fighters
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

    const HitFeedbackSystem = (await import("../src/systems/HitFeedbackSystem"))
      .default;
    scene.hitFeedback = new HitFeedbackSystem(scene);

    // Force states and animation properties AFTER instantiation
    scene.player1.x = 100;
    scene.player2.x = 150;
    scene.player1.setFlipX(false);
    scene.player2.setFlipX(true);

    scene.player1.currentState = FighterState.ATTACK;
    scene.player1.anims.isPlaying = true;
    scene.player1.anims.currentFrame = { index: 2 };

    scene.player2.currentState = FighterState.BLOCK;
    scene.player2.health = 100;
    scene.player2.isHit = false;
  });

  it("should mark defender as isHit during block to prevent infinite loop on the same frame", () => {
    // First call to checkAttack
    scene.checkAttack(scene.player1, scene.player2);

    expect(scene.player2.isHit).toBe(true);

    // Second call to checkAttack (same frame simulation)
    // Should NOT trigger block logic again because isHit is true
    const blockSpy = vi.spyOn(scene.hitFeedback, "triggerBlockFeedback");
    scene.checkAttack(scene.player1, scene.player2);

    expect(blockSpy).not.toHaveBeenCalled();
  });
});
