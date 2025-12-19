import { describe, it, expect, beforeEach, vi } from "vitest";
import WeatherSystem from "../src/systems/WeatherSystem";
import DynamicLightingSystem from "../src/systems/DynamicLightingSystem";
import { createMockScene } from "./setup";

describe("Environmental Systems", () => {
  let scene;

  beforeEach(() => {
    scene = createMockScene();
  });
  describe("WeatherSystem", () => {
    let weatherSystem;

    beforeEach(() => {
      vi.clearAllMocks();
      weatherSystem = new WeatherSystem(scene);
    });

    it("should initialize", () => {
      expect(weatherSystem).toBeDefined();
    });

    it("should create rain particles when set to rain", () => {
      weatherSystem.setWeather("rain");
      expect(scene.add.particles).toHaveBeenCalled();
      expect(weatherSystem.activeWeather).toBe("rain");
    });

    it("should create fog overlay when set to fog", () => {
      weatherSystem.setWeather("fog");
      expect(scene.add.image).toHaveBeenCalled();
      expect(weatherSystem.activeWeather).toBe("fog");
    });

    it("should clean up previous weather when changing", () => {
      weatherSystem.setWeather("rain");
      const mockParticles = scene.add.particles.mock.results[0].value;
      weatherSystem.setWeather("none");
      expect(mockParticles.destroy).toHaveBeenCalled();
      expect(weatherSystem.activeWeather).toBe("none");
    });
  });

  describe("DynamicLightingSystem", () => {
    let lightingSystem;

    beforeEach(() => {
      vi.clearAllMocks();
      lightingSystem = new DynamicLightingSystem(scene);
    });

    it("should initialize with ambient overlay", () => {
      expect(scene.add.image).toHaveBeenCalled();
    });

    it("should update ambient light levels", () => {
      lightingSystem.setAmbientLight(0.5);
      const mockOverlay = scene.add.image.mock.results[0].value;
      expect(mockOverlay.setAlpha).toHaveBeenCalledWith(0.5);
    });

    it("should trigger flash effect", () => {
      lightingSystem.flash(0xffffff, 100, 0.8);
      const mockOverlay = scene.add.image.mock.results[0].value;
      expect(mockOverlay.setTint).toHaveBeenCalledWith(0xffffff);
      expect(mockOverlay.setAlpha).toHaveBeenCalledWith(0.8);
      expect(scene.tweens.add).toHaveBeenCalled();
    });
  });
});
