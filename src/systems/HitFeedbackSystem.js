import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:HitFeedbackSystem");

/**
 * HitFeedbackSystem - Centralized system for all hit feedback effects
 * Implements Phase 1, Task 1.1 of the roadmap:
 * - Hit Stop/Freeze Frames (50-100ms pause)
 * - Screen Shake (camera shake on impact)
 * - Hit Sparks/Particles (visual effects)
 * - Damage Numbers (floating numbers)
 * - Flash/Blink (white flash on impact)
 */
export default class HitFeedbackSystem {
  constructor(scene) {
    this.scene = scene;
    this.isHitStopActive = false;

    // Create particle emitter for hit sparks
    this.createHitSparkEmitter();

    logger.info("HitFeedbackSystem initialized");
  }

  /**
   * Creates the particle emitter for hit sparks
   * Uses Phaser's particle system for dynamic visual effects
   */
  createHitSparkEmitter() {
    // Create a simple graphics texture for particles
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture("hit-spark-particle", 8, 8);
    graphics.destroy();

    // Create the particle emitter (disabled by default)
    this.hitSparkEmitter = this.scene.add.particles(
      0,
      0,
      "hit-spark-particle",
      {
        speed: { min: 100, max: 300 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 300,
        gravityY: 200,
        frequency: -1, // Manual emission
        quantity: 1,
      },
    );

    this.hitSparkEmitter.stop();
    logger.debug("Hit spark emitter created");
  }

  /**
   * Main method to trigger all hit feedback effects
   * @param {Fighter} attacker - The fighter dealing damage
   * @param {Fighter} defender - The fighter receiving damage
   * @param {number} damage - Amount of damage dealt
   * @param {boolean} isHeavyHit - Whether this is a heavy hit (optional)
   * @param {boolean} isLethal - Whether this hit is a KO (optional)
   */
  triggerHitFeedback(
    attacker,
    defender,
    damage,
    isHeavyHit = false,
    isLethal = false,
  ) {
    logger.info(
      `Triggering hit feedback: ${damage} damage${isHeavyHit ? " (HEAVY)" : ""}${isLethal ? " (LETHAL)" : ""}`,
    );

    // Calculate impact point (between attacker and defender)
    const impactX = (attacker.x + defender.x) / 2;
    const impactY = defender.y - 90; // Roughly chest height

    // 1. Hit Stop (Freeze Frames)
    // If lethal, use 500ms "Super Hit Stop"
    let freezeDuration = 60;
    if (isLethal) {
      freezeDuration = 500;
    } else if (isHeavyHit) {
      freezeDuration = 100;
    }
    this.hitStop(freezeDuration);

    // 2. Screen Shake
    this.screenShake(isHeavyHit ? 8 : 4, isHeavyHit ? 200 : 150);

    // 3. Hit Sparks
    this.spawnHitSparks(impactX, impactY, isHeavyHit);

    // 4. Damage Numbers
    this.spawnDamageNumber(impactX, impactY, damage);

    // 5. Flash/Blink (on defender)
    this.flashFighter(defender);
  }

  /**
   * 1. Hit Stop - Freezes the game for a brief moment (50-100ms)
   * Creates the classic "Street Fighter" impact feel
   * @param {number} duration - Duration in milliseconds (50-100ms)
   */
  hitStop(duration = 60) {
    if (this.isHitStopActive) return;

    this.isHitStopActive = true;

    // Pause physics
    this.scene.physics.pause();

    // Pause animations
    this.scene.anims.pauseAll();

    logger.debug(`Hit stop for ${duration}ms`);

    // Resume after duration
    this.scene.time.delayedCall(duration, () => {
      this.scene.physics.resume();
      this.scene.anims.resumeAll();
      this.isHitStopActive = false;
      logger.debug("Hit stop ended");
    });
  }

  /**
   * 2. Screen Shake - Shakes the camera for impact
   * Intensity and duration vary based on hit strength
   * @param {number} intensity - Shake intensity (pixels)
   * @param {number} duration - Shake duration (milliseconds)
   */
  screenShake(intensity = 4, duration = 150) {
    this.scene.cameras.main.shake(duration, intensity * 0.001);
    logger.debug(
      `Screen shake: intensity=${intensity}, duration=${duration}ms`,
    );
  }

  /**
   * 3. Hit Sparks - Spawns particle effects at impact point
   * Different colors for light vs heavy hits
   * @param {number} x - X position of impact
   * @param {number} y - Y position of impact
   * @param {boolean} isHeavy - Whether this is a heavy hit
   */
  spawnHitSparks(x, y, isHeavy = false) {
    // Determine spark color (white for light, yellow/orange for heavy)
    const sparkCount = isHeavy ? 12 : 8;
    const sparkColor = isHeavy ? 0xffaa00 : 0xffffff;

    // Set particle tint (Phaser 3.60+ renamed this to setParticleTint)
    this.hitSparkEmitter.setParticleTint(sparkColor);

    // Emit particles at impact point
    this.hitSparkEmitter.emitParticleAt(x, y, sparkCount);

    logger.debug(
      `Hit sparks spawned at (${x}, ${y}), count=${sparkCount}, heavy=${isHeavy}`,
    );
  }

  /**
   * 4. Damage Numbers - Creates floating damage text
   * Numbers bounce up and fade out, like traditional fighting games
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} damage - Damage amount to display
   */
  spawnDamageNumber(x, y, damage) {
    // Create damage text
    const damageText = this.scene.add.text(
      x,
      y,
      Math.round(damage).toString(),
      {
        fontSize: "32px",
        fontFamily: '"Press Start 2P", cursive',
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      },
    );

    damageText.setOrigin(0.5, 0.5);
    damageText.setDepth(1000); // Always on top

    // Animate: bounce up and fade out
    this.scene.tweens.add({
      targets: damageText,
      y: y - 80,
      alpha: 0,
      scale: 1.5,
      duration: 800,
      ease: "Cubic.easeOut",
      onComplete: () => {
        damageText.destroy();
      },
    });

    logger.debug(`Damage number spawned: ${damage} at (${x}, ${y})`);
  }

  /**
   * 5. Flash/Blink - Makes the fighter flash white for 1 frame
   * Classic "hit confirmation" visual
   * @param {Fighter} fighter - The fighter to flash
   */
  flashFighter(fighter) {
    // Set to pure white tint
    fighter.setTint(0xffffff);

    // Return to normal after 1 frame (16ms at 60fps)
    this.scene.time.delayedCall(16, () => {
      fighter.clearTint();
    });

    logger.debug(`Fighter flash triggered for ${fighter.texture.key}`);
  }

  /**
   * Cleanup method - call this in scene shutdown
   */
  destroy() {
    if (this.hitSparkEmitter) {
      this.hitSparkEmitter.destroy();
    }
    logger.info("HitFeedbackSystem destroyed");
  }
}
