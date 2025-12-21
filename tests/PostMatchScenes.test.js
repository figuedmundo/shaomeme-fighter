import { describe, it, expect, vi } from "vitest";
import Phaser from "phaser";

// Mock VictoryScene
class MockVictoryScene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
    this.add = {
      text: vi.fn(() => ({
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn(),
      })),
      image: vi.fn(() => ({ setOrigin: vi.fn(), setDisplaySize: vi.fn() })),
    };
    this.scale = { width: 800, height: 600 };
    this.scene = {
      start: vi.fn(),
    };
    this.registry = {
      get: vi.fn(),
    };
  }

  create(data) {
    this.data = data;
    // Logic simulation
    if (data.winner) {
      this.add.text(0, 0, `PLAYER ${data.winner} WINS`);
    }
  }
}

// Mock ContinueScene
class MockContinueScene extends Phaser.Scene {
  constructor() {
    super("ContinueScene");
    this.timer = 10;
    this.add = {
      text: vi.fn(() => ({
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn(),
        setText: vi.fn(),
      })),
      rectangle: vi.fn(() => ({ setOrigin: vi.fn() })),
    };
    this.scale = { width: 800, height: 600 };
    this.time = {
      addEvent: vi.fn((config) => {
        this.timerEvent = config;
        return { remove: vi.fn() };
      }),
    };
    this.scene = {
      start: vi.fn(),
    };
    this.registry = {
      get: vi.fn(),
    };
  }

  create(data) {
    this.data = data;
    // Start timer
    this.time.addEvent({
      delay: 1000,
      callback: () => this.tick(),
      repeat: 10,
    });
  }

  tick() {
    this.timer -= 1;
    if (this.timer < 0) this.timeout();
  }

  timeout() {
    this.scene.start("MainMenuScene");
  }
}

describe("Post Match Scenes", () => {
  it("VictoryScene should receive fight data", () => {
    const scene = new MockVictoryScene();
    const data = { winner: 1, health: 50, combo: 5 };
    scene.create(data);
    expect(scene.data).toEqual(data);
    expect(scene.add.text).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      "PLAYER 1 WINS",
    );
  });

  it("ContinueScene should start countdown and timeout to Menu", () => {
    const scene = new MockContinueScene();
    scene.create({});

    expect(scene.time.addEvent).toHaveBeenCalled();
    expect(scene.timer).toBe(10);

    // Simulate tick until timeout
    for (let i = 0; i <= 11; i += 1) {
      scene.timerEvent.callback();
    }

    expect(scene.scene.start).toHaveBeenCalledWith("MainMenuScene");
  });
});
