import { vi } from "vitest";

// Silence logs by mocking pino
vi.mock("pino", () => {
  const noop = () => {};
  const mockLogger = {
    info: noop,
    error: noop,
    warn: noop,
    debug: noop,
    trace: noop,
    fatal: noop,
    child: () => mockLogger,
    level: "silent",
  };
  return { default: () => mockLogger };
});

// Centralized Phaser Mock
const mockPhaser = {
  Scene: class {
    constructor(key) {
      this.key = key;
    }
  },
  Math: {
    Between: vi.fn((min) => min),
    Clamp: vi.fn((val, min, maxVal) => Math.min(Math.max(val, min), maxVal)),
    Linear: vi.fn((a, b, t) => a + (b - a) * t),
    Distance: { Between: vi.fn(() => 50) },
  },
  Physics: {
    Arcade: {
      Sprite: class {
        constructor() {
          this.body = {
            setSize: vi.fn(),
            setOffset: vi.fn(),
            blocked: {},
            velocity: { x: 0, y: 0 },
          };
          this.setCollideWorldBounds = vi.fn().mockReturnThis();
          this.setOrigin = vi.fn().mockReturnThis();
          this.play = vi.fn().mockReturnThis();
          this.setFlipX = vi.fn().mockReturnThis();
          this.setVelocityX = vi.fn().mockReturnThis();
          this.setVelocityY = vi.fn().mockReturnThis();
          this.setPosition = vi.fn().mockReturnThis();
          this.on = vi.fn().mockReturnThis();
          this.setTint = vi.fn().mockReturnThis();
          this.clearTint = vi.fn().mockReturnThis();
          this.setAlpha = vi.fn().mockReturnThis();
          this.setScale = vi.fn().mockReturnThis();
          this.setDepth = vi.fn().mockReturnThis();
          this.setVisible = vi.fn().mockReturnThis();
          this.texture = { key: "mock" };
          this.anims = {
            isPlaying: true,
            currentFrame: { index: 0 },
            currentAnim: { key: "idle" },
            play: vi.fn().mockReturnThis(),
          };
        }
      },
    },
  },
  Input: {
    Keyboard: {
      KeyCodes: { SPACE: 32, W: 87, S: 83, A: 65, D: 68 },
    },
  },
  Scale: {
    FIT: 0,
    CENTER_BOTH: 1,
  },
  AUTO: 0,
};

// Common GameObject mock factory
const createGameObjectMock = () => ({
  setOrigin: vi.fn().mockReturnThis(),
  setDepth: vi.fn().mockReturnThis(),
  setScrollFactor: vi.fn().mockReturnThis(),
  setAlpha: vi.fn().mockReturnThis(),
  setTint: vi.fn().mockReturnThis(),
  setParticleTint: vi.fn().mockReturnThis(),
  setDisplaySize: vi.fn().mockReturnThis(),
  setScale: vi.fn().mockReturnThis(),
  setFlipX: vi.fn().mockReturnThis(),
  setVisible: vi.fn().mockReturnThis(),
  setPosition: vi.fn().mockReturnThis(),
  setStrokeStyle: vi.fn().mockReturnThis(),
  setText: vi.fn().mockReturnThis(),
  clear: vi.fn().mockReturnThis(),
  destroy: vi.fn(),
  emitParticleAt: vi.fn(),
  stop: vi.fn(),
  on: vi.fn().mockReturnThis(),
  play: vi.fn().mockReturnThis(),
  anims: { play: vi.fn().mockReturnThis(), stop: vi.fn().mockReturnThis() },
  texture: { key: "mock" },
});

// Mock Phaser globally
vi.mock("phaser", () => {
  return {
    default: mockPhaser,
    Math: mockPhaser.Math,
    Scene: mockPhaser.Scene,
    Physics: mockPhaser.Physics,
    Input: mockPhaser.Input,
    Scale: mockPhaser.Scale,
    AUTO: mockPhaser.AUTO,
    GameObjects: mockPhaser.GameObjects,
    ...mockPhaser,
  };
});

