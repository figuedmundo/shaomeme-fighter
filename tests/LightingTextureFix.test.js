import { describe, it, expect, beforeEach, vi } from "vitest";
import DynamicLightingSystem from "../src/systems/DynamicLightingSystem";
import { createMockScene } from "./setup";

describe("DynamicLightingSystem Texture Fix", () => {
  let scene;
  let lightingSystem;

  beforeEach(() => {
    scene = createMockScene();
    vi.clearAllMocks();
  });

  it("should check for soft_light texture in init", () => {
    // Force textures.exists to return false for the first call (white_pixel) then soft_light
    scene.textures.exists = vi.fn().mockReturnValue(false);

    lightingSystem = new DynamicLightingSystem(scene);

    expect(scene.textures.exists).toHaveBeenCalledWith("soft_light");
  });

  it("should generate soft_light if missing", () => {
    scene.textures.exists = vi.fn().mockImplementation((key) => {
      if (key === "soft_light") return false;
      return true;
    });

    lightingSystem = new DynamicLightingSystem(scene);

    expect(scene.textures.addCanvas).toHaveBeenCalledWith(
      "soft_light",
      expect.anything(),
    );
  });

  it("should NOT add image if soft_light is missing after init", () => {
    // Simulate texture failure even after init
    scene.textures.exists = vi.fn().mockReturnValue(false);

    lightingSystem = new DynamicLightingSystem(scene);

    const mockTarget = { x: 100, y: 100 };
    const spotlight = lightingSystem.addSpotlight(mockTarget);

    expect(spotlight).toBeNull();
    expect(scene.add.image).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "soft_light",
    );
  });

  it("should add image if soft_light exists", () => {
    scene.textures.exists = vi.fn().mockReturnValue(true);

    lightingSystem = new DynamicLightingSystem(scene);

    const mockTarget = { x: 100, y: 100 };
    lightingSystem.addSpotlight(mockTarget);

    expect(scene.add.image).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "soft_light",
    );
  });
});
