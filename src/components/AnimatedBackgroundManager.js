import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:AnimatedBackgroundManager");

/**
 * AnimatedBackgroundManager - Manages animated background elements
 * 
 * Creates life in the background with:
 * - Moving clouds
 * - Swaying trees/flags
 * - Ambient crowd/characters
 * - Floating particles
 * - Animated decorations
 * 
 * Usage:
 * const bgAnimations = new AnimatedBackgroundManager(scene);
 * bgAnimations.addClouds({ count: 5, speed: 10 });
 * bgAnimations.addSwayingObject('tree', { amplitude: 5, period: 3000 });
 */
export default class AnimatedBackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.animatedObjects = [];
    this.particles = [];
    logger.info("AnimatedBackgroundManager initialized");
  }

  /**
   * Add moving clouds that float across the background
   */
  addClouds(config = {}) {
    const {
      count = 3,
      speed = 15,
      minY = 50,
      maxY = 200,
      depth = -10,
      alpha = 0.6,
      scale = { min: 0.5, max: 1.5 }
    } = config;

    const { width, height } = this.scene.scale;

    for (let i = 0; i < count; i++) {
      // Create cloud (use actual cloud texture if available, or circle shape)
      let cloud;
      if (this.scene.textures.exists('cloud')) {
        cloud = this.scene.add.image(
          Phaser.Math.Between(-100, width + 100),
          Phaser.Math.Between(minY, maxY),
          'cloud'
        );
      } else {
        // Fallback: create simple cloud shape
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, alpha);
        graphics.fillCircle(0, 0, 30);
        graphics.fillCircle(20, -5, 25);
        graphics.fillCircle(40, 0, 30);
        graphics.generateTexture('cloud_generated', 80, 60);
        graphics.destroy();
        
        cloud = this.scene.add.image(
          Phaser.Math.Between(-100, width + 100),
          Phaser.Math.Between(minY, maxY),
          'cloud_generated'
        );
      }

      const cloudScale = Phaser.Math.FloatBetween(scale.min, scale.max);
      cloud.setScale(cloudScale)
        .setAlpha(alpha)
        .setDepth(depth)
        .setScrollFactor(0.1); // Slow parallax

      // Animate movement
      const duration = (width + 200) / speed * 1000 / cloudScale;
      this.scene.tweens.add({
        targets: cloud,
        x: width + 100,
        duration: duration,
        repeat: -1,
        onRepeat: () => {
          cloud.x = -100;
          cloud.y = Phaser.Math.Between(minY, maxY);
        }
      });

      this.animatedObjects.push({ 
        sprite: cloud, 
        type: 'cloud' 
      });
    }

    logger.debug(`Added ${count} clouds`);
  }

  /**
   * Add swaying vegetation or decorations
   */
  addSwayingObject(textureKey, config = {}) {
    const {
      x = 100,
      y = 400,
      amplitude = 5,
      period = 2000,
      depth = 5,
      scrollFactor = 0.5
    } = config;

    if (!this.scene.textures.exists(textureKey)) {
      logger.warn(`Texture ${textureKey} not found for swaying object`);
      return;
    }

    const object = this.scene.add.image(x, y, textureKey)
      .setOrigin(0.5, 1) // Pivot at bottom
      .setDepth(depth)
      .setScrollFactor(scrollFactor);

    // Create swaying animation
    this.scene.tweens.add({
      targets: object,
      angle: { from: -amplitude, to: amplitude },
      duration: period,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    this.animatedObjects.push({ 
      sprite: object, 
      type: 'swaying' 
    });

    logger.debug(`Added swaying object: ${textureKey}`);
  }

  /**
   * Add ambient crowd or spectator sprites
   */
  addAmbientCrowd(config = {}) {
    const {
      positions = [[100, 300], [200, 300], [300, 300]],
      spriteKey = 'spectator',
      depth = -5,
      animationSpeed = 1000
    } = config;

    positions.forEach((pos, index) => {
      if (!this.scene.textures.exists(spriteKey)) {
        // Create simple placeholder
        const circle = this.scene.add.circle(pos[0], pos[1], 15, 0x666666, 0.5);
        circle.setDepth(depth).setScrollFactor(0.3);
        
        // Subtle bobbing animation
        this.scene.tweens.add({
          targets: circle,
          y: circle.y - 5,
          duration: animationSpeed + index * 200,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
        });

        this.animatedObjects.push({ sprite: circle, type: 'crowd' });
      } else {
        const spectator = this.scene.add.sprite(pos[0], pos[1], spriteKey)
          .setDepth(depth)
          .setScrollFactor(0.3);

        // Play idle animation if exists
        if (this.scene.anims.exists(`${spriteKey}_idle`)) {
          spectator.play(`${spriteKey}_idle`);
        }

        this.animatedObjects.push({ sprite: spectator, type: 'crowd' });
      }
    });

    logger.debug(`Added crowd with ${positions.length} spectators`);
  }

  /**
   * Add floating particles (dust, leaves, etc.)
   */
  addFloatingParticles(config = {}) {
    const {
      type = 'dust', // 'dust', 'leaves', 'petals', 'snow'
      count = 20,
      depth = 10,
      bounds = null
    } = config;

    const { width, height } = this.scene.scale;
    const particleBounds = bounds || { x: 0, y: 0, width, height };

    // Create particle graphics if needed
    if (!this.scene.textures.exists(`particle_${type}`)) {
      const graphics = this.scene.add.graphics();
      
      switch (type) {
        case 'dust':
          graphics.fillStyle(0xcccccc, 0.3);
          graphics.fillCircle(2, 2, 2);
          break;
        case 'leaves':
          graphics.fillStyle(0x88cc55, 0.5);
          graphics.fillEllipse(4, 4, 6, 3);
          break;
        case 'petals':
          graphics.fillStyle(0xff99cc, 0.5);
          graphics.fillEllipse(3, 3, 5, 5);
          break;
        case 'snow':
          graphics.fillStyle(0xffffff, 0.8);
          graphics.fillCircle(2, 2, 2);
          break;
      }
      
      graphics.generateTexture(`particle_${type}`, 8, 8);
      graphics.destroy();
    }

    // Create particle emitter
    const particles = this.scene.add.particles(0, 0, `particle_${type}`, {
      x: { min: particleBounds.x, max: particleBounds.x + particleBounds.width },
      y: particleBounds.y,
      speedX: { min: -20, max: 20 },
      speedY: { min: 10, max: 50 },
      gravityY: type === 'dust' ? 5 : 20,
      scale: { start: 0.3, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      lifespan: type === 'snow' ? 5000 : 3000,
      frequency: 200,
      maxParticles: count,
      blendMode: 'ADD'
    });

    particles.setDepth(depth);
    this.particles.push(particles);

    logger.debug(`Added ${type} particles`);
  }

  /**
   * Add animated flags or banners
   */
  addAnimatedFlags(positions = []) {
    positions.forEach(pos => {
      // Create flag sprite sheet animation if available
      if (this.scene.anims.exists('flag_wave')) {
        const flag = this.scene.add.sprite(pos.x, pos.y, 'flag')
          .setDepth(pos.depth || 0)
          .setScrollFactor(pos.scrollFactor || 0.4);
        
        flag.play('flag_wave');
        this.animatedObjects.push({ sprite: flag, type: 'flag' });
      } else {
        // Create simple waving rectangle
        const flagGraphics = this.scene.add.graphics();
        flagGraphics.fillStyle(0xff0000, 0.8);
        flagGraphics.fillRect(pos.x, pos.y, 40, 30);
        flagGraphics.setDepth(pos.depth || 0);
        
        // Wave animation via scale
        this.scene.tweens.add({
          targets: flagGraphics,
          scaleX: { from: 1, to: 0.9 },
          duration: 300,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
        });

        this.animatedObjects.push({ sprite: flagGraphics, type: 'flag' });
      }
    });

    logger.debug(`Added ${positions.length} animated flags`);
  }

  /**
   * Stop all animations and clean up
   */
  destroy() {
    this.animatedObjects.forEach(obj => {
      if (obj.sprite && obj.sprite.destroy) {
        this.scene.tweens.killTweensOf(obj.sprite);
        obj.sprite.destroy();
      }
    });

    this.particles.forEach(p => {
      if (p && p.destroy) {
        p.destroy();
      }
    });

    this.animatedObjects = [];
    this.particles = [];
    logger.debug("AnimatedBackgroundManager destroyed");
  }
}

/**
 * Preset configurations for different arena types
 */
export const ANIMATION_PRESETS = {
  city: (scene) => {
    const manager = new AnimatedBackgroundManager(scene);
    manager.addClouds({ count: 4, speed: 12 });
    manager.addFloatingParticles({ type: 'dust', count: 15 });
    return manager;
  },

  mountain: (scene) => {
    const manager = new AnimatedBackgroundManager(scene);
    manager.addClouds({ count: 6, speed: 8, minY: 30, maxY: 150 });
    manager.addSwayingObject('tree', { x: 100, y: 400, amplitude: 3 });
    manager.addFloatingParticles({ type: 'leaves', count: 25 });
    return manager;
  },

  dojo: (scene) => {
    const manager = new AnimatedBackgroundManager(scene);
    manager.addSwayingObject('banner', { x: 150, y: 100, amplitude: 5 });
    manager.addFloatingParticles({ type: 'dust', count: 10 });
    return manager;
  },

  beach: (scene) => {
    const manager = new AnimatedBackgroundManager(scene);
    manager.addClouds({ count: 3, speed: 10 });
    manager.addAnimatedFlags([
      { x: 100, y: 200, depth: -2 },
      { x: 300, y: 200, depth: -2 }
    ]);
    return manager;
  }
};