import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import FightScene from "../src/scenes/FightScene";

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

describe("Accessibility Integration Tests", () => {
  let scene;

  beforeEach(() => {
    localStorageMock.clear();
    scene = new FightScene();

    // Mock internal properties required for checkTutorial
    scene.scene = {
      pause: vi.fn(),
      launch: vi.fn(),
    };

    // Mock logger
    scene.logger = {
      info: vi.fn(),
      warn: vi.fn(),
    };
  });

  it("should trigger TutorialOverlay if first time", () => {
    // Act
    scene.checkTutorial();

    // Assert
    expect(localStorageMock.getItem).toHaveBeenCalledWith("has_seen_tutorial");
    expect(scene.scene.pause).toHaveBeenCalledWith("FightScene");
    expect(scene.scene.launch).toHaveBeenCalledWith("TutorialOverlayScene");
  });

  it("should NOT trigger TutorialOverlay if already seen", () => {
    // Arrange
    localStorageMock.setItem("has_seen_tutorial", "true");

    // Act
    scene.checkTutorial();

    // Assert
    expect(localStorageMock.getItem).toHaveBeenCalledWith("has_seen_tutorial");
    expect(scene.scene.pause).not.toHaveBeenCalled();
    expect(scene.scene.launch).not.toHaveBeenCalled();
  });
});
