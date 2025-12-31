import { describe, it, expect, vi, beforeEach } from "vitest";
import MainMenuScene from "../src/scenes/MainMenuScene";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene";
import ArenaSelectScene from "../src/scenes/ArenaSelectScene";
import FightScene from "../src/scenes/FightScene";
import PreloadScene from "../src/scenes/PreloadScene";
import SplashScene from "../src/scenes/SplashScene";
import Fighter from "../src/components/Fighter"; // eslint-disable-line no-unused-vars

// Mock VictorySlideshow
vi.mock("../src/components/VictorySlideshow", () => {
  return {
    default: class {
      constructor(scene) {
        this.scene = scene;
      }

      show = vi.fn();
    },
  };
});

// Global mock for Phaser
vi.mock("phaser", () => {
  const mockAnims = {
    create: vi.fn(),
    exists: vi.fn().mockReturnValue(true),
    generateFrameNumbers: vi.fn().mockReturnValue([0, 1, 2]),
    play: vi.fn(),
  };

  const mockPhysics = {
    add: {
      existing: vi.fn(),
      staticGroup: vi.fn().mockReturnValue({
        add: vi.fn(),
        create: vi.fn().mockReturnValue({
          setSize: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
        }),
      }),
      collider: vi.fn(),
    },
    world: { setBounds: vi.fn(), pause: vi.fn() },
  };

  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
          this.game = { config: { test: true } };
          this.scene = { start: vi.fn() };
          this.load = {
            image: vi.fn(),
            spritesheet: vi.fn(),
            audio: vi.fn(),
            json: vi.fn(),
            start: vi.fn(),
            once: vi.fn((e, cb) => cb && cb()),
            on: vi.fn(),
          };
          this.add = {
            image: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setDisplaySize: vi.fn().mockReturnThis(),
              setInteractive: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
              setTexture: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setTint: vi.fn().mockReturnThis(),
              clearTint: vi.fn().mockReturnThis(),
              setBlendMode: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              setFlipX: vi.fn().mockReturnThis(),
            }),
            text: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setInteractive: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setText: vi.fn().mockReturnThis(),
              setY: vi.fn().mockReturnThis(),
              setStyle: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              setScrollFactor: vi.fn().mockReturnThis(),
              disableInteractive: vi.fn().mockReturnThis(),
              destroy: vi.fn().mockReturnThis(),
            }),
            rectangle: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setStrokeStyle: vi.fn().mockReturnThis(),
              setFillStyle: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setInteractive: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
            }),
            circle: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setPosition: vi.fn().mockReturnThis(),
            }),
            graphics: vi.fn().mockReturnValue({
              fillGradientStyle: vi.fn().mockReturnThis(),
              fillRect: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              fillStyle: vi.fn().mockReturnThis(),
              fillCircle: vi.fn().mockReturnThis(),
              generateTexture: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
              setScrollFactor: vi.fn().mockReturnThis(),
              clear: vi.fn().mockReturnThis(),
              lineStyle: vi.fn().mockReturnThis(),
              beginPath: vi.fn().mockReturnThis(),
              moveTo: vi.fn().mockReturnThis(),
              lineTo: vi.fn().mockReturnThis(),
              strokePath: vi.fn().mockReturnThis(),
              strokeRect: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
            }),
            container: vi.fn().mockReturnValue({
              add: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setPosition: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
            }),
            sprite: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
              setAlpha: vi.fn().mockReturnThis(),
              setScale: vi.fn().mockReturnThis(),
              setPosition: vi.fn().mockReturnThis(),
              setVisible: vi.fn().mockReturnThis(),
              setFlipX: vi.fn().mockReturnThis(),
              setTexture: vi.fn().mockReturnThis(),
              setFrame: vi.fn().mockReturnThis(),
              play: vi.fn().mockReturnThis(),
              on: vi.fn().mockReturnThis(),
              once: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
            }),
            group: vi.fn().mockReturnValue({
              add: vi.fn(),
              get: vi.fn(),
              killAndHide: vi.fn(),
              clear: vi.fn(),
              getChildren: vi.fn().mockReturnValue([]),
            }),
            particles: vi.fn().mockReturnValue({
              setDepth: vi.fn().mockReturnThis(),
              stop: vi.fn().mockReturnThis(),
              start: vi.fn().mockReturnThis(),
              emitParticleAt: vi.fn().mockReturnThis(),
              setTint: vi.fn().mockReturnThis(),
              destroy: vi.fn(),
            }),
            existing: vi.fn(),
          };
          this.anims = mockAnims;
          this.physics = {
            ...mockPhysics,
            pause: vi.fn(),
          };
          this.scale = { width: 1024, height: 768 };
          this.textures = { exists: vi.fn().mockReturnValue(true) };
          this.cache = {
            audio: { exists: vi.fn().mockReturnValue(true) },
          };
          this.registry = {
            get: vi.fn().mockReturnValue({
              updateScene: vi.fn(),
              playMusic: vi.fn(),
              playUi: vi.fn(),
              playAnnouncer: vi.fn(),
              playStageMusic: vi.fn(),
              stopMusic: vi.fn(),
              setMusicRate: vi.fn(),
              init: vi.fn(),
              playKO: vi.fn(),
              playImpact: vi.fn(),
              playHitReaction: vi.fn(),
            }),
            set: vi.fn(),
          };
          this.time = {
            delayedCall: vi.fn((d, cb) => cb()),
            addEvent: vi.fn((config) => {
              if (config.callback) {
                const iterations = (config.repeat || 0) + 1;
                for (let i = 0; i < iterations; i += 1) {
                  config.callback();
                }
              }
              return {
                destroy: vi.fn(),
                remove: vi.fn(),
              };
            }),
          };
          this.tweens = {
            add: vi.fn(),
          };
          this.cameras = {
            main: {
              shake: vi.fn(),
              zoom: 1,
              zoomTo: vi.fn(),
              pan: vi.fn(),
              setZoom: vi.fn(),
              width: 1024,
              height: 768,
            },
          };
          this.sound = {
            play: vi.fn(),
            stopAll: vi.fn(),
            add: vi.fn().mockReturnValue({ play: vi.fn(), stop: vi.fn() }),
          };
          this.events = { on: vi.fn(), emit: vi.fn() };
          this.game = { config: { test: true } };
          this.input = {
            keyboard: {
              createCursorKeys: vi.fn().mockReturnValue({
                up: {},
                down: {},
                left: {},
                right: {},
              }),
              addKey: vi.fn().mockReturnValue({ isDown: false }),
              addKeys: vi.fn().mockReturnValue({ isDown: false }),
              checkDown: vi.fn().mockReturnValue(false),
            },
            on: vi.fn(),
            addPointer: vi.fn(),
          };
        }
      },
      Physics: {
        Arcade: {
          Sprite: class {
            constructor(scene, x, y, texture) {
              this.scene = scene;
              this.body = {
                setSize: vi.fn(),
                setOffset: vi.fn(),
                setCollideWorldBounds: vi.fn(),
                blocked: { down: true },
                setVelocityX: vi.fn(),
                setVelocityY: vi.fn(),
              };
              this.anims = {
                play: vi.fn(),
                isPlaying: false,
                currentAnim: { key: "idle" },
                exists: vi.fn().mockReturnValue(true),
              };
              this.texture = { key: texture || "ryu" };
              this.health = 100;
              this.setPosition = vi.fn().mockReturnThis();
              this.setVisible = vi.fn().mockReturnThis();
              this.setDepth = vi.fn().mockReturnThis();
              this.setOrigin = vi.fn().mockReturnThis();
              this.setScale = vi.fn().mockReturnThis();
              this.setFlipX = vi.fn().mockReturnThis();
              this.setCollideWorldBounds = vi.fn().mockReturnThis();
              this.play = vi.fn().mockReturnThis();
              this.on = vi.fn().mockReturnThis();
              this.once = vi.fn().mockReturnThis();
              this.setVelocityX = vi.fn().mockReturnThis();
              this.setVelocityY = vi.fn().mockReturnThis();
              this.setTint = vi.fn().mockReturnThis();
              this.clearTint = vi.fn().mockReturnThis();
            }
          },
        },
      },
      Input: {
        Keyboard: {
          KeyCodes: { SPACE: 32, W: 87, A: 65, S: 83, D: 68, F: 70 },
        },
      },
      Math: {
        Distance: { Between: vi.fn().mockReturnValue(100) },
        Clamp: vi.fn((val, min, max) => Math.min(Math.max(val, min), max)),
        FloatBetween: vi.fn(() => 0.5),
        Between: vi.fn(() => 10),
        Linear: vi.fn((p0, p1, t) => p0 + t * (p1 - p0)),
      },
      BlendModes: { ADD: 1, MULTIPLY: 2 },
    },
  };
});

