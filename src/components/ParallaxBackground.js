/* eslint-disable no-param-reassign */
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:ParallaxBackground");

/**
 * ParallaxBackground - Multi-layer scrolling background system
 *
 * Creates depth through multiple layers moving at different speeds.
 * Follows the camera for authentic parallax effect.
 *
 * Usage:
 * const parallax = new ParallaxBackground(scene, {
 *   layers: [
 *     { key: 'sky', scrollFactor: 0 },
 *     { key: 'mountains', scrollFactor: 0.2 },
 *     { key: 'trees', scrollFactor: 0.5 }
 *   ]
 * });
 */
export default class ParallaxBackground {
  /**
   * @param {Phaser.Scene} scene - The scene this parallax belongs to
   * @param {Object} config - Configuration object
   * @param {Array} config.layers - Array of layer definitions
   * @param {string} config.layers[].key - Texture key for the layer
   * @param {number} config.layers[].scrollFactor - How fast layer moves (0=static, 1=normal)
   * @param {number} [config.layers[].depth] - Optional depth override
   * @param {number} [config.layers[].alpha] - Optional alpha/transparency
   * @param {number} [config.layers[].tint] - Optional color tint
   * @param {boolean} [config.layers[].repeat] - Whether to tile horizontally
   * @param {number} [config.baseDepth=0] - Starting depth for layers
   */
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.layers = [];
    this.baseDepth = config.baseDepth || 0;

    this.createLayers();
    logger.info(`ParallaxBackground created with ${this.layers.length} layers`);
  }

  createLayers() {
    const { width, height } = this.scene.scale;

    this.config.layers.forEach((layerConfig, index) => {
      if (!this.scene.textures.exists(layerConfig.key)) {
        logger.warn(`Texture ${layerConfig.key} not found, skipping layer`);
        return;
      }

      let layer;

      if (layerConfig.repeat) {
        // Create tiled sprite for repeating backgrounds
        layer = this.scene.add.tileSprite(
          width / 2,
          height / 2,
          width,
          height,
          layerConfig.key,
        );
      } else {
        // Create standard image
        layer = this.scene.add
          .image(width / 2, height / 2, layerConfig.key)
          .setDisplaySize(width, height);
      }

      // Apply scroll factor for parallax effect
      layer.setScrollFactor(layerConfig.scrollFactor || 0);

      // Set depth (further = lower depth)
      const depth =
        layerConfig.depth !== undefined
          ? layerConfig.depth
          : this.baseDepth + index;
      layer.setDepth(depth);

      // Optional alpha
      if (layerConfig.alpha !== undefined) {
        layer.setAlpha(layerConfig.alpha);
      }

      // Optional tint
      if (layerConfig.tint !== undefined) {
        layer.setTint(layerConfig.tint);
      }

      // Store reference with metadata
      this.layers.push({
        sprite: layer,
        config: layerConfig,
        isTiled: layerConfig.repeat,
      });

      logger.debug(
        `Layer ${index} created: ${layerConfig.key}, ` +
          `scrollFactor=${layerConfig.scrollFactor}, depth=${depth}`,
      );
    });
  }

  /**
   * Update parallax layers (call in scene update)
   * Handles tiled sprite scrolling for infinite backgrounds
   */
  update(time, delta) {
    const camera = this.scene.cameras.main;

    this.layers.forEach(({ sprite, config, isTiled }) => {
      if (isTiled) {
        // Auto-scroll tiled backgrounds based on scroll factor
        const scrollSpeed = config.scrollSpeed || 0;
        if (scrollSpeed !== 0) {
          sprite.tilePositionX += scrollSpeed * delta * 0.001;
        }

        // Sync with camera for parallax
        const parallaxOffset = camera.scrollX * (1 - config.scrollFactor);
        sprite.tilePositionX = parallaxOffset;
      }
    });
  }

  /**
   * Get a specific layer by index or key
   */
  getLayer(indexOrKey) {
    if (typeof indexOrKey === "number") {
      return this.layers[indexOrKey]?.sprite;
    }
    return this.layers.find((l) => l.config.key === indexOrKey)?.sprite;
  }

  /**
   * Clean up all layers
   */
  destroy() {
    this.layers.forEach((layer) => {
      if (layer.sprite && layer.sprite.destroy) {
        layer.sprite.destroy();
      }
    });
    this.layers = [];
    logger.debug("ParallaxBackground destroyed");
  }
}

/**
 * Example layer configurations for different arena types:
 */
