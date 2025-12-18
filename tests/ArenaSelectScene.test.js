import { describe, it, expect, vi, beforeEach } from "vitest";

import ArenaSelectScene from "../src/scenes/ArenaSelectScene";

// Mock Phaser class and Scene
vi.mock("phaser", () => {
  class Scene {
    constructor(key) {
      this.key = key;
      this.sys = { settings: { key } };
      this.load = {
        image: vi.fn(),
        start: vi.fn(),
        on: vi.fn((event, cb) => {
          if (event === "complete") cb();
          return this.load;
        }),
        once: vi.fn((event, cb) => {
          if (event === "complete") cb();
          return this.load;
        }),
      };
      this.add = {
        image: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setDisplaySize: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setTexture: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
          setText: vi.fn().mockReturnThis(),
        }),
        graphics: vi.fn().mockReturnValue({
          fillGradientStyle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
        }),
        rectangle: vi.fn().mockReturnValue({
          setStrokeStyle: vi.fn().mockReturnThis(),
          setFillStyle: vi.fn().mockReturnThis(),
        }),
      };
      this.scale = { width: 1024, height: 768 };
      this.scene = { start: vi.fn() };
    }
  }
  return {
    default: { Scene },
  };
});

describe("ArenaSelectScene", () => {
  let scene;

  beforeEach(() => {
    // Reset global fetch mock
    global.fetch = vi.fn();
    scene = new ArenaSelectScene();

    // Since we mocked the class, we need to ensure the instance has the mocked properties
    // The vi.mock above handles the import, so 'new ArenaSelectScene()' extends the mocked Phaser.Scene
  });

  it("should be defined", () => {
    expect(scene).toBeDefined();
    // Verify key if accessible, or just existence
    expect(scene).toBeInstanceOf(Object);
  });

  it("should fetch cities and then photos for each city", async () => {
    const mockCities = ["paris", "tokyo"];
    const mockPhotosParis = [
      { url: "/cache/paris/1.webp", filename: "1.webp" },
    ];
    const mockPhotosTokyo = [
      { url: "/cache/tokyo/2.webp", filename: "2.webp" },
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCities,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotosParis,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotosTokyo,
      });

    // Mock loading text for the method to update
    scene.loadingText = { setText: vi.fn(), setVisible: vi.fn() };
    scene.fightBtn = { setVisible: vi.fn() };

    // Mock UI elements required by selectArena() which is called inside fetchArenas flow
    scene.heroBackground = { setTexture: vi.fn(), setDisplaySize: vi.fn() };
    scene.titleText = { setText: vi.fn() };
    // selectArena iterates thumbnails, so we need to ensure it doesn't crash
    scene.thumbnails = [];
    // We mock buildGrid to populate thumbnails so selectArena has something to select if logic requires it,
    // or we just let it be empty. The logic is `this.buildGrid()` then `this.selectArena(0)`.
    // Since buildGrid relies on `add.image`, our mock setup in beforeEach handles the creation,
    // but `scene.thumbnails` array needs to be populated or buildGrid needs to run effectively.
    // The `load.once` mock executes the callback which calls `buildGrid`.
    // Let's rely on the `add.image` mock in beforeEach to return objects, but we need to verify `buildGrid` pushes to `thumbnails`.
    // Actually, simply spying on selectArena to prevent it from running UI logic might be cleaner for this DATA fetching test,
    // BUT since we are testing the full flow, let's just ensure the UI stubs exist.

    // We already mocked `scene.add.image` in beforeEach to return a usable mock object.
    // However, `buildGrid` pushes to `this.thumbnails`.
    // `selectArena` uses `this.thumbnails[index]`.
    // We need to ensure `buildGrid` works or `selectArena` doesn't crash.

    // Simplest fix: stub selectArena for THIS test, since we test selectArena separately in the next test.
    scene.selectArena = vi.fn();

    await scene.fetchArenas();

    expect(global.fetch).toHaveBeenCalledWith("/api/cities");
    expect(global.fetch).toHaveBeenCalledWith("/api/photos?city=paris");
    expect(global.fetch).toHaveBeenCalledWith("/api/photos?city=tokyo");

    expect(scene.arenas).toHaveLength(2);
    expect(scene.arenas[0]).toEqual({
      name: "paris",
      url: "/cache/paris/1.webp",
    });
  });

  it("should update selected arena state", () => {
    scene.arenas = [
      { name: "paris", url: "/cache/paris/1.webp" },
      { name: "tokyo", url: "/cache/tokyo/2.webp" },
    ];

    // Mock UI elements that would exist after create()
    scene.heroBackground = { setTexture: vi.fn(), setDisplaySize: vi.fn() };
    scene.titleText = { setText: vi.fn() };
    scene.thumbnails = [
      { border: { setStrokeStyle: vi.fn() } },
      { border: { setStrokeStyle: vi.fn() } },
    ];

    scene.selectArena(1);

    expect(scene.selectedArenaIndex).toBe(1);
    expect(scene.titleText.setText).toHaveBeenCalledWith("TOKYO");
    expect(scene.thumbnails[1].border.setStrokeStyle).toHaveBeenCalledWith(
      4,
      0xffd700,
    );
  });
});
