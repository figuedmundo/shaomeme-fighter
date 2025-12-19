import ConfigManager from "./ConfigManager";

// Expose presets directly for legacy compatibility if needed,
// though ideally code uses the helper functions.
// We reconstruct the objects from the ConfigManager data.
export const ARENA_CONFIGS = ConfigManager.presets.parallax;
export const LIGHTING_PRESETS = ConfigManager.presets.lighting;
export const WEATHER_PRESETS = ConfigManager.presets.weather;
export const ANIMATION_PRESETS = ConfigManager.presets.animation;

export const getParallaxConfigForCity = (city) => {
  return ConfigManager.getParallaxConfigForCity(city);
};

export const getAnimationPresetForCity = (city) => {
  return ConfigManager.getAnimationPresetForCity(city);
};

export const getLightingPresetForCity = (city) => {
  return ConfigManager.getLightingPresetForCity(city);
};

export const getWeatherPresetForCity = (city) => {
  return ConfigManager.getWeatherPresetForCity(city);
};
