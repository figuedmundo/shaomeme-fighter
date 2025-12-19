import { describe, it, expect } from "vitest";
import ConfigManager from "../src/config/ConfigManager";

describe("ConfigManager Internal Logic", () => {
  it("should resolve parallax config from internal presets", () => {
    // Paris uses 'city' parallax preset
    const config = ConfigManager.getParallaxConfigForCity("paris");
    expect(config).toBeDefined();
    expect(config.layers).toBeDefined();
    expect(Array.isArray(config.layers)).toBe(true);
    // Verify a specific layer exists to confirm it loaded the static preset
    expect(config.layers[0].key).toBe("city_sky");
  });

  it("should resolve lighting config from internal presets", () => {
    // Dublin uses 'outdoor_night' lighting preset
    const config = ConfigManager.getLightingPresetForCity("dublin");
    expect(config).toBeDefined();
    expect(config.ambientLevel).toBe(0.4); // Known value from outdoor_night
    expect(config.spotlights).toBe(true);
  });

  it("should resolve weather config from internal presets", () => {
    // London uses 'london_fog' weather preset
    const config = ConfigManager.getWeatherPresetForCity("london");
    expect(config).toBeDefined();
    expect(config.type).toBe("fog");
  });

  it("should return default lighting for unknown city", () => {
    const config = ConfigManager.getLightingPresetForCity("unknown_city");
    expect(config).toBeDefined();
    expect(config.ambientLevel).toBe(1.0); // Default to outdoor_day
  });
});
