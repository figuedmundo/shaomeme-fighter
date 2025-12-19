import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Phaser before importing systems
vi.mock('phaser', () => {
  return {
    default: {
      GameObjects: {
        GameObject: class {},
        Graphics: class {},
        Sprite: class {},
        Image: class {},
        Rectangle: class {},
        Particles: {
          ParticleEmitter: class {},
        },
      },
      Scene: class {},
      Math: {
        Clamp: (v, min, max) => Math.min(Math.max(v, min), max),
        Between: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
        FloatBetween: (min, max) => Math.random() * (max - min) + min,
      },
      BlendModes: {
        ADD: 'ADD',
        MULTIPLY: 'MULTIPLY',
      },
    },
  };
});

import WeatherSystem from '../src/systems/WeatherSystem';
import DynamicLightingSystem from '../src/systems/DynamicLightingSystem';

// Mock objects for the scene
const mockParticles = {
  destroy: vi.fn(),
  setDepth: vi.fn(),
  setParticleTint: vi.fn(),
  emitParticleAt: vi.fn(),
};

const mockTween = {
  stop: vi.fn(),
};

const mockScene = {
  scale: { width: 800, height: 600 },
  add: {
    particles: vi.fn(() => mockParticles),
    graphics: vi.fn(() => ({
      fillStyle: vi.fn().mockReturnThis(),
      fillRect: vi.fn().mockReturnThis(),
      fillCircle: vi.fn().mockReturnThis(),
      generateTexture: vi.fn(),
      destroy: vi.fn(),
      clear: vi.fn(),
      setDepth: vi.fn(),
      lineStyle: vi.fn().mockReturnThis(),
      beginPath: vi.fn().mockReturnThis(),
      moveTo: vi.fn().mockReturnThis(),
      lineTo: vi.fn().mockReturnThis(),
      strokePath: vi.fn().mockReturnThis(),
    })),
    rectangle: vi.fn(() => ({
      setDepth: vi.fn().mockReturnThis(),
      setAlpha: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      clearTint: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    })),
    renderTexture: vi.fn(() => ({
      setDepth: vi.fn().mockReturnThis(),
      setBlendMode: vi.fn().mockReturnThis(),
      draw: vi.fn(),
      setPosition: vi.fn(),
      destroy: vi.fn(),
    })),
  },
  make: {
    graphics: vi.fn(() => ({
      createRadialGradient: vi.fn().mockReturnThis(),
      fillGradientStyle: vi.fn().mockReturnThis(),
      fillCircle: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    })),
  },
  textures: {
    exists: vi.fn(() => false),
  },
  tweens: {
    add: vi.fn(() => mockTween),
    killTweensOf: vi.fn(),
  },
  time: {
    addEvent: vi.fn(() => ({ remove: vi.fn(), reset: vi.fn() })),
    delayedCall: vi.fn(),
  },
};

describe('Environmental Systems', () => {
  describe('WeatherSystem', () => {
    let weatherSystem;

    beforeEach(() => {
      vi.clearAllMocks();
      weatherSystem = new WeatherSystem(mockScene);
    });

    it('should initialize', () => {
      expect(weatherSystem).toBeDefined();
    });

    it('should create rain particles when set to rain', () => {
      weatherSystem.setWeather('rain');
      expect(mockScene.add.particles).toHaveBeenCalled();
      expect(weatherSystem.activeWeather).toBe('rain');
    });

    it('should create fog overlay when set to fog', () => {
      weatherSystem.setWeather('fog');
      expect(mockScene.add.rectangle).toHaveBeenCalled();
      expect(weatherSystem.activeWeather).toBe('fog');
    });

    it('should clean up previous weather when changing', () => {
      weatherSystem.setWeather('rain');
      weatherSystem.setWeather('none');
      expect(mockParticles.destroy).toHaveBeenCalled();
      expect(weatherSystem.activeWeather).toBe('none');
    });
  });

  describe('DynamicLightingSystem', () => {
    let lightingSystem;

    beforeEach(() => {
      vi.clearAllMocks();
      lightingSystem = new DynamicLightingSystem(mockScene);
    });

    it('should initialize with ambient overlay', () => {
      expect(mockScene.add.rectangle).toHaveBeenCalled();
    });

    it('should update ambient light levels', () => {
      lightingSystem.setAmbientLight(0.5);
      const mockOverlay = mockScene.add.rectangle.mock.results[0].value;
      expect(mockOverlay.setAlpha).toHaveBeenCalledWith(0.5);
    });

    it('should trigger flash effect', () => {
      lightingSystem.flash(0xffffff, 100, 0.8);
      const mockOverlay = mockScene.add.rectangle.mock.results[0].value;
      expect(mockOverlay.setTint).toHaveBeenCalledWith(0xffffff);
      expect(mockOverlay.setAlpha).toHaveBeenCalledWith(0.8);
      expect(mockScene.tweens.add).toHaveBeenCalled();
    });
  });
});