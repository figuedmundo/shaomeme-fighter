import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:WeatherSystem");

/**
 * WeatherSystem - Dynamic weather effects for arenas
 *
 * Supports:
 * - Rain (light, heavy, storm)
 * - Snow (light, heavy, blizzard)
 * - Fog (light, dense)
 * - Wind effects
 * - Lightning strikes
 *
 * Usage:
 * const weather = new WeatherSystem(scene);
 * weather.setWeather('rain', { intensity: 'heavy' });
 */
export default class WeatherSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeWeather = null;
    this.particles = null;
    this.fogOverlay = null;
    this.windEffect = null;
    this.lightningGraphics = null;

    logger.info("WeatherSystem initialized");
  }

  /**
   * Set weather type and intensity
   */
  setWeather(type = "none", config = {}) {
    // Clear existing weather
    this.clearWeather();

    switch (type) {
      case "rain":
        this.createRain(config);
        break;
      case "snow":
        this.createSnow(config);
        break;
      case "fog":
        this.createFog(config);
        break;
      case "storm":
        this.createStorm(config);
        break;
      case "wind":
        this.createWind(config);
        break;
      case "none":
      default:
        break;
    }

    this.activeWeather = type;
    logger.info(`Weather set to: ${type}`);
  }

  /**
   * Create rain effect
   */
  createRain(config = {}) {
    const {
      intensity = "medium", // 'light', 'medium', 'heavy'
      angle = -90,
      windStrength = 0,
      depth = 1000,
    } = config;

    const intensityMap = {
      light: { frequency: 100, speed: 300, quantity: 200 },
      medium: { frequency: 50, speed: 500, quantity: 400 },
      heavy: { frequency: 20, speed: 700, quantity: 600 },
    };

    const settings = intensityMap[intensity] || intensityMap.medium;
    const { width } = this.scene.scale;

    // Create rain particle texture if it doesn't exist
    if (!this.scene.textures.exists("rain_drop")) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0x88ccff, 0.6);
      graphics.fillRect(0, 0, 2, 8);
      graphics.generateTexture("rain_drop", 2, 8);
      graphics.destroy();
    }

    this.particles = this.scene.add.particles(0, 0, "rain_drop", {
      x: { min: -100, max: width + 100 },
      y: -10,
      speedX: windStrength,
      speedY: { min: settings.speed, max: settings.speed + 100 },
      gravityY: 200,
      scale: { min: 0.3, max: 0.8 },
      alpha: { start: 0.8, end: 0.2 },
      lifespan: 3000,
      frequency: settings.frequency,
      maxParticles: settings.quantity,
      blendMode: "ADD",
      angle,
    });

    this.rainEmitter = this.particles;

    this.particles.setDepth(depth);

    // Add splash effect on ground
    this.createRainSplash();

    logger.debug(`Rain created with ${intensity} intensity`);
  }

  /**
   * Create rain splash particles on ground
   */
  createRainSplash() {
    const { width, height } = this.scene.scale;
    const groundY = height - 100;

    if (!this.scene.textures.exists("rain_splash")) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xaaddff, 0.4);
      graphics.fillCircle(2, 2, 2);
      graphics.generateTexture("rain_splash", 4, 4);
      graphics.destroy();
    }

    const splashParticles = this.scene.add.particles(0, 0, "rain_splash", {
      x: { min: 0, max: width },
      y: groundY,
      speedX: { min: -30, max: 30 },
      speedY: { min: -80, max: -40 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 300,
      frequency: 30,
      maxParticles: 100,
      gravityY: 300,
    });

    splashParticles.setDepth(999);
  }

  /**
   * Create snow effect
   */
  createSnow(config = {}) {
    const {
      intensity = "medium", // 'light', 'medium', 'blizzard'
      windStrength = 20,
      depth = 1000,
    } = config;

    const intensityMap = {
      light: { frequency: 150, quantity: 150 },
      medium: { frequency: 80, quantity: 300 },
      blizzard: { frequency: 30, quantity: 500 },
    };

    const settings = intensityMap[intensity] || intensityMap.medium;
    const { width } = this.scene.scale;

    // Create snowflake texture
    if (!this.scene.textures.exists("snowflake")) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillCircle(3, 3, 3);
      graphics.fillRect(1, 3, 5, 1);
      graphics.fillRect(3, 1, 1, 5);
      graphics.generateTexture("snowflake", 7, 7);
      graphics.destroy();
    }

    this.particles = this.scene.add.particles(0, 0, "snowflake", {
      x: { min: -100, max: width + 100 },
      y: -10,
      speedX: { min: -windStrength, max: windStrength },
      speedY: { min: 50, max: 150 },
      gravityY: 20,
      scale: { min: 0.3, max: 1.2 },
      alpha: { start: 0.9, end: 0.3 },
      lifespan: 8000,
      frequency: settings.frequency,
      maxParticles: settings.quantity,
      rotate: { min: 0, max: 360 },
      angle: { min: -30, max: 30 },
    });

    this.particles.setDepth(depth);

    logger.debug(`Snow created with ${intensity} intensity`);
  }

  /**
   * Create fog effect
   */
  createFog(config = {}) {
    const {
      density = 0.5, // 0 to 1
      color = 0xaaaaaa,
      depth = 500,
      animated = true,
    } = config;

    const { width, height } = this.scene.scale;

    // Create a vertical gradient for more natural fog (thicker at bottom)
    if (!this.scene.textures.exists("fog_gradient")) {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);

      // Top is transparent, bottom is solid white (we will tint it)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.5)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, 256);
      this.scene.textures.addCanvas("fog_gradient", canvas);
    }

    // Create fog overlay using the gradient
    this.fogOverlay = this.scene.add
      .image(width / 2, height / 2, "fog_gradient")
      .setDisplaySize(width, height)
      .setDepth(depth)
      .setAlpha(0)
      .setTint(color)
      .setScrollFactor(0);

    const targetAlpha = density * 0.7;

    if (animated) {
      // Pulse fog density
      this.scene.tweens.add({
        targets: this.fogOverlay,
        alpha: targetAlpha,
        duration: 2000,
        ease: "Sine.easeIn",
      });

      this.scene.tweens.add({
        targets: this.fogOverlay,
        alpha: { from: targetAlpha, to: targetAlpha * 0.6 },
        duration: 4000,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
        delay: 2000,
      });
    } else {
      this.fogOverlay.setAlpha(targetAlpha);
    }

    // Add fog particles for more realism
    if (!this.scene.textures.exists("fog_particle")) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xffffff, 0.1);
      graphics.fillCircle(20, 20, 20);
      graphics.generateTexture("fog_particle", 40, 40);
      graphics.destroy();
    }

    this.particles = this.scene.add.particles(0, 0, "fog_particle", {
      x: { min: -50, max: width + 50 },
      y: { min: height * 0.6, max: height },
      speedX: { min: -10, max: 10 },
      speedY: { min: -20, max: -5 },
      scale: { min: 1, max: 3 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 5000,
      frequency: 200,
      maxParticles: 50,
      blendMode: "ADD",
    });

    this.particles.setDepth(depth + 1);

    logger.debug(`Fog created with ${density} density`);
  }

  /**
   * Create storm effect (rain + lightning)
   */
  createStorm(config = {}) {
    // Create heavy rain
    this.createRain({
      intensity: "heavy",
      windStrength: 50,
      ...config,
    });

    // Add lightning
    this.lightningGraphics = this.scene.add.graphics();
    this.lightningGraphics.setDepth(1001);

    // Periodic lightning strikes
    this.lightningTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(3000, 7000),
      callback: () => this.triggerLightning(),
      loop: true,
    });

    logger.debug("Storm created with lightning");
  }

  /**
   * Trigger lightning strike effect
   */
  triggerLightning() {
    // Flash the screen white
    const flash = this.scene.add
      .rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        this.scene.scale.width,
        this.scene.scale.height,
        0xffffff,
        0.8,
      )
      .setDepth(1002);

    // Draw lightning bolt
    if (this.lightningGraphics) {
      this.lightningGraphics.clear();
      this.lightningGraphics.lineStyle(3, 0xffffaa, 0.9);

      const startX = Phaser.Math.Between(
        this.scene.scale.width * 0.2,
        this.scene.scale.width * 0.8,
      );
      let currentX = startX;
      let currentY = 0;

      this.lightningGraphics.beginPath();
      this.lightningGraphics.moveTo(currentX, currentY);

      // Create jagged lightning path
      for (let i = 0; i < 10; i += 1) {
        currentX += Phaser.Math.Between(-30, 30);
        currentY += this.scene.scale.height / 10;
        this.lightningGraphics.lineTo(currentX, currentY);
      }

      this.lightningGraphics.strokePath();
    }

    // Flash animation
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 100,
      onComplete: () => flash.destroy(),
    });

    // Clear lightning after brief moment
    this.scene.time.delayedCall(150, () => {
      if (this.lightningGraphics) {
        this.lightningGraphics.clear();
      }
    });

    // Optional: play thunder sound
    if (this.scene.sound && this.scene.sound.get("thunder")) {
      this.scene.sound.play("thunder", { volume: 0.3 });
    }

    // Schedule next lightning
    if (this.lightningTimer) {
      this.lightningTimer.reset({
        delay: Phaser.Math.Between(3000, 7000),
        callback: () => this.triggerLightning(),
        loop: false,
      });
    }

    logger.debug("Lightning strike triggered");
  }

  /**
   * Create wind effect (affects other particles)
   */
  createWind(config = {}) {
    const { strength = 50, gustInterval = 3000 } = config;

    // Wind affects existing particle systems
    this.windEffect = {
      baseStrength: strength,
      currentStrength: 0,
    };

    // Create wind gusts
    this.windTimer = this.scene.time.addEvent({
      delay: gustInterval,
      callback: () => {
        const gustStrength = strength + Phaser.Math.Between(-20, 40);

        this.scene.tweens.add({
          targets: this.windEffect,
          currentStrength: gustStrength,
          duration: 1000,
          ease: "Sine.easeInOut",
          yoyo: true,
        });
      },
      loop: true,
    });

    logger.debug(`Wind created with ${strength} strength`);
  }

  /**
   * Clear all weather effects
   */
  clearWeather() {
    if (this.particles) {
      this.particles.destroy();
      this.particles = null;
    }

    if (this.fogOverlay) {
      this.fogOverlay.destroy();
      this.fogOverlay = null;
    }

    if (this.lightningGraphics) {
      this.lightningGraphics.destroy();
      this.lightningGraphics = null;
    }

    if (this.lightningTimer) {
      this.lightningTimer.remove();
      this.lightningTimer = null;
    }

    if (this.windTimer) {
      this.windTimer.remove();
      this.windTimer = null;
    }

    this.activeWeather = null;
    logger.debug("Weather cleared");
  }

  /**
   * Update weather effects (call in scene update if needed)
   */
  update() {
    // Apply wind effect to particles if active
    if (this.windEffect && this.particles) {
      // Wind strength can affect particle emitters dynamically
    }
  }

  /**
   * Clean up weather system
   */
  destroy() {
    this.clearWeather();
    logger.debug("WeatherSystem destroyed");
  }
}

/**
 * Preset weather configurations for different arenas
 */
