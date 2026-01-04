import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Phaser from "phaser";
import { EventEmitter } from "events";
import CreditsScene from "../src/scenes/CreditsScene";

// Mock Phaser Curves and Math
Phaser.Curves = {
  Spline: class {
    constructor(points) {
      this.points = points;
    }

    getPoint() {
      return { x: 100, y: 100 };
    }

    getTangent() {
      return { angle: () => 0 };
    }

    getPoints(quantity) {
      return Array(quantity).fill({ x: 0, y: 0 });
    }
  },
};
Phaser.Math = {
  Interpolation: {
    SmoothStep: vi.fn((t, min, max) => min + (max - min) * t),
  },
};

// Mock SceneTransition
vi.mock("../src/utils/SceneTransition", () => {
  return {
    default: class MockTransition {
      constructor(scene) {
        this.scene = scene;
      }

      fadeIn() {
        return Promise.resolve();
      }

      fadeOut() {
        return Promise.resolve();
      }

      transitionTo(target, data) {
        this.scene.scene.start(target, data);
        return Promise.resolve();
      }
    },
    addTransitions: (targetScene) => {
      const ts = targetScene;
      ts.transition = {
        fadeIn: vi.fn().mockResolvedValue(),
        fadeOut: vi.fn().mockResolvedValue(),
        transitionTo: vi.fn().mockResolvedValue(),
      };
      return ts.transition;
    },
    TransitionPresets: {
      QUICK: { type: "fade", duration: 250 },
      BACK_TO_MENU: { type: "fade", duration: 400 },
    },
  };
});

