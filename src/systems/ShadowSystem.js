import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:ShadowSystem");

/**
 * ShadowSystem - Manages soft contact shadows for fighters
 * Implements Phase 1, Task 1.2 of the roadmap (Movement Feel)
 */
export default class ShadowSystem {
  constructor(scene) {
    this.scene = scene;
    this.shadows = new Map(); // Map<Fighter, Sprite>
    this.groundY = 0; // Will be set based on initial fighter position

    this.createShadowTexture();
    logger.info("ShadowSystem initialized");
  }

  /**
   * Generates a procedural soft radial gradient texture
   */
  createShadowTexture() {
    if (this.scene.textures.exists("soft-shadow")) return;

    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size / 2; // Oval shape
    const ctx = canvas.getContext("2d");

    // Draw radial gradient
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 4,
      0,
      size / 2,
      size / 4,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.6)"); // Dark center
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Transparent edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size / 2);

    this.scene.textures.addCanvas("soft-shadow", canvas);
    logger.debug("Soft shadow texture generated");
  }

  /**
   * Registers a fighter to have a shadow
   * @param {Fighter} fighter
   */
  addFighter(fighter) {
    if (this.shadows.has(fighter)) return;

    // Use fighter's initial Y as the ground reference if not set
    if (this.groundY === 0) {
      this.groundY = fighter.y;
    }

    const shadow = this.scene.add.sprite(
      fighter.x,
      this.groundY,
      "soft-shadow",
    );
    shadow.setOrigin(0.5, 0.5);
    shadow.setDepth(fighter.depth - 1); // Always behind fighter
    shadow.setAlpha(0.8);

    this.shadows.set(fighter, shadow);
    logger.debug(`Shadow added for fighter: ${fighter.texture.key}`);
  }

  /**
   * Updates all shadows to follow their owners
   */
  update() {
    this.shadows.forEach((shadow, fighter) => {
      if (!fighter.active || !fighter.visible) {
        shadow.setVisible(false);
        return;
      }

      shadow.setVisible(true);

      // Lock X to fighter, Lock Y to ground
      shadow.setPosition(fighter.x, this.groundY);

      // Scale based on height (inverse relationship)
      // As fighter goes up, shadow gets smaller and more transparent
      const heightDiff = Math.max(0, this.groundY - fighter.y);
      const maxJumpHeight = 200; // Approx max jump height in pixels

      const scaleFactor = Math.max(0.4, 1 - heightDiff / maxJumpHeight);
      const alphaFactor = Math.max(
        0.2,
        0.8 - (heightDiff / maxJumpHeight) * 0.6,
      );

      // Flip shadow if fighter flips (handles any asymmetry if we change texture later)
      shadow.setScale(scaleFactor * 1.5, scaleFactor * 0.8); // Flatten Y for perspective
      shadow.setAlpha(alphaFactor);
    });
  }

  destroy() {
    this.shadows.forEach((shadow) => shadow.destroy());
    this.shadows.clear();
    logger.info("ShadowSystem destroyed");
  }
}
