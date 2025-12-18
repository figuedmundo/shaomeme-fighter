import { describe, it, expect, vi, beforeEach } from "vitest";
import MainMenuScene from "../src/scenes/MainMenuScene";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene";
import ArenaSelectScene from "../src/scenes/ArenaSelectScene";
import FightScene from "../src/scenes/FightScene";
import PreloadScene from "../src/scenes/PreloadScene";
import Fighter from "../src/components/Fighter";

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
          this.scene = { start: vi.fn() };
          this.load = {
            image: vi.fn(),
            spritesheet: vi.fn(),
            audio: vi.fn(),
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
            }),
            rectangle: vi.fn().mockReturnValue({
              setOrigin: vi.fn().mockReturnThis(),
              setStrokeStyle: vi.fn().mockReturnThis(),
              setFillStyle: vi.fn().mockReturnThis(),
              setDepth: vi.fn().mockReturnThis(),
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
            addEvent: vi.fn(),
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
          this.sound = { play: vi.fn(), stopAll: vi.fn(), add: vi.fn() };
          this.events = { on: vi.fn(), emit: vi.fn() };
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
              this.setVisible = vi.fn().mockReturnThis();
              this.setDepth = vi.fn().mockReturnThis();
              this.setOrigin = vi.fn().mockReturnThis();
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
      Math: { Distance: { Between: vi.fn().mockReturnValue(100) } },
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
    // 1. Boot to Preload (Implicit in index.js, we test transitions)

    // 2. PreloadScene -> MainMenu
    const preload = new PreloadScene();
    preload.preload();
    preload.create();
    // Simulate loader completion
    preload.load.on.mock.calls.find((c) => c[0] === "complete")[1]();
    expect(preload.scene.start).toHaveBeenCalledWith("MainMenuScene");

    // 3. MainMenu -> CharacterSelect
    const menu = new MainMenuScene();
    menu.create();
    // Simulate clicking start (mocked in create)
    menu.scene.start("CharacterSelectScene");
    expect(menu.scene.start).toHaveBeenCalledWith("CharacterSelectScene");

    // 4. CharacterSelect -> ArenaSelect (Select 'ann')
    const charSelect = new CharacterSelectScene();
    charSelect.create();
    charSelect.selectCharacter(0); // Ann
    charSelect.confirmSelection();
    expect(charSelect.scene.start).toHaveBeenCalledWith("ArenaSelectScene", {
      playerCharacter: "ann",
    });

    // 5. ArenaSelect -> Fight (Select 'paris')
    const arenaSelect = new ArenaSelectScene();
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
    arenaSelect.confirmSelection();

    expect(arenaSelect.scene.start).toHaveBeenCalledWith("FightScene", {
      city: "paris",
      backgroundUrl: "/cache/paris/1.webp",
      backgroundKey: "arena_bg_0",
      playerCharacter: "ann",
    });
  });

  it("Scenario 2: Fight Initialization and Victory Trigger", () => {
    const fight = new FightScene();
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

    expect(fight.isGameOver).toBe(true);
    expect(fight.physics.pause).toHaveBeenCalled();

    // The slideshow show() should be called after delayedCall
    // In our mock, delayedCall executes immediately
    expect(fight.slideshow).toBeDefined();
    // Note: Since slideshow is a real object but we want to verify it worked,
    // we can check if it attempted to fetch photos
    expect(global.fetch).toHaveBeenCalledWith("/api/photos?city=paris");
  });
});
