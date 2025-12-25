import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ArenaSelectScene from "../src/scenes/ArenaSelectScene";

// Mock Phaser
global.Phaser = {
  Scene: class Scene {
    constructor(key) {
      this.key = key;
      this.scale = { width: 800, height: 600 };
      this.add = {
        image: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setDisplaySize: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setTexture: vi.fn().mockReturnThis(),
          preFX: {
            addColorMatrix: vi.fn().mockReturnValue({
              sepia: vi.fn(),
              contrast: vi.fn(),
              grayscale: vi.fn(),
            }),
          }, // Mock pipeline/FX
          setTint: vi.fn().mockReturnThis(),
          clearTint: vi.fn().mockReturnThis(),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setInteractive: vi.fn().mockReturnThis(),
          on: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
          setText: vi.fn().mockReturnThis(),
          disableInteractive: vi.fn().mockReturnThis(),
        }),
        graphics: vi.fn().mockReturnValue({
          fillGradientStyle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeRect: vi.fn().mockReturnThis(),
          strokeRoundedRect: vi.fn().mockReturnThis(),
          fillStyle: vi.fn().mockReturnThis(),
          fillRoundedRect: vi.fn().mockReturnThis(),
          generateTexture: vi.fn(),
          destroy: vi.fn(),
        }),
        rectangle: vi.fn().mockReturnValue({
          setStrokeStyle: vi.fn().mockReturnThis(),
          setFillStyle: vi.fn().mockReturnThis(),
        }),
        container: vi.fn().mockReturnValue({
          add: vi.fn().mockReturnThis(),
          setPosition: vi.fn().mockReturnThis(),
          setAngle: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
        }),
      };
      this.load = {
        image: vi.fn(),
        once: vi.fn(),
        start: vi.fn(),
      };
      this.scene = {
        start: vi.fn(),
      };
      this.registry = {
        get: vi.fn(),
      };
    }
  },
  GameObjects: {
    Container: class Container {},
  },
};

describe("ArenaSelectScene - Lock Logic", () => {
  let scene;

  beforeEach(() => {
    scene = new ArenaSelectScene();
    scene.audioManager = { playUi: vi.fn() };

    // Explicitly mock Phaser properties on the instance
    scene.load = { image: vi.fn(), once: vi.fn(), start: vi.fn() };
    scene.add = {
      image: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setDisplaySize: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        setTexture: vi.fn().mockReturnThis(),
        preFX: {
          addColorMatrix: vi.fn().mockReturnValue({
            sepia: vi.fn(),
            contrast: vi.fn(),
            grayscale: vi.fn(),
          }),
        },
        setTint: vi.fn().mockReturnThis(),
        clearTint: vi.fn().mockReturnThis(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setText: vi.fn().mockReturnThis(),
        disableInteractive: vi.fn().mockReturnThis(),
      }),
      graphics: vi.fn().mockReturnValue({
        fillGradientStyle: vi.fn().mockReturnThis(),
        fillRect: vi.fn().mockReturnThis(),
        lineStyle: vi.fn().mockReturnThis(),
        strokeRoundedRect: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      }),
      rectangle: vi.fn().mockReturnValue({
        setStrokeStyle: vi.fn().mockReturnThis(),
        setFillStyle: vi.fn().mockReturnThis(),
      }),
      container: vi.fn().mockReturnValue({
        add: vi.fn().mockReturnThis(),
        setAngle: vi.fn().mockReturnThis(),
      }),
    };

    // Mock properties that create() usually sets up but we are skipping create()
    scene.loadingText = { setText: vi.fn(), setVisible: vi.fn() };
    scene.scale = { width: 800, height: 600 };
    scene.heroBackground = { setTexture: vi.fn(), setDisplaySize: vi.fn() };
    scene.titleText = { setText: vi.fn() };
    scene.thumbnails = [];
    scene.fightBtn = {
      setVisible: vi.fn(),
      setInteractive: vi.fn(),
      disableInteractive: vi.fn(),
    };

    // Reset Fetch Mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch arenas and process photo counts correctly", async () => {
    // Mock /api/cities response
    const mockCities = [
      { name: "paris", photoCount: 5 },
      { name: "tokyo", photoCount: 0 }, // Locked
    ];

    // Mock /api/photos response (used for preview image)
    const mockPhotos = [{ url: "/photo.jpg", isBackground: true }];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockCities }) // /api/cities
      .mockResolvedValueOnce({ ok: true, json: async () => mockPhotos }) // /api/photos?city=paris
      .mockResolvedValueOnce({ ok: true, json: async () => mockPhotos }); // /api/photos?city=tokyo

    await scene.fetchArenas();

    expect(scene.arenas).toHaveLength(2);
    expect(scene.arenas[0].name).toBe("paris");
    expect(scene.arenas[0].photoCount).toBe(5);
    expect(scene.arenas[1].name).toBe("tokyo");
    expect(scene.arenas[1].photoCount).toBe(0);
  });

  it("should hide fight button when selecting a locked arena", () => {
    scene.arenas = [
      { name: "paris", photoCount: 5, url: "paris.jpg" },
      { name: "tokyo", photoCount: 0, url: "tokyo.jpg" },
    ];
    scene.thumbnails = [
      {
        img: { setTint: vi.fn(), clearTint: vi.fn() },
        border: { setStrokeStyle: vi.fn() },
      },
      {
        img: { setTint: vi.fn(), clearTint: vi.fn() },
        border: { setStrokeStyle: vi.fn() },
      },
    ];
    // Mock fightBtn
    scene.fightBtn = {
      setVisible: vi.fn(),
      setAlpha: vi.fn(),
      disableInteractive: vi.fn(),
      setInteractive: vi.fn(),
    };
    scene.heroBackground = { setTexture: vi.fn(), setDisplaySize: vi.fn() };
    scene.titleText = { setText: vi.fn() };

    // Select Unlocked (Paris)
    scene.selectArena(0);
    expect(scene.fightBtn.setVisible).toHaveBeenCalledWith(true);
    // Depending on implementation, might check setInteractive or alpha

    // Select Locked (Tokyo)
    scene.selectArena(1);
    expect(scene.fightBtn.setVisible).toHaveBeenCalledWith(false);
  });

  it("should NOT confirm selection if arena is locked", async () => {
    scene.arenas = [{ name: "tokyo", photoCount: 0 }];
    scene.selectedArenaIndex = 0;
    scene.transition = { transitionTo: vi.fn() };

    await scene.confirmSelection();

    expect(scene.transition.transitionTo).not.toHaveBeenCalled();
  });
});
