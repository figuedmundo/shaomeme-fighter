import { describe, it, expect, vi, beforeEach } from "vitest";
import FightScene from "../src/scenes/FightScene";
import CharacterSelectScene from "../src/scenes/CharacterSelectScene";

// Mock Phaser
vi.mock("phaser", () => ({
  default: {
    Scene: class {
      constructor(key) {
        this.key = key;
      }
    },
    Input: {
      Keyboard: {
        KeyCodes: { SPACE: 32, W: 87, S: 83, A: 65, D: 68 },
      },
    },
    Math: {
      Distance: { Between: () => 50 }, // Always in range for hit testing
      Clamp: (v) => v,
    },
    Physics: {
      Arcade: {
        Sprite: class {
          constructor() {
            this.body = { setSize: vi.fn(), setOffset: vi.fn(), blocked: {} };
            this.setCollideWorldBounds = vi.fn();
            this.setOrigin = vi.fn();
            this.play = vi.fn();
            this.setFlipX = vi.fn();
            this.setVelocityX = vi.fn();
            this.setVelocityY = vi.fn();
            this.on = vi.fn();
            this.texture = { key: "ryu" };
            this.anims = {
              isPlaying: true,
              currentFrame: { index: 2 },
              currentAnim: { key: "attack" },
            };
          }
        },
      },
    },
  },
}));

describe("Announcer Integration", () => {
  let fightScene;
  let mockAudioManager;
  let mockAnnouncerOverlay;
  let mockComboOverlay;

  beforeEach(() => {
    fightScene = new FightScene();

    // Mock Scene Context
    fightScene.scale = { width: 800, height: 600 };
    fightScene.input = {
      keyboard: {
        createCursorKeys: () => ({ left: {}, right: {}, up: {}, down: {} }),
        addKey: () => ({}),
        addKeys: () => ({ up: {}, down: {}, left: {}, right: {} }),
        checkDown: () => false,
      },
      addPointer: vi.fn(),
      on: vi.fn(),
    };
    fightScene.physics = {
      add: {
        staticGroup: () => ({ add: vi.fn() }),
        existing: vi.fn(),
        collider: vi.fn(),
      },
      world: { setBounds: vi.fn(), pause: vi.fn() },
    };
    fightScene.events = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };
    fightScene.add = {
      image: () => ({ setDisplaySize: vi.fn().mockReturnThis() }),
      sprite: () => ({
        setOrigin: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
      }),
      rectangle: () => ({
        setStrokeStyle: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
      }),
      circle: () => ({
        setVisible: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
      }),
      text: () => ({
        setOrigin: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        setText: vi.fn().mockReturnThis(),
      }),
      container: () => ({
        add: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setPosition: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
      }), // For overlays
      existing: vi.fn(), // Needed by Fighter
      graphics: () => ({
        fillStyle: vi.fn(),
        fillCircle: vi.fn(),
        generateTexture: vi.fn(),
        destroy: vi.fn(),
        clear: vi.fn(),
        fillRect: vi.fn(),
      }),
      particles: () => ({
        setDepth: vi.fn().mockReturnThis(),
        createEmitter: vi.fn().mockReturnThis(),
        stop: vi.fn(),
        start: vi.fn(),
        explode: vi.fn(),
      }),
      group: () => ({
        add: vi.fn(),
        get: vi.fn(),
        countActive: vi.fn(),
        getChildren: vi.fn().mockReturnValue([]),
      }),
    };
    fightScene.make = {
      graphics: () => ({
        fillStyle: vi.fn(),
        fillCircle: vi.fn(),
        generateTexture: vi.fn(),
        destroy: vi.fn(),
      }),
    };
    fightScene.textures = { exists: () => true };
    fightScene.anims = {
      exists: () => true,
      create: vi.fn(),
      generateFrameNumbers: () => [],
    };
    fightScene.tweens = { add: vi.fn() };
    fightScene.time = { delayedCall: vi.fn((delay, cb) => cb()) }; // Execute immediately for tests
    fightScene.cameras = {
      main: {
        zoom: 1,
        pan: vi.fn(),
        zoomTo: vi.fn(),
        shake: vi.fn(),
        flash: vi.fn(),
        setZoom: vi.fn(),
      },
    };

    // Registry
    mockAudioManager = {
      playAnnouncer: vi.fn(),
      playImpact: vi.fn(),
      playHitReaction: vi.fn(),
      playKO: vi.fn(),
      playStageMusic: vi.fn(),
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    };
    fightScene.registry = {
      get: vi.fn().mockReturnValue(mockAudioManager),
    };

    // Initialize Scene
    fightScene.init({});
    fightScene.create();
  });

  it("should initialize overlays in create()", () => {
    expect(fightScene.announcerOverlay).toBeDefined();
    expect(fightScene.comboOverlay).toBeDefined();
  });

  it("should run round start sequence", () => {
    // We verify that showRound and playAnnouncer are called
    // Since we mock time.delayedCall to execute immediately,
    // the whole sequence might fire at once in the test context

    // This requires spy on the overlay methods.
    // Since they are instantiated inside create(), we can't easily spy on them unless we mock the module.
    // Or we inspect the side effects (audio calls).

    expect(mockAudioManager.playAnnouncer).toHaveBeenCalledWith("round_1");
    expect(mockAudioManager.playAnnouncer).toHaveBeenCalledWith("fight");
  });

  it("should update combo on hits", () => {
    fightScene.comboCounter = 0;
    fightScene.processComboHit(); // We'll add this helper method to logic
    expect(fightScene.comboCounter).toBe(1);

    fightScene.processComboHit();
    expect(fightScene.comboCounter).toBe(2);
    // Should trigger updateCombo visual
    // Should NOT trigger audio yet (2 hits)
    expect(mockAudioManager.playAnnouncer).not.toHaveBeenCalledWith("combo_3");

    fightScene.processComboHit(); // 3 Hits
    expect(mockAudioManager.playAnnouncer).toHaveBeenCalledWith("combo_3");
  });
});
