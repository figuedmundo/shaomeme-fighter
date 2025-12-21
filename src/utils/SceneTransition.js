/**
 * SceneTransition.js
 *
 * Advanced scene transition system for Shaomeme Fighter
 * Provides stylish screen wipes, fades, and effects for scene changes
 *
 * Phase 5.1: Scene Transitions Implementation
 *
 * Features:
 * - Multiple transition types (fade, wipe, slide, flash)
 * - Customizable durations and colors
 * - Chain-able transitions
 * - Audio support
 * - Promise-based API for async flows
 *
 * Usage:
 * const transition = new SceneTransition(this);
 * transition.fadeOut(500).then(() => {
 *   this.scene.start('NextScene');
 * });
 */

import Phaser from "phaser";
import UnifiedLogger from "./Logger.js";

const logger = new UnifiedLogger("Frontend:SceneTransition");

export const TransitionType = {
  FADE: "fade",
  WIPE_HORIZONTAL: "wipeHorizontal",
  WIPE_VERTICAL: "wipeVertical",
  WIPE_DIAGONAL: "wipeDiagonal",
  WIPE_RADIAL: "wipeRadial",
  SLIDE_LEFT: "slideLeft",
  SLIDE_RIGHT: "slideRight",
  SLIDE_UP: "slideUp",
  SLIDE_DOWN: "slideDown",
  FLASH: "flash",
  PIXELATE: "pixelate",
  CURTAIN: "curtain",
};

export default class SceneTransition {
  /**
   * Create a new SceneTransition manager
   * @param {Phaser.Scene} scene - The current scene
   */
  constructor(scene) {
    this.scene = scene;
    this.overlay = null;
    this.isTransitioning = false;
    this.audioManager = scene.registry?.get("audioManager");
  }

  /**
   * Fade to black (or any color) then callback
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Hex color (default: black)
   * @param {function} callback - Optional callback when fade completes
   * @returns {Promise}
   */
  fadeOut(duration = 500, color = 0x000000, callback = null) {
    return new Promise((resolve) => {
      if (this.isTransitioning) {
        logger.warn("Transition already in progress");
        resolve();
        return;
      }

      this.isTransitioning = true;
      logger.debug(`Fade out: ${duration}ms to color ${color.toString(16)}`);

      // Use Phaser's built-in camera fade
      if (this.scene.cameras && this.scene.cameras.main) {
        const r = Math.floor(color / 65536) % 256;
        const g = Math.floor(color / 256) % 256;
        const b = color % 256;

        this.scene.cameras.main.fadeOut(duration, r, g, b);

        this.scene.cameras.main.once("camerafadeoutcomplete", () => {
          this.isTransitioning = false;
          if (callback) callback();
          resolve();
        });
      } else {
        logger.warn("Camera system not available for fadeOut");
        this.isTransitioning = false;
        if (callback) callback();
        resolve();
      }
    });
  }

  /**
   * Fade in from black (or any color)
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Hex color (default: black)
   * @returns {Promise}
   */
  fadeIn(duration = 500, color = 0x000000) {
    return new Promise((resolve) => {
      logger.debug(`Fade in: ${duration}ms from color ${color.toString(16)}`);

      if (
        this.scene.cameras &&
        this.scene.cameras.main &&
        typeof this.scene.cameras.main.fadeIn === "function"
      ) {
        const r = Math.floor(color / 65536) % 256;
        const g = Math.floor(color / 256) % 256;
        const b = color % 256;

        this.scene.cameras.main.fadeIn(duration, r, g, b);

        this.scene.cameras.main.once("camerafadeincomplete", () => {
          resolve();
        });
      } else {
        logger.warn("Camera system not available for fadeIn");
        resolve();
      }
    });
  }

  /**
   * Flash effect (like a photo flash)
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Flash color (default: white)
   * @param {number} intensity - Flash intensity 0-1 (default: 1)
   * @returns {Promise}
   */
  flash(duration = 250, color = 0xffffff) {
    return new Promise((resolve) => {
      logger.debug(`Flash: ${duration}ms color ${color.toString(16)}`);

      if (
        this.scene.cameras &&
        this.scene.cameras.main &&
        typeof this.scene.cameras.main.flash === "function"
      ) {
        const r = Math.floor(color / 65536) % 256;
        const g = Math.floor(color / 256) % 256;
        const b = color % 256;

        this.scene.cameras.main.flash(
          duration,
          r,
          g,
          b,
          false,
          (camera, progress) => {
            if (progress === 1) resolve();
          },
        );
      } else {
        logger.warn("Camera system not available for flash");
        resolve();
      }
    });
  }

