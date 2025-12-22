import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Phaser from "phaser";
import { EventEmitter } from "events";
import SplashScene from "../src/scenes/SplashScene";
import CreditsScene from "../src/scenes/CreditsScene";

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
      ts.transition = new (class MockTransition {
        constructor(s) {
          this.scene = s;
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
      })(ts);
      return ts.transition;
    },
    TransitionPresets: {
      QUICK: { type: "fade", duration: 250 },
      BACK_TO_MENU: { type: "fade", duration: 400 },
    },
  };
});

describe("Branding Scenes", () => {
  let game;
  let scene;

  beforeEach(() => {
    // Setup basic Phaser game mock
    game = {
      config: { width: 800, height: 600 },
      registry: {
        get: vi.fn(),
        set: vi.fn(),
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("SplashScene", () => {
    it("should initialize correctly", () => {
      scene = new SplashScene();
      scene.sys = { settings: { key: "SplashScene" } };
      expect(scene).toBeInstanceOf(Phaser.Scene);
      expect(scene.sys.settings.key).toBe("SplashScene");
    });

    it("should handle skip on pointer down", () => {
      scene = new SplashScene();
      scene.sys = {
        game,
        scale: { width: 800, height: 600 },
        events: new EventEmitter(),
      };
      scene.scale = { width: 800, height: 600 };
      scene.registry = game.registry;
      scene.cameras = {
        main: {
          setBackgroundColor: vi.fn(),
          fadeOut: vi.fn(),
          fadeIn: vi.fn(),
          once: vi.fn(),
        },
      };

      // Mock methods
      scene.add = {
        image: vi.fn().mockReturnValue({
          setAlpha: vi.fn().mockReturnThis(),
          setScale: vi.fn().mockReturnThis(),
          setOrigin: vi.fn().mockReturnThis(),
        }),
        rectangle: vi.fn().mockReturnValue({
          setInteractive: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          on: vi.fn().mockImplementation((event, callback) => {
            if (event === "pointerdown") {
              scene._skipCallback = callback;
            }
            return { setDepth: vi.fn() };
          }),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setAlpha: vi.fn(),
        }),
      };
      scene.scene = { start: vi.fn() };
      scene.tweens = {
        add: vi.fn(),
        chain: vi.fn().mockReturnValue({
          stop: vi.fn(),
        }),
      };
      scene.time = { delayedCall: vi.fn() };

      scene.create();

      // Verify skip setup
      expect(scene.add.rectangle).toHaveBeenCalled();

      // Trigger skip
      if (scene._skipCallback) scene._skipCallback();

      // Should attempt transition
      expect(scene.scene.start).toHaveBeenCalledWith(
        "MainMenuScene",
        expect.any(Object),
      );
    });
  });

  describe("CreditsScene", () => {
    it("should initialize correctly", () => {
      scene = new CreditsScene();
      scene.sys = { settings: { key: "CreditsScene" } };
      expect(scene).toBeInstanceOf(Phaser.Scene);
      expect(scene.sys.settings.key).toBe("CreditsScene");
    });

    it("should handle easter egg trigger", () => {
      scene = new CreditsScene();
      scene.sys = {
        game,
        scale: { width: 800, height: 600 },
        events: new EventEmitter(),
      };
      scene.scale = { width: 800, height: 600 };
      scene.registry = game.registry;

      // Mock AudioManager
      const mockAudio = { playUi: vi.fn() };
      game.registry.get.mockReturnValue(mockAudio);

      // Mock display methods
      const createMockText = (content) => ({
        content,
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn(),
        setStyle: vi.fn(),
      });

      const textObjects = [];
      scene.add = {
        text: vi.fn().mockImplementation((x, y, content) => {
          const t = createMockText(content);
          textObjects.push(t);
          return t;
        }),
        image: vi.fn().mockReturnValue({ setScale: vi.fn() }),
        particles: vi.fn().mockReturnValue({ destroy: vi.fn() }),
      };
      scene.scene = { start: vi.fn() };
      scene.tweens = { add: vi.fn() };
      scene.time = { delayedCall: vi.fn() };

      scene.create();

      // Find the "Made with love" text object
      const loveText = textObjects.find((t) =>
        t.content.includes("Made with love"),
      );
      expect(loveText).toBeDefined();

      let clickHandler;
      loveText.on.mockImplementation((event, callback) => {
        if (event === "pointerdown") clickHandler = callback;
      });

      // Re-run logic to capture handler (simulated by manually re-binding if we could,
      // but since create() ran once, we missed the capture if we set implementation AFTER.
      // We must check if 'on' was called with the handler)

      // Get the calls to 'on' from the loveText mock
      const onCalls = loveText.on.mock.calls;
      const [, capturedHandler] = onCalls.find(
        (call) => call[0] === "pointerdown",
      );

      // Simulate 5 clicks
      for (let i = 0; i < 5; i += 1) {
        if (capturedHandler) capturedHandler();
      }

      // Should play secret sound
      expect(mockAudio.playUi).toHaveBeenCalledWith(
        expect.stringContaining("secret"),
      );
    });
  });
});