describe("CreditsScene Letter Sequence", () => {
  let game;
  let scene;

  beforeEach(() => {
    game = {
      config: { width: 800, height: 600 },
      registry: {
        get: vi.fn(),
        set: vi.fn(),
      },
    };
    scene = new CreditsScene();
    scene.sys = {
      game,
      scale: { width: 800, height: 600 },
      events: new EventEmitter(),
      settings: { data: {} },
      queueDepth: 0,
      textures: { get: () => ({ get: () => ({}) }) },
    };
    scene.scale = { width: 800, height: 600 };
    scene.registry = game.registry;
    scene.cameras = {
      main: {
        setBackgroundColor: vi.fn(),
        fadeOut: vi.fn(),
        fadeIn: vi.fn(),
      },
    };
    scene.scene = { start: vi.fn() };
    scene.tweens = {
      add: vi.fn().mockReturnValue({
        stop: vi.fn(),
        destroy: vi.fn(),
        duration: 4000,
      }),
    };
    scene.time = {
      delayedCall: vi.fn(),
      addEvent: vi.fn().mockReturnValue({ destroy: vi.fn() }),
    };
    scene.input = {
      on: vi.fn(),
      once: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with full letter text (no typewriter)", () => {
    const textObjects = [];
    scene.add = {
      graphics: vi.fn().mockReturnValue({
        clear: vi.fn().mockReturnThis(),
        lineStyle: vi.fn().mockReturnThis(),
        fillStyle: vi.fn().mockReturnThis(),
        beginPath: vi.fn().mockReturnThis(),
        moveTo: vi.fn().mockReturnThis(),
        lineTo: vi.fn().mockReturnThis(),
        strokePath: vi.fn().mockReturnThis(),
        quadraticBezierTo: vi.fn().mockReturnThis(),
        fillCircle: vi.fn().mockReturnThis(),
        fillEllipse: vi.fn().mockReturnThis(),
        save: vi.fn().mockReturnThis(),
        restore: vi.fn().mockReturnThis(),
        translate: vi.fn().mockReturnThis(),
        rotate: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      }),
      text: vi.fn().mockImplementation((x, y, content) => {
        const t = {
          text: content,
          content,
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setAlpha: vi.fn().mockReturnThis(),
          setWordWrapWidth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
          alpha: 0, // Starts hidden
        };
        textObjects.push(t);
        return t;
      }),
      container: vi.fn().mockReturnValue({
        add: vi.fn(),
        setAlpha: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
        alpha: 0,
      }),
    };

    scene.create();

    // The letter text is created with full content initially
    const letterText = textObjects[0];
    expect(letterText).toBeDefined();
    expect(letterText.text).toContain("Shaomeme QQ");

    // Check font
    const styleObj = vi.mocked(scene.add.text).mock.calls[0][3]; // It's (x, y, content, style)
    expect(styleObj.fontFamily).toContain("Press Start 2P");
    expect(styleObj.fontSize).toBe("18px");

    // Check if transition trigger is registered
    expect(scene.input.on).toHaveBeenCalledWith(
      "pointerdown",
      expect.any(Function),
    );
  });

  it("should transition to credits on pointerdown", () => {
    const textObjects = [];
    scene.add = {
      graphics: vi.fn().mockReturnValue({
        clear: vi.fn().mockReturnThis(),
        lineStyle: vi.fn().mockReturnThis(),
        fillStyle: vi.fn().mockReturnThis(),
        beginPath: vi.fn().mockReturnThis(),
        moveTo: vi.fn().mockReturnThis(),
        lineTo: vi.fn().mockReturnThis(),
        strokePath: vi.fn().mockReturnThis(),
        quadraticBezierTo: vi.fn().mockReturnThis(),
        fillCircle: vi.fn().mockReturnThis(),
        fillEllipse: vi.fn().mockReturnThis(),
        save: vi.fn().mockReturnThis(),
        restore: vi.fn().mockReturnThis(),
        translate: vi.fn().mockReturnThis(),
        rotate: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      }),
      text: vi.fn().mockImplementation((x, y, content) => {
        const t = {
          text: content,
          setStyle: vi.fn().mockReturnThis(), // Added for hover effects
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockImplementation((event, fn) => {
            // Store handler to simulate events later
            t._handlers = t._handlers || {};
            t._handlers[event] = fn;
            return t;
          }),
          setAlpha: vi.fn().mockReturnThis(),
          setWordWrapWidth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
          alpha: 1,
        };
        textObjects.push(t);
        return t;
      }),
      container: vi.fn().mockReturnValue({
        add: vi.fn(),
        setAlpha: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
        alpha: 0,
      }),
      particles: vi.fn().mockReturnValue({
        destroy: vi.fn(),
      }),
    };

    scene.create();

    // Get the pointerdown handler
    const pointerDownHandler = scene.input.on.mock.calls.find(
      (call) => call[0] === "pointerdown",
    )[1];

    // Simulate tap
    pointerDownHandler();

    // Should transition (which involves destroying text)
    expect(scene.tweens.add).toHaveBeenCalled();
  });

  it("should trigger easter egg after 5 taps on love text", () => {
    const textObjects = [];
    scene.registry.get.mockReturnValue({
      // Mock audioManager
      playUi: vi.fn(),
    });

    scene.add = {
      graphics: vi.fn().mockReturnValue({
        clear: vi.fn().mockReturnThis(),
        lineStyle: vi.fn().mockReturnThis(),
        fillStyle: vi.fn().mockReturnThis(),
        beginPath: vi.fn().mockReturnThis(),
        moveTo: vi.fn().mockReturnThis(),
        lineTo: vi.fn().mockReturnThis(),
        strokePath: vi.fn().mockReturnThis(),
        quadraticBezierTo: vi.fn().mockReturnThis(),
        fillCircle: vi.fn().mockReturnThis(),
        fillEllipse: vi.fn().mockReturnThis(),
        save: vi.fn().mockReturnThis(),
        restore: vi.fn().mockReturnThis(),
        translate: vi.fn().mockReturnThis(),
        rotate: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      }),
      text: vi.fn().mockImplementation((x, y, content) => {
        const t = {
          text: content,
          content,
          setStyle: vi.fn().mockReturnThis(),
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockImplementation((event, fn) => {
            t._handlers = t._handlers || {};
            t._handlers[event] = fn;
            return t;
          }),
          setAlpha: vi.fn().mockReturnThis(),
          setWordWrapWidth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
          alpha: 1,
        };
        textObjects.push(t);
        return t;
      }),
      container: vi.fn().mockReturnValue({
        add: vi.fn(),
        setAlpha: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
        alpha: 0,
      }),
      particles: vi.fn().mockReturnValue({
        destroy: vi.fn(),
      }),
    };

    scene.create();

    // Find the love text
    const loveText = textObjects.find(
      (t) => t.content && t.content.includes("Made with love"),
    );
    expect(loveText).toBeDefined();

    // Simulate 5 taps
    const handler = loveText._handlers.pointerdown;
    expect(handler).toBeDefined();

    for (let i = 0; i < 5; i += 1) {
      handler();
    }
    // Check Audio
    const audioManager = scene.registry.get();
    expect(audioManager.playUi).toHaveBeenCalledWith("secret_found");

    // Check Particles
    expect(scene.add.particles).toHaveBeenCalled();
  });
});
