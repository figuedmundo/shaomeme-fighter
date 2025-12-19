import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:DynamicLightingSystem");

/**
 * DynamicLightingSystem - Advanced lighting and visual effects
 * 
 * Provides:
 * - Spotlight effects on fighters
 * - Ambient lighting changes
 * - Flash effects on impacts
 * - Time-of-day transitions
 * - Dramatic lighting during special moves
 * 
 * Usage:
 * const lighting = new DynamicLightingSystem(scene);
 * lighting.setAmbientLight(0.7);
 * lighting.addSpotlight(fighter, { intensity: 1.5 });
 */
export default class DynamicLightingSystem {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.config = {
      enableSpotlights: config.enableSpotlights !== false,
      enableAmbient: config.enableAmbient !== false,
      enableDynamic: config.enableDynamic !== false
    };

    this.spotlights = [];
    this.ambientLevel = 1.0;
    this.overlay = null;
    this.lightGraphics = null;

    this.init();
    logger.info("DynamicLightingSystem initialized");
  }

  init() {
    const { width, height } = this.scene.scale;

    // Create overlay for ambient lighting control
    if (this.config.enableAmbient) {
      this.overlay = this.scene.add.rectangle(
        width / 2,
        height / 2,
        width,
        height,
        0x000000,
        0
      ).setDepth(100); // High depth to overlay everything
    }

    // Generate shared spotlight texture if it doesn't exist
    if (this.config.enableSpotlights && !this.scene.textures.exists('soft_light')) {
      const size = 256;
      // Create a standard HTML5 canvas element
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      const grd = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grd.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);
      
      // Add to Phaser Texture Manager
      this.scene.textures.addCanvas('soft_light', canvas);
    }
  }

  /**
   * Set ambient light level (0 = pitch black, 1 = full bright)
   */
  setAmbientLight(level = 1.0, duration = 0) {
    this.ambientLevel = Phaser.Math.Clamp(level, 0, 1);
    const targetAlpha = 1 - this.ambientLevel;

    if (duration > 0 && this.overlay) {
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: targetAlpha,
        duration: duration,
        ease: 'Sine.easeInOut'
      });
    } else if (this.overlay) {
      this.overlay.setAlpha(targetAlpha);
    }

    logger.debug(`Ambient light set to ${level}`);
  }

  /**
   * Add a spotlight that follows a game object
   */
  addSpotlight(target, config = {}) {
    const {
      radius = 150,
      intensity = 1.2,
      color = 0xffffff,
      depth = 101
    } = config;

    // Use the generated soft_light texture
    // Base size is 256, calculate scale to match desired radius
    const baseSize = 256;
    const scale = (radius * 2) / baseSize;

    const light = this.scene.add.image(0, 0, 'soft_light');
    light.setDepth(depth);
    light.setBlendMode(Phaser.BlendModes.ADD);
    light.setTint(color);
    light.setAlpha(intensity);
    light.setScale(scale);

    // Create spotlight container
    const spotlight = {
      target: target,
      radius: radius,
      intensity: intensity,
      color: color,
      graphic: light
    };

    this.spotlights.push(spotlight);

    logger.debug(`Spotlight added for target at (${target.x}, ${target.y})`);
    return spotlight;
  }

  /**
   * Remove a spotlight
   */
  removeSpotlight(spotlight) {
    const index = this.spotlights.indexOf(spotlight);
    if (index > -1) {
      if (spotlight.graphic) {
        spotlight.graphic.destroy();
      }
      this.spotlights.splice(index, 1);
      logger.debug("Spotlight removed");
    }
  }

  /**
   * Flash effect (for hits, special moves)
   */
  flash(color = 0xffffff, duration = 100, intensity = 0.8) {
    if (!this.overlay) return;

    this.overlay.setTint(color);
    this.overlay.setAlpha(intensity);

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 1 - this.ambientLevel,
      duration: duration,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.overlay.clearTint();
      }
    });

    logger.debug(`Flash effect: color=${color}, duration=${duration}ms`);
  }

  /**
   * Pulse lighting effect
   */
  pulse(config = {}) {
    const {
      minLevel = 0.7,
      maxLevel = 1.0,
      duration = 1000,
      repeat = 2
    } = config;

    this.scene.tweens.add({
      targets: { level: this.ambientLevel },
      level: minLevel,
      duration: duration / 2,
      yoyo: true,
      repeat: repeat,
      ease: 'Sine.easeInOut',
      onUpdate: (tween) => {
        const current = tween.getValue();
        this.setAmbientLight(current, 0);
      }
    });

    logger.debug("Pulse lighting effect started");
  }

  /**
   * Simulate time of day transition
   */
  setTimeOfDay(time = 'day', duration = 2000) {
    const presets = {
      dawn: { level: 0.6, tint: 0xffaa77 },
      day: { level: 1.0, tint: 0xffffff },
      dusk: { level: 0.7, tint: 0xff8844 },
      night: { level: 0.3, tint: 0x4444aa }
    };

    const preset = presets[time] || presets.day;

    this.setAmbientLight(preset.level, duration);
    
    if (this.overlay) {
      this.scene.tweens.add({
        targets: this.overlay,
        tint: preset.tint,
        duration: duration,
        ease: 'Sine.easeInOut'
      });
    }

    logger.debug(`Time of day set to: ${time}`);
  }

  /**
   * Create dramatic lighting for special moments
   */
  setDramaticLighting(type = 'victory') {
    switch (type) {
      case 'victory':
        this.setAmbientLight(0.4, 500);
        // Add spotlight on winner
        break;
      
      case 'critical':
        this.pulse({ minLevel: 0.5, maxLevel: 1.0, duration: 600, repeat: 3 });
        break;
      
      case 'ultimateMove':
        this.setAmbientLight(0.2, 200);
        this.flash(0xff00ff, 150, 0.9);
        setTimeout(() => {
          this.setAmbientLight(0.8, 300);
        }, 500);
        break;
    }

    logger.debug(`Dramatic lighting: ${type}`);
  }

  /**
   * Update spotlight positions (call in scene update)
   */
  update() {
    this.spotlights.forEach(spotlight => {
      if (spotlight.target && spotlight.graphic) {
        spotlight.graphic.setPosition(
          spotlight.target.x - spotlight.radius,
          spotlight.target.y - spotlight.radius
        );
      }
    });
  }

  /**
   * Clean up lighting system
   */
  destroy() {
    if (this.overlay) {
      this.overlay.destroy();
    }

    if (this.lightGraphics) {
      this.lightGraphics.destroy();
    }

    this.spotlights.forEach(spotlight => {
      if (spotlight.graphic) {
        spotlight.graphic.destroy();
      }
    });

    this.spotlights = [];
    logger.debug("DynamicLightingSystem destroyed");
  }
}

/**
 * Preset lighting configurations for different arena types
 */
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