// We can also export a helper to create a mock scene
export const createMockScene = () => {
  const scene = {
    add: {
      image: vi.fn(createGameObjectMock),
      sprite: vi.fn(createGameObjectMock),
      tileSprite: vi.fn(createGameObjectMock),
      graphics: vi.fn(() => ({
        ...createGameObjectMock(),
        fillStyle: vi.fn().mockReturnThis(),
        fillCircle: vi.fn().mockReturnThis(),
        fillRect: vi.fn().mockReturnThis(),
        fillPoints: vi.fn().mockReturnThis(),
        strokePoints: vi.fn().mockReturnThis(),
        lineStyle: vi.fn().mockReturnThis(),
        strokeRect: vi.fn().mockReturnThis(),
        generateTexture: vi.fn().mockReturnThis(),
      })),
      particles: vi.fn(createGameObjectMock),
      text: vi.fn(createGameObjectMock),
      rectangle: vi.fn(createGameObjectMock),
      circle: vi.fn(createGameObjectMock),
      zone: vi.fn(createGameObjectMock),
      group: vi.fn(() => ({
        add: vi.fn(),
        get: vi.fn(),
        countActive: vi.fn(),
        getChildren: vi.fn().mockReturnValue([]),
        clear: vi.fn(),
        killAndHide: vi.fn(),
        destroy: vi.fn(),
      })),
      container: vi.fn(() => ({
        add: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setPosition: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
      })),
      existing: vi.fn(),
    },
    physics: {
      add: {
        staticGroup: vi.fn(() => ({
          add: vi.fn(),
          clear: vi.fn(),
          destroy: vi.fn(),
        })),
        existing: vi.fn(),
        collider: vi.fn(),
      },
      world: { setBounds: vi.fn(), pause: vi.fn(), resume: vi.fn() },
      pause: vi.fn(),
      resume: vi.fn(),
    },
    anims: {
      pauseAll: vi.fn(),
      resumeAll: vi.fn(),
      create: vi.fn(),
      exists: vi.fn(() => false),
      generateFrameNumbers: vi.fn(() => []),
      remove: vi.fn(),
    },
    cameras: {
      main: {
        shake: vi.fn(),
        zoom: vi.fn(),
        zoomTo: vi.fn(),
        pan: vi.fn(),
        flash: vi.fn(),
        ignore: vi.fn(),
        scrollX: 0,
        scrollY: 0,
        width: 1024,
        height: 768,
      },
      add: vi.fn(() => ({
        setScroll: vi.fn().mockReturnThis(),
        setZoom: vi.fn().mockReturnThis(),
        setName: vi.fn().mockReturnThis(),
        ignore: vi.fn().mockReturnThis(),
      })),
      remove: vi.fn(),
    },
    time: {
      delayedCall: vi.fn((d, cb) => {
        // Do not execute immediately to allow testing transient states
        // but store it for manual triggering if needed
        return { destroy: vi.fn(), remove: vi.fn(), callback: cb };
      }),
      addEvent: vi.fn(() => ({ destroy: vi.fn() })),
    },
    tweens: {
      add: vi.fn(),
    },
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      once: vi.fn(),
    },
    scale: {
      width: 1024,
      height: 768,
    },
    input: {
      keyboard: {
        createCursorKeys: vi.fn(() => ({
          up: {},
          down: {},
          left: {},
          right: {},
          space: {},
          shift: {},
        })),
        addKey: vi.fn(() => ({})),
        addKeys: vi.fn(() => ({ up: {}, down: {}, left: {}, right: {} })),
      },
      on: vi.fn(),
      once: vi.fn(),
      addPointer: vi.fn(),
    },
    textures: {
      exists: vi.fn(() => true),
      get: vi.fn(() => ({ getSource: vi.fn(() => ({})) })),
      addCanvas: vi.fn(),
      remove: vi.fn(),
    },
    registry: {
      get: vi.fn(),
      set: vi.fn(),
    },
    scene: {
      start: vi.fn(),
      stop: vi.fn(),
      restart: vi.fn(),
    },
  };
  return scene;
};