  /**
   * Horizontal wipe transition (left to right)
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Wipe color
   * @param {string} direction - 'left' or 'right'
   * @returns {Promise}
   */
  wipeHorizontal(duration = 800, color = 0x000000, direction = "right") {
    return new Promise((resolve) => {
      if (this.isTransitioning) {
        resolve();
        return;
      }

      this.isTransitioning = true;
      const { width, height } = this.scene.scale;

      // Create overlay graphics
      this.overlay = this.scene.add.graphics();
      this.overlay.setDepth(10000); // Very high depth to be on top
      this.overlay.setScrollFactor(0); // Fixed to camera

      const startX = direction === "right" ? -width : width;
      const endX = direction === "right" ? width : -width;

      // Animate the wipe
      this.scene.tweens.add({
        targets: { progress: 0 },
        progress: 1,
        duration,
        ease: "Power2",
        onUpdate: (tween) => {
          const progress = tween.getValue();
          this.overlay.clear();
          this.overlay.fillStyle(color, 1);

          const currentWidth = Phaser.Math.Linear(0, width * 2, progress);
          const currentX = Phaser.Math.Linear(startX, endX, progress);

          this.overlay.fillRect(currentX - width, 0, currentWidth, height);
        },
        onComplete: () => {
          this.isTransitioning = false;
          resolve();
        },
      });
    });
  }

  /**
   * Vertical wipe transition (top to bottom or bottom to top)
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Wipe color
   * @param {string} direction - 'down' or 'up'
   * @returns {Promise}
   */
  wipeVertical(duration = 800, color = 0x000000, direction = "down") {
    return new Promise((resolve) => {
      if (this.isTransitioning) {
        resolve();
        return;
      }

      this.isTransitioning = true;
      const { width, height } = this.scene.scale;

      this.overlay = this.scene.add.graphics();
      this.overlay.setDepth(10000);
      this.overlay.setScrollFactor(0);

      const startY = direction === "down" ? -height : height;
      const endY = direction === "down" ? height : -height;

      this.scene.tweens.add({
        targets: { progress: 0 },
        progress: 1,
        duration,
        ease: "Power2",
        onUpdate: (tween) => {
          const progress = tween.getValue();
          this.overlay.clear();
          this.overlay.fillStyle(color, 1);

          const currentHeight = Phaser.Math.Linear(0, height * 2, progress);
          const currentY = Phaser.Math.Linear(startY, endY, progress);

          this.overlay.fillRect(0, currentY - height, width, currentHeight);
        },
        onComplete: () => {
          this.isTransitioning = false;
          resolve();
        },
      });
    });
  }

  /**
   * Radial wipe (expanding circle)
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Wipe color
   * @param {string} mode - 'expand' or 'contract'
   * @returns {Promise}
   */
  wipeRadial(duration = 1000, color = 0x000000, mode = "expand") {
    return new Promise((resolve) => {
      if (this.isTransitioning) {
        resolve();
        return;
      }

      this.isTransitioning = true;
      const { width, height } = this.scene.scale;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.sqrt(width * width + height * height) / 2;

      this.overlay = this.scene.add.graphics();
      this.overlay.setDepth(10000);
      this.overlay.setScrollFactor(0);

      this.scene.tweens.add({
        targets: { progress: 0 },
        progress: 1,
        duration,
        ease: "Sine.easeInOut",
        onUpdate: (tween) => {
          const progress = tween.getValue();
          this.overlay.clear();

          if (mode === "expand") {
            // Circle expands from center
            const radius = Phaser.Math.Linear(0, maxRadius, progress);
            this.overlay.fillStyle(color, 1);
            this.overlay.fillCircle(centerX, centerY, radius);
          } else {
            // Screen fills except for contracting circle
            const radius = Phaser.Math.Linear(maxRadius, 0, progress);
            this.overlay.fillStyle(color, 1);
            this.overlay.fillRect(0, 0, width, height);
            this.overlay.fillStyle(0x000000, 0); // Clear circle
            this.overlay.beginPath();
            this.overlay.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.overlay.closePath();
            this.overlay.fillPath();
          }
        },
        onComplete: () => {
          this.isTransitioning = false;
          resolve();
        },
      });
    });
  }

  /**
   * Curtain effect (two vertical panels closing)
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Curtain color
   * @returns {Promise}
   */
  curtain(duration = 1000, color = 0x000000) {
    return new Promise((resolve) => {
      if (this.isTransitioning) {
        resolve();
        return;
      }

      this.isTransitioning = true;
      const { width, height } = this.scene.scale;

      this.overlay = this.scene.add.graphics();
      this.overlay.setDepth(10000);
      this.overlay.setScrollFactor(0);

      this.scene.tweens.add({
        targets: { progress: 0 },
        progress: 1,
        duration,
        ease: "Cubic.easeInOut",
        onUpdate: (tween) => {
          const progress = tween.getValue();
          this.overlay.clear();
          this.overlay.fillStyle(color, 1);

          const curtainWidth = Phaser.Math.Linear(0, width / 2, progress);

          // Left curtain
          this.overlay.fillRect(0, 0, curtainWidth, height);
          // Right curtain
          this.overlay.fillRect(width - curtainWidth, 0, curtainWidth, height);
        },
        onComplete: () => {
          this.isTransitioning = false;
          resolve();
        },
      });
    });
  }

