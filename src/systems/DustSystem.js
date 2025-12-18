import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:DustSystem");

/**
 * DustSystem - Manages particle effects for movement events
 * Implements Phase 1, Task 1.2 of the roadmap (Movement Feel)
 */
export default class DustSystem {
  constructor(scene) {
    this.scene = scene;
    this.createDustTexture();
    this.createEmitter();
    logger.info("DustSystem initialized");
  }

  /**
   * Generates a procedural cloud puff texture
   */
  createDustTexture() {
    if (this.scene.textures.exists("dust-particle")) return;

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(6, 6, 6);
    graphics.generateTexture("dust-particle", 12, 12);
    graphics.destroy();
  }

  /**
   * Configures the shared particle emitter
   */
  createEmitter() {
    this.emitter = this.scene.add.particles(0, 0, "dust-particle", {
      lifespan: { min: 200, max: 400 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      gravityY: -50, // Float up slightly
      speed: { min: 20, max: 50 },
      angle: { min: 0, max: 360 },
      emitting: false,
    });

    // Set depth low so it's behind characters usually
    this.emitter.setDepth(5);
  }

  /**
   * Triggers a dust burst at the specified location (Landing)
   * @param {number} x
   * @param {number} y
   */
  triggerLand(x, y) {
    this.emitter.emitParticleAt(x, y + 10, 6); // 6 particles at feet
    logger.debug(`Land dust at ${x}, ${y}`);
  }

  /**
   * Triggers a directional dust burst (Dash)
   * @param {number} x
   * @param {number} y
   * @param {string} direction 'left' or 'right'
   */
  triggerDash(x, y, direction) {
    // If dashing right, dust shoots left, and vice versa
    const angleMin = direction === "right" ? 160 : -20;
    const angleMax = direction === "right" ? 200 : 20;

    this.emitter.emitParticleAt(x, y + 5, 4);

    // Note: To support directional emission properly in shared emitter,
    // we might need separate emitters or just rely on random spread for now.
    // For simplicity/performance, we'll use the generic spread but maybe add a velocity bias later.

    logger.debug(`Dash dust at ${x}, ${y} (${direction})`);
  }

  /**
   * Triggers dust on abrupt turn or heavy step
   * @param {number} x
   * @param {number} y
   */
  triggerTurn(x, y) {
    this.emitter.emitParticleAt(x, y + 10, 3);
  }

  destroy() {
    if (this.emitter) {
      this.emitter.destroy();
    }
    logger.info("DustSystem destroyed");
  }
}
