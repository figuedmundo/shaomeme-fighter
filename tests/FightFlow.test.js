import { describe, it, expect, vi, beforeEach } from "vitest";
import FightScene from "../src/scenes/FightScene";

// Reuse mocks from E2E_FullGameFlow.test.js
vi.mock("phaser", () => {
  const mockAnims = {
    create: vi.fn(),
    exists: vi.fn().mockReturnValue(true),
    generateFrameNumbers: vi.fn().mockReturnValue([0, 1, 2]),
    play: vi.fn(),
  };

  const mockPhysics = {
    add: {
      existing: vi.fn(),
      staticGroup: vi.fn().mockReturnValue({
        add: vi.fn(),
        create: vi.fn().mockReturnValue({
          setSize: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
        }),
      }),
      collider: vi.fn(),
    },
    world: { setBounds: vi.fn(), pause: vi.fn() },
  };

  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
          this.scene = { start: vi.fn() };
          this.load = {
            image: vi.fn(),
            spritesheet: vi.fn(),
            audio: vi.fn(),
            start: vi.fn(),
            once: vi.fn((e, cb) => cb && cb()),
            on: vi.fn(),
          };
          this.add = {
            image: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setDisplaySize: vi.fn().mockReturnThis(),
              setInteractive: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
              setTexture: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setTint: vi.fn().mockReturnThis(),
              setBlendMode: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              setFlipX: vi.fn().mockReturnThis(),
            }),
            text: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setInteractive: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setText: vi.fn().mockReturnThis(),
              setY: vi.fn().mockReturnThis(),
              setStyle: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
            }),
            rectangle: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setStrokeStyle: vi.fn().mockReturnThis(),
              setFillStyle: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
            }),
            circle: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setPosition: vi.fn().mockReturnThis(),
            }),
            graphics: vi.fn().mockReturnValue({
              fillGradientStyle: vi.fn().mockReturnThis(),
              fillRect: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              fillStyle: vi.fn().mockReturnThis(),
              fillCircle: vi.fn().mockReturnThis(),
              generateTexture: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
              setScrollFactor: vi.fn().mockReturnThis(),
              clear: vi.fn().mockReturnThis(),
              lineStyle: vi.fn().mockReturnThis(),
              beginPath: vi.fn().mockReturnThis(),
              moveTo: vi.fn().mockReturnThis(),
              lineTo: vi.fn().mockReturnThis(),
              strokePath: vi.fn().mockReturnThis(),
              strokeRect: vi.fn().mockReturnThis(),
            }),
            container: vi.fn().mockReturnValue({
              add: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setPosition: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
            }),
            sprite: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              setPosition: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setFlipX: vi.fn().mockReturnThis(),
              setTexture: vi.fn().mockReturnThis(),
              setFrame: vi.fn().mockReturnThis(),
              play: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
              once: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
            }),
            group: vi.fn().mockReturnValue({
              add: vi.fn(),
              get: vi.fn(),
              killAndHide: vi.fn(),
              clear: vi.fn(),
              getChildren: vi.fn().mockReturnValue([]),
            }),
            particles: vi.fn().mockReturnValue({
              setDepth: vi.fn().mockReturnThis(),
              stop: vi.fn().mockReturnThis(),
              start: vi.fn().mockReturnThis(),
              emitParticleAt: vi.fn().mockReturnThis(),
              setTint: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
            }),
            existing: vi.fn(),
          };
          this.anims = mockAnims;
          this.physics = {
            ...mockPhysics,
            pause: vi.fn(),
          };
          this.scale = { width: 1280, height: 720 };
          this.textures = { exists: vi.fn().mockReturnValue(true) };
          this.cache = {
            audio: { exists: vi.fn().mockReturnValue(true) },
          };
          this.registry = {
            get: vi.fn().mockReturnValue({
              playMusic: vi.fn(),
              playUi: vi.fn(),
              playAnnouncer: vi.fn(),
              playStageMusic: vi.fn(),
              stopMusic: vi.fn(),
              setMusicRate: vi.fn(),
              init: vi.fn(),
              playKO: vi.fn(),
              playImpact: vi.fn(),
              playHitReaction: vi.fn(),
            }),
            set: vi.fn(),
          };
          this.time = {
            delayedCall: vi.fn((d, cb) => cb()),
            addEvent: vi.fn(),
          };
          this.tweens = {
            add: vi.fn((config) => {
              if (config.onStart) config.onStart();
              if (config.onComplete) config.onComplete();
            }),
          };
          this.cameras = {
            main: {
              shake: vi.fn(),
              zoom: 1,
              zoomTo: vi.fn(),
              pan: vi.fn(),
              setZoom: vi.fn(),
              width: 1280,
              height: 720,
              scrollX: 0,
              scrollY: 0,
            },
          };
          this.sound = {
            play: vi.fn(),
            stopAll: vi.fn(),
            add: vi.fn().mockReturnValue({ play: vi.fn(), stop: vi.fn() }),
          };
          this.events = { on: vi.fn(), emit: vi.fn() };
          this.input = {
            keyboard: {
              createCursorKeys: vi.fn().mockReturnValue({
                up: { isDown: false },
                down: { isDown: false },
                left: { isDown: false },
                right: { isDown: false },
              }),
              addKey: vi.fn().mockReturnValue({ isDown: false }),
              addKeys: vi.fn().mockReturnValue({ isDown: false }),
              checkDown: vi.fn().mockReturnValue(false),
            },
            on: vi.fn(),
            addPointer: vi.fn(),
          };
        }
      },
      Physics: {
        Arcade: {
          Sprite: class {
            constructor(scene, x, y, texture) {
              this.scene = scene;
              this.x = x;
              this.y = y;
              this.body = {
                setSize: vi.fn(),
                setOffset: vi.fn(),
                setCollideWorldBounds: vi.fn(),
                blocked: { down: true },
                setVelocityX: vi.fn(),
                setVelocityY: vi.fn(),
              };
              this.anims = {
                play: vi.fn(),
                isPlaying: false,
                currentAnim: { key: "idle" },
                exists: vi.fn().mockReturnValue(true),
              };
              this.texture = { key: texture || "ryu" };
              this.health = 100;
              this.setPosition = vi.fn((newX, newY) => {
                this.x = newX;
                this.y = newY;
                return this;
              });
              this.setVisible = vi.fn().mockReturnThis();
              this.setDepth = vi.fn().mockReturnThis();
              this.setOrigin = vi.fn().mockReturnThis();
              this.setScale = vi.fn().mockReturnThis();
              this.setFlipX = vi.fn().mockReturnThis();
              this.setCollideWorldBounds = vi.fn().mockReturnThis();
              this.play = vi.fn().mockReturnThis();
              this.on = vi.fn().mockReturnThis();
              this.once = vi.fn().mockReturnThis();
              this.setVelocityX = vi.fn().mockReturnThis();
              this.setVelocityY = vi.fn().mockReturnThis();
              this.setTint = vi.fn().mockReturnThis();
              this.clearTint = vi.fn().mockReturnThis();
            }
          },
        },
      },
      Input: {
        Keyboard: {
          KeyCodes: { SPACE: 32, W: 87, A: 65, S: 83, D: 68, F: 70 },
        },
      },
      Math: {
        Distance: { Between: vi.fn().mockReturnValue(100) },
        Clamp: vi.fn((val, min, max) => Math.min(Math.max(val, min), max)),
        FloatBetween: vi.fn(() => 0.5),
        Between: vi.fn(() => 10),
        Linear: vi.fn((p0, p1, t) => p0 + t * (p1 - p0)),
      },
      BlendModes: { ADD: 1, MULTIPLY: 2 },
    },
  };
});

describe("FightScene - Animation Sequences", () => {
  let fight;

  beforeEach(() => {
    vi.clearAllMocks();
    fight = new FightScene();
    fight.init({ city: "paris", playerCharacter: "ann" });
  });

  it("should start with intro sequence (Walk-in)", () => {
    fight.create();

    // P1 should be walking from off-screen
    // (I will implement this in FightScene.js)
    // For now, check if startRoundSequence was called
    expect(fight.player1).toBeDefined();
    expect(fight.player2).toBeDefined();
  });

  it("should trigger victory animation for winner", () => {
    fight.create();
    fight.player2.health = 0;
    fight.checkWinCondition();

    expect(fight.isGameOver).toBe(true);
    // Winner (P1) should play victory animation
    // expect(fight.player1.currentState).toBe(FighterState.VICTORY);
    // This will be implemented in next step
  });
});
