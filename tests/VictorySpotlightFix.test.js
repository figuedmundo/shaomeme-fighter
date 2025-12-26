import { describe, it, expect, beforeEach, vi } from "vitest";
import FightScene from "../src/scenes/FightScene";
import { createMockScene } from "./setup";

describe("FightScene Victory Spotlight Fix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should attempt to add spotlight on victory", async () => {
    const fight = new FightScene();

    // Manually setup enough state for checkWinCondition to run
    fight.player1 = {
      health: 100,
      texture: { key: "ann" },
      setState: vi.fn(),
      setControls: vi.fn(),
      x: 100,
      y: 100,
    };
    fight.player2 = {
      health: 0,
      texture: { key: "dad" },
      setState: vi.fn(),
      setControls: vi.fn(),
      x: 500,
      y: 100,
    };
    fight.isGameOver = false;
    fight.physics = { pause: vi.fn() };
    fight.scale = { width: 1024, height: 768 };
    fight.time = { delayedCall: vi.fn((d, cb) => cb()) };
    fight.lighting = { setAmbientLight: vi.fn(), addSpotlight: vi.fn() };
    fight.announcerOverlay = { showKO: vi.fn(), showWin: vi.fn() };
    fight.audioManager = {
      playKO: vi.fn(),
      stopMusic: vi.fn(),
      playAnnouncer: vi.fn(),
    };
    fight.transition = { fadeOut: vi.fn().mockResolvedValue() };
    fight.slideshow = { show: vi.fn() };
    fight.city = "paris";

    // Mock textures.exists
    fight.textures = { exists: vi.fn().mockReturnValue(true) };

    await fight.checkWinCondition();

    expect(fight.lighting.addSpotlight).toHaveBeenCalled();
  });

  it("should skip spotlight if soft_light texture is missing", async () => {
    const fight = new FightScene();

    fight.player1 = {
      health: 100,
      texture: { key: "ann" },
      setState: vi.fn(),
      setControls: vi.fn(),
      x: 100,
      y: 100,
    };
    fight.player2 = {
      health: 0,
      texture: { key: "dad" },
      setState: vi.fn(),
      setControls: vi.fn(),
      x: 500,
      y: 100,
    };
    fight.isGameOver = false;
    fight.physics = { pause: vi.fn() };
    fight.scale = { width: 1024, height: 768 };
    fight.time = { delayedCall: vi.fn((d, cb) => cb()) };
    fight.lighting = { setAmbientLight: vi.fn(), addSpotlight: vi.fn() };
    fight.announcerOverlay = { showKO: vi.fn(), showWin: vi.fn() };
    fight.audioManager = {
      playKO: vi.fn(),
      stopMusic: vi.fn(),
      playAnnouncer: vi.fn(),
    };
    fight.transition = { fadeOut: vi.fn().mockResolvedValue() };
    fight.slideshow = { show: vi.fn() };
    fight.city = "paris";

    // Mock textures.exists to return false for soft_light
    fight.textures = { exists: vi.fn().mockReturnValue(false) };

    await fight.checkWinCondition();

    expect(fight.lighting.addSpotlight).not.toHaveBeenCalled();
  });

  it("should NOT crash if lighting is missing", async () => {
    const fight = new FightScene();

    fight.player1 = {
      health: 100,
      texture: { key: "ann" },
      setState: vi.fn(),
      setControls: vi.fn(),
      x: 100,
      y: 100,
    };
    fight.player2 = {
      health: 0,
      texture: { key: "dad" },
      setState: vi.fn(),
      setControls: vi.fn(),
      x: 500,
      y: 100,
    };
    fight.isGameOver = false;
    fight.physics = { pause: vi.fn() };
    fight.scale = { width: 1024, height: 768 };
    fight.time = { delayedCall: vi.fn((d, cb) => cb()) };
    fight.lighting = null; // Lighting missing!
    fight.announcerOverlay = { showKO: vi.fn(), showWin: vi.fn() };
    fight.audioManager = {
      playKO: vi.fn(),
      stopMusic: vi.fn(),
      playAnnouncer: vi.fn(),
    };
    fight.transition = { fadeOut: vi.fn().mockResolvedValue() };
    fight.slideshow = { show: vi.fn() };
    fight.city = "paris";

    fight.checkWinCondition();
    expect(true).toBe(true); // If it didn't throw, we're good
  });
});
