import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:AfterimageSystem");

/**
 * AfterimageSystem - Creates ghost trails for fast movement
 * Implements Phase 1, Task 1.2 of the roadmap (Movement Feel)
 */
export default class AfterimageSystem {
  constructor(scene) {
    this.scene = scene;
    this.pool = this.scene.add.group({
      defaultKey: "fighter", // Default, will be overridden
      maxSize: 20,
      createCallback: (item) => {
        item.setOrigin(0.5, 1);
        item.setAlpha(0);
        item.setVisible(false);
      },
    });
    logger.info("AfterimageSystem initialized");
  }

  /**
   * Spawns a single afterimage frame at the fighter's current position
   * @param {Fighter} fighter
   * @param {number} duration - Fade out duration
   * @param {number} alpha - Starting opacity
   * @param {number} tint - Optional tint color
   */
  spawnAfterimage(fighter, duration = 300, alpha = 0.5, tint = null) {
    if (!fighter || !fighter.active || !fighter.visible) return;

    // Get an inactive sprite from the pool
    const ghost = this.pool.get(fighter.x, fighter.y);

    if (!ghost) return; // Pool empty

    // Match fighter's current frame and visuals
    ghost.setTexture(fighter.texture.key);
    ghost.setFrame(fighter.frame.name);
    ghost.setScale(fighter.scaleX, fighter.scaleY);
    ghost.setFlipX(fighter.flipX);
    ghost.setDepth(fighter.depth - 1);

    // Set initial state
    ghost.setActive(true);
    ghost.setVisible(true);
    ghost.setAlpha(alpha);

    if (tint !== null) {
      ghost.setTint(tint);
    } else {
      ghost.clearTint();
    }

    // Animate fade out
    this.scene.tweens.add({
      targets: ghost,
      alpha: 0,
      duration,
      onComplete: () => {
        if (ghost.active) {
          this.pool.killAndHide(ghost);
        }
      },
    });
  }

  destroy() {
    this.pool.clear(true, true);
    logger.info("AfterimageSystem destroyed");
  }
}
