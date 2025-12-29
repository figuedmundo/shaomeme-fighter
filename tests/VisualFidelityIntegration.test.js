import { describe, it, expect, vi, beforeEach } from "vitest";

import FightScene from "../src/scenes/FightScene";

// Mock Phaser
vi.mock("phaser", () => {
  const mockGameObject = () => ({
    setScrollFactor: vi.fn().mockReturnThis(),
    setDepth: vi.fn().mockReturnThis(),
    setAlpha: vi.fn().mockReturnThis(),
    setTint: vi.fn().mockReturnThis(),
    setDisplaySize: vi.fn().mockReturnThis(),
    setOrigin: vi.fn().mockReturnThis(),
    setText: vi.fn().mockReturnThis(),
    setScale: vi.fn().mockReturnThis(),
    setFlipX: vi.fn().mockReturnThis(),
    setTexture: vi.fn().mockReturnThis(),
    clearTint: vi.fn().mockReturnThis(),
    play: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setStrokeStyle: vi.fn().mockReturnThis(),
    setVelocityX: vi.fn().mockReturnThis(),
    setVelocityY: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
    clear: vi.fn().mockReturnThis(),
    fillStyle: vi.fn().mockReturnThis(),
    fillRect: vi.fn().mockReturnThis(),
    fillCircle: vi.fn().mockReturnThis(),
    fillEllipse: vi.fn().mockReturnThis(),
    lineStyle: vi.fn().mockReturnThis(),
    strokeRect: vi.fn().mockReturnThis(),
    strokePath: vi.fn().mockReturnThis(),
    beginPath: vi.fn().mockReturnThis(),
    moveTo: vi.fn().mockReturnThis(),
    lineTo: vi.fn().mockReturnThis(),
    generateTexture: vi.fn(),
    visible: true,
    alpha: 1,
    x: 0,
    y: 0,
    tilePositionX: 0,
    texture: { key: "test" },
    anims: { isPlaying: false, currentFrame: { index: 0 }, stop: vi.fn() },
    setCollideWorldBounds: vi.fn().mockReturnThis(),
    body: { setSize: vi.fn(), setOffset: vi.fn(), blocked: { down: true } },
    once: vi.fn(),
    setInteractive: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  });

  const mockClass = class {
    constructor() {
      Object.assign(this, mockGameObject());
    }
  };

  return {
    default: {
      Scene: class {
        constructor() {
          this.scale = { width: 1280, height: 720 };
          this.add = {
            existing: vi.fn(),
            graphics: vi.fn(mockGameObject),
            text: vi.fn(mockGameObject),
            image: vi.fn(mockGameObject),
            tileSprite: vi.fn(mockGameObject),
            particles: vi.fn(() => ({
              setDepth: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
              setParticleTint: vi.fn(),
              emitParticleAt: vi.fn(),
              stop: vi.fn(),
            })),
            rectangle: vi.fn(mockGameObject),
            renderTexture: vi.fn(() => ({
              setDepth: vi.fn().mockReturnThis(),
              setBlendMode: vi.fn().mockReturnThis(),
              draw: vi.fn(),
              setPosition: vi.fn(),
              destroy: vi.fn(),
            })),
            circle: vi.fn(mockGameObject),
            sprite: vi.fn(mockGameObject),
            group: vi.fn(() => ({
              add: vi.fn(),
              children: { iterate: vi.fn() },
              clear: vi.fn(),
              destroy: vi.fn(),
            })),
          };
          this.make = {
            graphics: vi.fn(() => ({
              createRadialGradient: vi.fn().mockReturnThis(),
              fillGradientStyle: vi.fn().mockReturnThis(),
              fillCircle: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
            })),
          };
          this.tweens = {
            add: vi.fn(),
            killTweensOf: vi.fn(),
          };
          this.time = {
            addEvent: vi.fn(() => ({ remove: vi.fn(), reset: vi.fn() })),
            delayedCall: vi.fn(),
          };
          this.textures = {
            exists: vi.fn(() => true),
          };
          this.registry = {
            get: vi.fn(),
          };
          this.physics = {
            add: {
              staticGroup: vi.fn(() => ({
                add: vi.fn(),
              })),
              collider: vi.fn(),
              existing: vi.fn(),
            },
            world: {
              setBounds: vi.fn(),
            },
            pause: vi.fn(),
          };
          this.cameras = {
            main: {
              scrollX: 0,
              scrollY: 0,
              zoom: 1,
              zoomTo: vi.fn(),
              shake: vi.fn(),
            },
          };
          this.anims = {
            exists: vi.fn(() => true),
            create: vi.fn(),
          };
          this.events = {
            on: vi.fn().mockReturnThis(),
            emit: vi.fn(),
          };
          this.input = {
            addPointer: vi.fn(),
            on: vi.fn().mockReturnThis(),
            keyboard: {
              createCursorKeys: vi.fn(() => ({
                left: { isDown: false },
                right: { isDown: false },
                up: { isDown: false },
                down: { isDown: false },
                space: { isDown: false },
              })),
              addKey: vi.fn(() => ({ isDown: false })),
              addKeys: vi.fn(() => ({})),
              checkDown: vi.fn(() => false),
            },
          };
        }
      },
      GameObjects: {
        Sprite: mockClass,
        Graphics: mockClass,
        GameObject: mockClass,
        Image: mockClass,
        Rectangle: mockClass,
      },
      Physics: {
        Arcade: {
          Sprite: mockClass,
          Image: mockClass,
        },
      },
      Input: {
        Keyboard: {
          KeyCodes: { SPACE: 32, W: 87, S: 83, A: 65, D: 68, F: 70 },
        },
      },
      Math: {
        Clamp: (v, min, max) => Math.min(Math.max(v, min), max),
        Between: (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min),
        FloatBetween: (min, max) => Math.random() * (max - min) + min,
        Linear: (a, b, f) => a + (b - a) * f,
        Distance: {
          Between: () => 100,
        },
      },
      BlendModes: {
        ADD: "ADD",
        MULTIPLY: "MULTIPLY",
      },
    },
  };
});