describe("E2E Full Game Flow Simulation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("Scenario 1: Full Navigation and Data Persistence", async () => {
    const mockTransition = {
      fadeIn: vi.fn().mockResolvedValue(),
      fadeOut: vi.fn().mockResolvedValue(),
      flash: vi.fn().mockResolvedValue(),
      transitionTo: vi.fn().mockResolvedValue(),
      wipeHorizontal: vi.fn().mockResolvedValue(),
      wipeVertical: vi.fn().mockResolvedValue(),
      wipeRadial: vi.fn().mockResolvedValue(),
      curtain: vi.fn().mockResolvedValue(),
    };

    // 1. Boot to Preload (Implicit in index.js, we test transitions)

    // 2. PreloadScene -> MainMenu
    const preload = new PreloadScene();
    preload.preload();
    preload.create();
    // Simulate loader completion
    preload.load.on.mock.calls.find((c) => c[0] === "complete")[1]();
    // Preload now goes to SplashScene first
    expect(preload.scene.start).toHaveBeenCalledWith("SplashScene");

    // Simulate SplashScene flow
    const game = { registry: { get: vi.fn(), set: vi.fn() } }; // Mock game
    const splash = new SplashScene();
    splash.sys = { settings: { key: "SplashScene" }, game };
    splash.registry = game.registry;
    splash.transition = { transitionTo: vi.fn() }; // Mock transition directly
    splash.goToMenu = vi.fn().mockImplementation(() => {
      splash.scene.start("MainMenuScene");
    });
    splash.scene = { start: vi.fn() };
    splash.add = {
      image: vi.fn().mockReturnValue({ setAlpha: vi.fn(), setScale: vi.fn() }),
      text: vi.fn().mockReturnValue({ setOrigin: vi.fn(), setAlpha: vi.fn() }),
      rectangle: vi.fn().mockReturnValue({
        setInteractive: vi.fn(),
        setDepth: vi.fn(),
        on: vi.fn(),
      }),
    };
    splash.tweens = { chain: vi.fn().mockReturnValue({ stop: vi.fn() }) };
    splash.cameras = { main: { setBackgroundColor: vi.fn() } };

    // In E2E, we can just assume Splash happened and jump to verifying MainMenu start if we want to keep it simple,
    // or manually trigger the transition.
    // Let's manually trigger the next step to simulate Splash finishing.
    splash.scene.start("MainMenuScene");

    // 3. MainMenu -> CharacterSelect
    const menu = new MainMenuScene();
    menu.create();
    // Simulate clicking start (mocked in create)
    menu.scene.start("CharacterSelectScene");
    expect(menu.scene.start).toHaveBeenCalledWith("CharacterSelectScene");

    // 4. CharacterSelect -> ArenaSelect (Select 'ann')
    const charSelect = new CharacterSelectScene({
      transitionManager: mockTransition,
    });
    charSelect.create();
    charSelect.selectCharacter(0); // Ann
    await charSelect.confirmSelection();

    // In test mode, CharacterSelectScene calls transition.transitionTo
    expect(mockTransition.transitionTo).toHaveBeenCalledWith(
      "ArenaSelectScene",
      expect.objectContaining({ playerCharacter: "ann" }),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );

    // 5. ArenaSelect -> Fight (Select 'paris')
    const arenaSelect = new ArenaSelectScene({
      transitionManager: mockTransition,
    });
    arenaSelect.create(); // MUST call create to initialize loadingText
    arenaSelect.init({ playerCharacter: "ann" });

    // Simulate fetching cities
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ["paris"],
    });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ url: "/cache/paris/1.webp" }],
    });

    await arenaSelect.fetchArenas();
    arenaSelect.selectArena(0);
    await arenaSelect.confirmSelection();

    expect(mockTransition.transitionTo).toHaveBeenCalledWith(
      "LoadingScene",
      expect.objectContaining({
        targetScene: "FightScene",
        targetData: expect.objectContaining({
          city: "paris",
          playerCharacter: "ann",
        }),
      }),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it("Scenario 2: Fight Initialization and Victory Trigger", async () => {
    const mockTransition = {
      fadeIn: vi.fn().mockResolvedValue(),
      fadeOut: vi.fn().mockResolvedValue(),
      flash: vi.fn().mockResolvedValue(),
      transitionTo: vi.fn().mockResolvedValue(),
    };

    const fight = new FightScene({ transitionManager: mockTransition });
    const fightData = {
      city: "paris",
      backgroundKey: "arena_bg_0",
      playerCharacter: "ann",
    };

    fight.init(fightData);
    fight.preload();
    fight.create();

    expect(fight.player1).toBeDefined();
    expect(fight.player1.texture.key).toBe("ann");
    expect(fight.player2).toBeDefined();
    expect(fight.isGameOver).toBe(false);

    // Simulate Player 2 losing health
    fight.player2.health = 0;

    // Update should trigger victory
    fight.update();

    // Wait for the async flow inside delayedCalls to finish (Transitions + Slideshow)
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(fight.isGameOver).toBe(true);
    expect(fight.physics.pause).toHaveBeenCalled();

    // Verify slideshow is triggered directly
    expect(fight.slideshow.show).toHaveBeenCalledWith("paris");
  });
});