  /**
   * Slide the entire screen out
   * @param {number} duration - Duration in milliseconds
   * @param {string} direction - 'left', 'right', 'up', 'down'
   * @returns {Promise}
   */
  slideOut(duration = 600, direction = "left") {
    return new Promise((resolve) => {
      logger.debug(`Slide out: ${direction}`);

      const { width, height } = this.scene.scale;
      const camera = this.scene.cameras.main;

      let targetX = camera.scrollX;
      let targetY = camera.scrollY;

      switch (direction) {
        case "left":
          targetX -= width;
          break;
        case "right":
          targetX += width;
          break;
        case "up":
          targetY -= height;
          break;
        case "down":
          targetY += height;
          break;
        default:
          break;
      }

      this.scene.tweens.add({
        targets: camera,
        scrollX: targetX,
        scrollY: targetY,
        duration,
        ease: "Power2",
        onComplete: () => resolve(),
      });
    });
  }

  /**
   * Complete transition from current scene to target scene
   * @param {string} targetScene - Name of the target scene
   * @param {object} data - Data to pass to the next scene
   * @param {string} transitionType - Type of transition
   * @param {number} duration - Duration in milliseconds
   * @param {number} color - Transition color
   * @returns {Promise}
   */
  async transitionTo(
    targetScene,
    data = {},
    transitionType = TransitionType.FADE,
    duration = 500,
    color = 0x000000,
  ) {
    logger.info(`Transitioning to ${targetScene} with ${transitionType}`);

    // Play transition sound if available
    if (this.audioManager) {
      this.audioManager.playUi("ui_select");
    }

    // Execute the transition
    switch (transitionType) {
      case TransitionType.FADE:
        await this.fadeOut(duration, color);
        break;
      case TransitionType.WIPE_HORIZONTAL:
        await this.wipeHorizontal(duration, color, "right");
        break;
      case TransitionType.WIPE_VERTICAL:
        await this.wipeVertical(duration, color, "down");
        break;
      case TransitionType.WIPE_RADIAL:
        await this.wipeRadial(duration, color, "expand");
        break;
      case TransitionType.CURTAIN:
        await this.curtain(duration, color);
        break;
      case TransitionType.FLASH:
        await this.flash(duration, color);
        break;
      case TransitionType.SLIDE_LEFT:
        await this.slideOut(duration, "left");
        break;
      case TransitionType.SLIDE_RIGHT:
        await this.slideOut(duration, "right");
        break;
      case TransitionType.SLIDE_UP:
        await this.slideOut(duration, "up");
        break;
      case TransitionType.SLIDE_DOWN:
        await this.slideOut(duration, "down");
        break;
      default:
        await this.fadeOut(duration, color);
        break;
    }

    // Start the new scene
    this.scene.scene.start(targetScene, data);

    // Clean up overlay if it exists
    this.cleanup();
  }

  /**
   * Clean up transition artifacts
   */
  cleanup() {
    if (this.overlay) {
      this.overlay.clear();
      this.overlay.destroy();
      this.overlay = null;
    }
    this.isTransitioning = false;
  }

  /**
   * Destroy the transition manager
   */
  destroy() {
    this.cleanup();
    this.scene = null;
    this.audioManager = null;
  }
}

/**
 * Helper function to add transition capability to a scene
 * Call this in your scene's create() method
 *
 * @param {Phaser.Scene} scene
 * @returns {SceneTransition}
 */
export function addTransitions(scene) {
  const s = scene;
  if (!s._transition) {
    s._transition = new SceneTransition(s);
  }
  return s._transition;
}

/**
 * Quick transition presets for common scene changes
 */
export const TransitionPresets = {
  // Menu to Character Select: Radial expand
  MENU_TO_SELECT: {
    type: TransitionType.WIPE_RADIAL,
    duration: 800,
    color: 0x000000,
  },

  // Character Select to Arena: Horizontal wipe
  SELECT_TO_ARENA: {
    type: TransitionType.WIPE_HORIZONTAL,
    duration: 600,
    color: 0x1a1a1a,
  },

  // Arena to Fight: Curtain effect
  ARENA_TO_FIGHT: {
    type: TransitionType.CURTAIN,
    duration: 1000,
    color: 0x000000,
  },

  // Fight to Victory: Flash then fade
  FIGHT_TO_VICTORY: {
    type: TransitionType.FLASH,
    duration: 300,
    color: 0xffffff,
  },

  // Back to menu: Simple fade
  BACK_TO_MENU: {
    type: TransitionType.FADE,
    duration: 400,
    color: 0x000000,
  },

  // Quick scene change: Fast fade
  QUICK: {
    type: TransitionType.FADE,
    duration: 250,
    color: 0x000000,
  },

  // Dramatic: Slow radial with red
  DRAMATIC: {
    type: TransitionType.WIPE_RADIAL,
    duration: 1500,
    color: 0x880000,
  },
};