describe("Visual Fidelity Integration", () => {
  let scene;

  beforeEach(() => {
    vi.clearAllMocks();
    scene = new FightScene();
    scene.getCharacterName = vi.fn().mockReturnValue("Test");
  });

  it("should initialize UIManager and Environmental systems in create", () => {
    scene.scale = { width: 1280, height: 720 };

    scene.audioManager = {
      updateScene: vi.fn(),
      playStageMusic: vi.fn(),
      playAnnouncer: vi.fn(),
      playImpact: vi.fn(),
      playHitReaction: vi.fn(),
      playKO: vi.fn(),
      stopMusic: vi.fn(),
      playWhoosh: vi.fn(),
    };
    scene.registry.get.mockReturnValue(scene.audioManager);

    scene.create();

    expect(scene.uiManager).toBeDefined();
    expect(scene.lighting).toBeDefined();
    expect(scene.weather).toBeDefined();
    expect(scene.parallaxBg).toBeDefined();
  });

  it("should update systems in update loop", () => {
    scene.uiManager = { update: vi.fn() };
    scene.lighting = { update: vi.fn() };
    scene.weather = { update: vi.fn() };
    scene.parallaxBg = { update: vi.fn() };
    scene.player1 = { update: vi.fn(), health: 100, x: 100, y: 100 };
    scene.player2 = { update: vi.fn(), health: 100, x: 200, y: 100 };
    scene.movementFX = { update: vi.fn() };
    scene.criticalMoments = { updateHealthPulse: vi.fn() };

    scene.update(0, 16);

    expect(scene.lighting.update).toHaveBeenCalled();
    expect(scene.weather.update).toHaveBeenCalled();
    expect(scene.parallaxBg.update).toHaveBeenCalled();
  });
});
