import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:AnimationEnhancer");

/**
 * AnimationEnhancer - Adds procedural animation effects (Squash & Stretch)
 * Implements Phase 1, Task 1.2 of the roadmap (Movement Feel)
 */
export default class AnimationEnhancer {
  constructor(scene) {
    this.scene = scene;
    logger.info("AnimationEnhancer initialized");
  }

  /**
   * Applies squash and stretch scaling to a fighter
   * @param {Fighter} fighter - The fighter sprite to animate
   * @param {number} scaleX - Target X scale (e.g. 1.2 for stretch)
   * @param {number} scaleY - Target Y scale (e.g. 0.8 for squash)
   * @param {number} duration - Duration in ms to return to normal
   */
  squashAndStretch(fighter, scaleX, scaleY, duration = 100) {
    if (!fighter || !fighter.active) return;

    // Apply immediate deformation
    fighter.setScale(scaleX, scaleY);

    // Tween back to normal (1.0)
    this.scene.tweens.add({
      targets: fighter,
      scaleX: 1,
      scaleY: 1,
      duration,
      ease: "Quad.easeOut",
    });

    logger.debug(`Squash/Stretch applied: ${scaleX}, ${scaleY}`);
  }

  destroy() {
    logger.info("AnimationEnhancer destroyed");
  }
}
