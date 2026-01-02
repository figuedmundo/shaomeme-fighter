import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "events";
import FightScene from "../src/scenes/FightScene";

describe("FightScene Resource Cleanup", () => {
  let scene;
  let game;

  beforeEach(() => {
    scene = new FightScene();
    game = {
      config: { width: 800, height: 600 },
      registry: { get: vi.fn(), set: vi.fn() },
    };

    scene.sys = {
      settings: { key: "FightScene" },
      game,
      events: new EventEmitter(),
    };
    scene.registry = game.registry;
    scene.scale = { width: 800, height: 600 };

    // Mock Textures
    scene.textures = {
      remove: vi.fn(),
      exists: vi.fn().mockReturnValue(true),
    };

    // Mock Anims
    scene.anims = {
      remove: vi.fn(),
      exists: vi.fn().mockReturnValue(true),
    };

    // Mock Input/Audio
    scene.input = { keyboard: { createCursorKeys: vi.fn(), addKey: vi.fn() } };
    scene.registry.get.mockReturnValue({
      updateScene: vi.fn(),
      playStageMusic: vi.fn(),
      stopMusic: vi.fn(),
      setMusicRate: vi.fn(),
    });

    // Mock Physics
    scene.physics = {
      add: { staticGroup: vi.fn(), existing: vi.fn(), collider: vi.fn() },
      world: { setBounds: vi.fn() },
    };

    // Mock Add
    scene.add = {
      rectangle: vi.fn().mockReturnValue({ setInteractive: vi.fn() }),
      text: vi.fn().mockReturnValue({ setOrigin: vi.fn() }),
      image: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should remove fighter textures on shutdown", () => {
    // Setup scene state
    scene.playerCharacter = "ann";
    // We assume opponent is selected randomly or via init data, but cleanup logic
    // should probably track what was used.
    // For now, let's manually attach fighters to the scene object as if create() ran.

    // Mock fighter objects
    scene.player1 = { texture: { key: "ann" } };
    scene.player2 = { texture: { key: "dad" } };

    // Mock init data
    scene.init({ playerCharacter: "ann" }); // Sets this.playerCharacter

    // Run shutdown
    scene.shutdown();

    // Verify cleanup
    expect(scene.textures.remove).toHaveBeenCalledWith("ann");
    expect(scene.textures.remove).toHaveBeenCalledWith("dad");
  });

  it("should remove animation data on shutdown", () => {
    scene.player1 = { texture: { key: "ann" } };
    scene.player2 = { texture: { key: "dad" } };

    scene.shutdown();

    expect(scene.anims.remove).toHaveBeenCalledWith(
      expect.stringContaining("ann"),
    );
    expect(scene.anims.remove).toHaveBeenCalledWith(
      expect.stringContaining("dad"),
    );
  });

  it("should remove victory portrait textures on shutdown", () => {
    scene.player1 = { texture: { key: "ann" } };
    scene.player2 = { texture: { key: "dad" } };

    // Run shutdown
    scene.shutdown();

    // Verify victory portraits cleanup
    expect(scene.textures.remove).toHaveBeenCalledWith("victory_ann");
    expect(scene.textures.remove).toHaveBeenCalledWith("victory_dad");
  });
});
