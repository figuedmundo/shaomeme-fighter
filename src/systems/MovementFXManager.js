import ShadowSystem from "./ShadowSystem";
import DustSystem from "./DustSystem";
import AnimationEnhancer from "./AnimationEnhancer";
import AfterimageSystem from "./AfterimageSystem";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:MovementFXManager");

/**
 * MovementFXManager - Coordinator for all movement-related visual effects
 * Implements Phase 1, Task 1.2 of the roadmap
 */
export default class MovementFXManager {
  constructor(scene) {
    this.scene = scene;

    // Initialize subsystems
    this.shadowSystem = new ShadowSystem(scene);
    this.dustSystem = new DustSystem(scene);
    this.animationEnhancer = new AnimationEnhancer(scene);
    this.afterimageSystem = new AfterimageSystem(scene);

    logger.info("MovementFXManager initialized");
  }

  /**
   * Register a fighter to have shadows and effects
   * @param {Fighter} fighter
   */
  addFighter(fighter) {
    this.shadowSystem.addFighter(fighter);
  }

  /**
   * Update loop - must be called by Scene update
   */
  update() {
    this.shadowSystem.update();
  }

  /**
   * Trigger landing effects
   * @param {Fighter} fighter
   */
  onLand(fighter) {
    this.dustSystem.triggerLand(fighter.x, fighter.y);
    // Squash: Scale Y down (0.9), Scale X up (1.1)
    this.animationEnhancer.squashAndStretch(fighter, 1.1, 0.9, 100);
  }

  /**
   * Trigger jump takeoff effects
   * @param {Fighter} fighter
   */
  onJump(fighter) {
    // Stretch: Scale Y up (1.05), Scale X down (0.95)
    this.animationEnhancer.squashAndStretch(fighter, 0.95, 1.05, 100);
  }

  /**
   * Trigger dash effects
   * @param {Fighter} fighter
   * @param {string} direction 'left' or 'right'
   */
  onDash(fighter, direction) {
    this.dustSystem.triggerDash(fighter.x, fighter.y, direction);
    this.afterimageSystem.spawnAfterimage(fighter, 300, 0.5, 0x0088ff); // Blue tint for dash
  }

  /**
   * Trigger heavy step or turn effects
   * @param {Fighter} fighter
   */
  onStep(fighter) {
    this.dustSystem.triggerTurn(fighter.x, fighter.y);
  }

  destroy() {
    this.shadowSystem.destroy();
    this.dustSystem.destroy();
    this.animationEnhancer.destroy();
    this.afterimageSystem.destroy();
  }
}
