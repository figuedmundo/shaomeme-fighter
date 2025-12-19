import { describe, it, expect, vi, beforeEach } from "vitest";

import UIManager from "../src/systems/UIManager";

// Mock Phaser
vi.mock("phaser", () => {
  return {
    default: {
      GameObjects: {
        Graphics: class {
          constructor() {
            this.clear = vi.fn().mockReturnThis();
            this.fillStyle = vi.fn().mockReturnThis();
            this.fillRect = vi.fn().mockReturnThis();
            this.strokeRect = vi.fn().mockReturnThis();
            this.lineStyle = vi.fn().mockReturnThis();
            this.setScrollFactor = vi.fn().mockReturnThis();
            this.setDepth = vi.fn().mockReturnThis();
            this.setAlpha = vi.fn().mockReturnThis();
            this.visible = true;
          }
        },
        Text: class {
          constructor() {
            this.setText = vi.fn().mockReturnThis();
            this.setOrigin = vi.fn().mockReturnThis();
            this.setScrollFactor = vi.fn().mockReturnThis();
            this.setDepth = vi.fn().mockReturnThis();
            this.setAlpha = vi.fn().mockReturnThis();
            this.setScale = vi.fn().mockReturnThis();
            this.style = {};
          }
        },
        Image: class {
          constructor() {
            this.setScrollFactor = vi.fn().mockReturnThis();
            this.setDepth = vi.fn().mockReturnThis();
            this.setScale = vi.fn().mockReturnThis();
            this.setAlpha = vi.fn().mockReturnThis();
            this.setDisplaySize = vi.fn().mockReturnThis();
            this.setFlipX = vi.fn().mockReturnThis();
            this.setTexture = vi.fn().mockReturnThis();
            this.setTint = vi.fn().mockReturnThis();
            this.clearTint = vi.fn().mockReturnThis();
          }
        },
      },
      Math: {
        Clamp: (v, min, max) => Math.min(Math.max(v, min), max),
        Between: (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min),
        Linear: (a, b, f) => a + (b - a) * f,
      },
      Display: {
        Color: {
          HexStringToColor: vi.fn(() => ({ color: 0xffffff })),
        },
      },
    },
  };
});

const mockScene = {
  add: {
    graphics: vi.fn(() => ({
      clear: vi.fn().mockReturnThis(),
      fillStyle: vi.fn().mockReturnThis(),
      fillRect: vi.fn().mockReturnThis(),
      fillPoints: vi.fn().mockReturnThis(),
      strokePoints: vi.fn().mockReturnThis(),
      strokeRect: vi.fn().mockReturnThis(),
      lineStyle: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
    })),
    text: vi.fn(() => ({
      setText: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setAlpha: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
    })),
    image: vi.fn(() => ({
      setScrollFactor: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      setAlpha: vi.fn().mockReturnThis(),
      setDisplaySize: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      setTexture: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      clearTint: vi.fn().mockReturnThis(),
    })),
  },
  scale: { width: 1280, height: 720 },
  tweens: {
    add: vi.fn(),
  },
  time: {
    addEvent: vi.fn(() => ({ remove: vi.fn() })),
    delayedCall: vi.fn(),
  },
  textures: {
    exists: vi.fn(() => true),
  },
  cameras: {
    main: {
      ignore: vi.fn(),
    },
    add: vi.fn(() => ({
      setScroll: vi.fn().mockReturnThis(),
      setZoom: vi.fn().mockReturnThis(),
      setName: vi.fn().mockReturnThis(),
      ignore: vi.fn().mockReturnThis(),
    })),
    remove: vi.fn(),
  },
};

describe("UIManager", () => {
  let uiManager;

  beforeEach(() => {
    vi.clearAllMocks();
    uiManager = new UIManager(mockScene, {
      p1Name: "Player 1",
      p2Name: "Player 2",
      matchTime: 99,
    });
  });

  it("should initialize with HUD elements", () => {
    expect(mockScene.add.graphics).toHaveBeenCalled();
    expect(mockScene.add.text).toHaveBeenCalled();
  });

  it("should update health display and track ghost bar", () => {
    uiManager.updateHealth(1, 80);
    expect(uiManager.p1Health).toBe(80);
    expect(uiManager.p1GhostHealth).toBe(100);
  });

  it("should update combo display", () => {
    uiManager.updateCombo(3, true);
    expect(uiManager.p1Combo).toBe(3);
    // On first combo, text is created
    expect(mockScene.add.text).toHaveBeenCalled();
  });

  it("should start and stop timer", () => {
    uiManager.startTimer();
    expect(uiManager.isTimerRunning).toBe(true);
    uiManager.stopTimer();
    expect(uiManager.isTimerRunning).toBe(false);
  });
});
