import gameData from "./gameData.json";

// --- Static Presets (Moved from JSON) ---

const PARALLAX_PRESETS = {
  city: {
    layers: [
      { key: "city_sky", scrollFactor: 0, alpha: 1 },
      { key: "city_buildings_far", scrollFactor: 0.1, alpha: 0.8 },
      { key: "city_buildings_mid", scrollFactor: 0.3 },
      { key: "city_buildings_near", scrollFactor: 0.6 },
      { key: "city_ground", scrollFactor: 1 },
    ],
  },
  mountain: {
    layers: [
      { key: "mountain_sky", scrollFactor: 0 },
      { key: "mountain_peaks", scrollFactor: 0.15, alpha: 0.9 },
      { key: "mountain_hills", scrollFactor: 0.4 },
      { key: "mountain_trees", scrollFactor: 0.7 },
      { key: "mountain_ground", scrollFactor: 1 },
    ],
  },
  dojo: {
    layers: [
      { key: "dojo_wall", scrollFactor: 0 },
      { key: "dojo_decorations", scrollFactor: 0.2 },
      { key: "dojo_floor", scrollFactor: 1 },
    ],
  },
  photoArena: {
    type: "photo",
    layers: [
      { key: "photo_bg", scrollFactor: 0, alpha: 0.6, tint: 8947848 },
      {
        key: "arena_overlay",
        scrollFactor: 0,
        alpha: 0.3,
        blendMode: "MULTIPLY",
      },
    ],
  },
};

const LIGHTING_PRESETS = {
  outdoor_day: {
    ambientLevel: 1.0,
    spotlights: false,
  },
  outdoor_night: {
    ambientLevel: 0.4,
    spotlights: true,
    spotlightConfig: { radius: 200, intensity: 1.5, color: 16776669 },
  },
  indoor_dojo: {
    ambientLevel: 0.8,
    spotlights: false,
  },
  arena_spotlight: {
    ambientLevel: 0.3,
    spotlights: true,
    spotlightConfig: { radius: 180, intensity: 1.8, color: 16777215 },
  },
  underground: {
    ambientLevel: 0.5,
    spotlights: true,
    spotlightConfig: { radius: 120, intensity: 1.3, color: 16746564 },
  },
  dramatic_finale: {
    ambientLevel: 0.2,
    spotlights: true,
    spotlightConfig: { radius: 250, intensity: 2.0, color: 16777215 },
  },
};

const WEATHER_PRESETS = {
  tokyo_rain: {
    type: "rain",
    config: { intensity: "medium", windStrength: 20 },
  },
  mountain_snow: {
    type: "snow",
    config: { intensity: "light", windStrength: 30 },
  },
  london_fog: {
    type: "fog",
    config: { density: 0.3, color: 0x99aabb, animated: true },
  },
  desert_wind: {
    type: "wind",
    config: { strength: 60, gustInterval: 2000 },
  },
  storm: {
    type: "storm",
    config: { intensity: "heavy", windStrength: 70 },
  },
  clear: {
    type: "none",
  },
};

const ANIMATION_PRESETS = {
  city: [
    { type: "clouds", config: { count: 4, speed: 12 } },
    { type: "floatingParticles", config: { type: "dust", count: 15 } },
  ],
  mountain: [
    { type: "clouds", config: { count: 6, speed: 8, minY: 30, maxY: 150 } },
    {
      type: "swayingObject",
      key: "tree",
      config: { x: 100, y: 400, amplitude: 3 },
    },
    { type: "floatingParticles", config: { type: "leaves", count: 25 } },
  ],
  dojo: [
    {
      type: "swayingObject",
      key: "banner",
      config: { x: 150, y: 100, amplitude: 5 },
    },
    { type: "floatingParticles", config: { type: "dust", count: 10 } },
  ],
  beach: [
    { type: "clouds", config: { count: 3, speed: 10 } },
    {
      type: "animatedFlags",
      positions: [
        { x: 100, y: 200, depth: -2 },
        { x: 300, y: 200, depth: -2 },
      ],
    },
  ],
};

class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance; // eslint-disable-line no-constructor-return
    }
    this.data = gameData;

    // Expose static presets for legacy/test access if needed, but methods are preferred
    this.presets = {
      parallax: PARALLAX_PRESETS,
      lighting: LIGHTING_PRESETS,
      weather: WEATHER_PRESETS,
      animation: ANIMATION_PRESETS,
    };

    ConfigManager.instance = this;
  }

  getArenaConfig(id) {
    if (!id) return null;
    return this.data.arenas[id.toLowerCase()] || null;
  }

  // --- Helpers mimicking old functionality, now resolving keys ---

  getParallaxConfigForCity(city) {
    const arena = this.getArenaConfig(city);
    if (!arena) return null;

    // Look up key in arena config, then fetch object from static presets
    const presetKey = arena.presets.parallax;
    if (!presetKey) return null;

    return PARALLAX_PRESETS[presetKey] || null;
  }

  getLightingPresetForCity(city) {
    const arena = this.getArenaConfig(city);

    // Default fallback
    const defaultPreset = LIGHTING_PRESETS.outdoor_day;
    if (!arena) return defaultPreset;

    const presetKey = arena.presets.lighting;
    return LIGHTING_PRESETS[presetKey] || defaultPreset;
  }

  getWeatherPresetForCity(city) {
    const arena = this.getArenaConfig(city);
    if (!arena) return null;

    const presetKey = arena.presets.weather;
    return presetKey ? WEATHER_PRESETS[presetKey] : null;
  }

  getAnimationPresetForCity(city) {
    const arena = this.getArenaConfig(city);
    if (!arena) return null;

    const presetKey = arena.presets.animation;
    return presetKey ? ANIMATION_PRESETS[presetKey] : null;
  }

  getVictoryMusicForCity(city) {
    const arena = this.getArenaConfig(city);
    return arena?.victoryMusic || "victory_reward_music";
  }

  // --- Combat ---
  getCombatConfig() {
    return this.data.combat;
  }

  getDamageValues() {
    return this.data.combat.damage;
  }

  getComboThresholds() {
    return this.data.combat.combo.thresholds;
  }

  // --- Difficulty ---
  getDifficultyConfig(level) {
    return (
      this.data.difficulty[level.toLowerCase()] || this.data.difficulty.medium
    );
  }

  // --- Roster ---
  getRoster() {
    return this.data.roster;
  }

  getCharacter(id) {
    return this.data.roster.find((c) => c.id === id);
  }

  getCharacterPersonality(id) {
    const char = this.getCharacter(id);
    return char ? char.personality : "balanced";
  }

  getCharacterDisplayName(id) {
    const char = this.getCharacter(id);
    return char ? char.displayName : id.toUpperCase();
  }
}

const instance = new ConfigManager();
export default instance;
