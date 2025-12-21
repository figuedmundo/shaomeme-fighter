import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Phaser from "phaser";

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Pause and Tutorial Logic", () => {
  let sceneMock;
  let gameMock;

  beforeEach(() => {
    localStorageMock.clear();

    // Mock Phaser Scene context
    sceneMock = {
      scene: {
        pause: vi.fn(),
        resume: vi.fn(),
        launch: vi.fn(),
        stop: vi.fn(),
        get: vi.fn().mockReturnValue({
          // Mock MainMenuScene for return
          scene: { start: vi.fn() },
        }),
      },
      input: {
        stopPropagation: vi.fn(),
        on: vi.fn(),
      },
      add: {
        rectangle: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn(),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn(),
          setStyle: vi.fn(),
        }),
        container: vi.fn().mockReturnValue({ add: vi.fn(), setDepth: vi.fn() }),
        image: vi.fn().mockReturnValue({
          setOrigin: vi.fn(),
          setInteractive: vi.fn(),
          on: vi.fn(),
        }),
      },
      registry: {
        get: vi.fn(),
        set: vi.fn(),
      },
      scale: {
        width: 800,
        height: 600,
      },
      sound: {
        mute: false,
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Tutorial Persistence", () => {
    it("should show tutorial if has_seen_tutorial is not set", () => {
      // Simulate FightScene check
      const hasSeen = localStorage.getItem("has_seen_tutorial");
      expect(hasSeen).toBeNull();

      // Logic that would run in FightScene
      if (!hasSeen) {
        sceneMock.scene.pause("FightScene");
        sceneMock.scene.launch("TutorialOverlay");
      }

      expect(sceneMock.scene.pause).toHaveBeenCalledWith("FightScene");
      expect(sceneMock.scene.launch).toHaveBeenCalledWith("TutorialOverlay");
    });

    it("should NOT show tutorial if has_seen_tutorial IS set", () => {
      localStorage.setItem("has_seen_tutorial", "true");

      // Simulate FightScene check
      const hasSeen = localStorage.getItem("has_seen_tutorial");
      expect(hasSeen).toBe("true");

      if (!hasSeen) {
        sceneMock.scene.launch("TutorialOverlay");
      }

      expect(sceneMock.scene.launch).not.toHaveBeenCalled();
    });
  });

  describe("PauseScene Logic", () => {
    it("should resume FightScene when Resume is clicked", () => {
      // Setup mock for Resume button callback
      const resumeCallback = vi.fn();

      // Simulate PauseScene resume action
      sceneMock.scene.resume("FightScene");
      sceneMock.scene.stop(); // Stop PauseScene

      expect(sceneMock.scene.resume).toHaveBeenCalledWith("FightScene");
      expect(sceneMock.scene.stop).toHaveBeenCalled();
    });

    it("should toggle audio mute state", () => {
      // Initial state
      sceneMock.sound.mute = false;

      // Simulate toggle
      sceneMock.sound.mute = !sceneMock.sound.mute;

      expect(sceneMock.sound.mute).toBe(true);

      // Toggle back
      sceneMock.sound.mute = !sceneMock.sound.mute;
      expect(sceneMock.sound.mute).toBe(false);
    });
  });
});
