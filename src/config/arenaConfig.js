// Consolidated Arena Configurations

export const ARENA_CONFIGS = {
  city: {
    layers: [
      { key: 'city_sky', scrollFactor: 0, alpha: 1 },
      { key: 'city_buildings_far', scrollFactor: 0.1, alpha: 0.8 },
      { key: 'city_buildings_mid', scrollFactor: 0.3 },
      { key: 'city_buildings_near', scrollFactor: 0.6 },
      { key: 'city_ground', scrollFactor: 1 }
    ]
  },
  
  mountain: {
    layers: [
      { key: 'mountain_sky', scrollFactor: 0 },
      { key: 'mountain_peaks', scrollFactor: 0.15, alpha: 0.9 },
      { key: 'mountain_hills', scrollFactor: 0.4 },
      { key: 'mountain_trees', scrollFactor: 0.7 },
      { key: 'mountain_ground', scrollFactor: 1 }
    ]
  },

  dojo: {
    layers: [
      { key: 'dojo_wall', scrollFactor: 0 },
      { key: 'dojo_decorations', scrollFactor: 0.2 },
      { key: 'dojo_floor', scrollFactor: 1 }
    ]
  },

  // Dynamic photo backgrounds with depth - Handled by Scene logic typically, but config here for reference
  photoArena: {
    type: 'photo',
    layers: [
      { key: 'photo_bg', scrollFactor: 0, alpha: 0.6, tint: 0x888888 },
      { key: 'arena_overlay', scrollFactor: 0, alpha: 0.3, blendMode: 'MULTIPLY' }
    ]
  }
};

export const LIGHTING_PRESETS = {
  outdoor_day: {
    ambientLevel: 1.0,
    spotlights: false
  },

  outdoor_night: {
    ambientLevel: 0.4,
    spotlights: true,
    spotlightConfig: { radius: 200, intensity: 1.5, color: 0xffffdd }
  },

  indoor_dojo: {
    ambientLevel: 0.8,
    spotlights: false
  },

  arena_spotlight: {
    ambientLevel: 0.3,
    spotlights: true,
    spotlightConfig: { radius: 180, intensity: 1.8, color: 0xffffff }
  },

  underground: {
    ambientLevel: 0.5,
    spotlights: true,
    spotlightConfig: { radius: 120, intensity: 1.3, color: 0xff8844 }
  },

  dramatic_finale: {
    ambientLevel: 0.2,
    spotlights: true,
    spotlightConfig: { radius: 250, intensity: 2.0, color: 0xffffff }
  }
};

export const WEATHER_PRESETS = {
  tokyo_rain: {
    type: 'rain',
    config: { intensity: 'medium', windStrength: 20 }
  },

  mountain_snow: {
    type: 'snow',
    config: { intensity: 'light', windStrength: 30 }
  },

  london_fog: {
    type: 'fog',
    config: { density: 0.6, animated: true }
  },

  desert_wind: {
    type: 'wind',
    config: { strength: 60, gustInterval: 2000 }
  },

  storm: {
    type: 'storm',
    config: { intensity: 'heavy', windStrength: 70 }
  },

  clear: {
    type: 'none'
  }
};

// Refactored to be Data-Driven (interpretable by AnimatedBackgroundManager)
export const ANIMATION_PRESETS = {
  city: [
    { type: 'clouds', config: { count: 4, speed: 12 } },
    { type: 'floatingParticles', config: { type: 'dust', count: 15 } }
  ],

  mountain: [
    { type: 'clouds', config: { count: 6, speed: 8, minY: 30, maxY: 150 } },
    { type: 'swayingObject', key: 'tree', config: { x: 100, y: 400, amplitude: 3 } },
    { type: 'floatingParticles', config: { type: 'leaves', count: 25 } }
  ],

  dojo: [
    { type: 'swayingObject', key: 'banner', config: { x: 150, y: 100, amplitude: 5 } },
    { type: 'floatingParticles', config: { type: 'dust', count: 10 } }
  ],

  beach: [
    { type: 'clouds', config: { count: 3, speed: 10 } },
    { type: 'animatedFlags', positions: [{ x: 100, y: 200, depth: -2 }, { x: 300, y: 200, depth: -2 }] }
  ]
};

// --- Helper Functions ---

export const getParallaxConfigForCity = (city) => {
  const cityLower = (city || "").toLowerCase();
  // TODO: Map more cities when assets are available
  return ARENA_CONFIGS[cityLower] || null;
};

export const getAnimationPresetForCity = (city) => {
  const cityLower = (city || "").toLowerCase();
  
  const map = {
    'paris': 'city',
    'dublin': 'city',
    'galway': 'mountain',
    'istambul': 'city',
    'london': 'city',
    'tokyo': 'city',
    'new york': 'city',
    'alps': 'mountain',
    'mountains': 'mountain',
    'beach': 'beach',
    'dojo': 'dojo',
  };
  
  const key = map[cityLower];
  return key ? ANIMATION_PRESETS[key] : null;
};

export const getLightingPresetForCity = (city) => {
  const cityLower = (city || "").toLowerCase();
  
  const map = {
    'paris': 'outdoor_day',
    'dublin': 'outdoor_night',
    'galway': 'outdoor_day',
    'istambul': 'outdoor_night',
    'tokyo': 'outdoor_night',
    'london': 'outdoor_night',
    'new york': 'outdoor_day',
    'dojo': 'indoor_dojo',
    'arena': 'arena_spotlight',
    'underground': 'underground',
  };
  
  const key = map[cityLower];
  return key ? LIGHTING_PRESETS[key] : LIGHTING_PRESETS.outdoor_day;
};

export const getWeatherPresetForCity = (city) => {
  const cityLower = (city || "").toLowerCase();
  
  const map = {
    'dublin': 'london_fog',
    'galway': 'tokyo_rain',
    'istambul': 'desert_wind',
    'london': 'london_fog',
    'tokyo': 'tokyo_rain',
    'alps': 'mountain_snow',
    'mountains': 'mountain_snow',
    'desert': 'desert_wind',
  };
  
  const key = map[cityLower];
  return key ? WEATHER_PRESETS[key] : null;
};