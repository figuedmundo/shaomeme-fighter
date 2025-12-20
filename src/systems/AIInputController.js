import ConfigManager from "../config/ConfigManager";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:AIInputController");

export default class AIInputController {
  constructor(scene, fighter, opponent, difficulty = "medium") {
    this.scene = scene;
    this.fighter = fighter;
    this.opponent = opponent;
    this.difficulty = difficulty;

    // Output State
    this.cursorKeys = {
      up: { isDown: false },
      down: { isDown: false },
      left: { isDown: false },
      right: { isDown: false },
    };
    this.attackKey = { isDown: false };

    // AI Internal State
    this.actionTimer = 0;
    this.currentAction = "IDLE"; // IDLE, APPROACH, RETREAT, ATTACK, BLOCK
    this.reactionTimer = 0;

    // Load Profile
    this.loadProfile();

    logger.info(`AI initialized with difficulty: ${difficulty}`);
  }

  loadProfile() {
    // Default profiles (fallback)
    const defaults = {
      easy: {
        aggression: 0.2,
        blockRate: 0.1,
        reactionTime: 1000,
        moveInterval: 1000,
      },
      medium: {
        aggression: 0.5,
        blockRate: 0.4,
        reactionTime: 500,
        moveInterval: 600,
      },
      hard: {
        aggression: 0.8,
        blockRate: 0.7,
        reactionTime: 200,
        moveInterval: 300,
      },
    };

    // Try to load from ConfigManager (gameData.json)
    // Assuming ConfigManager.data.difficulty exists (it was added in Task 1.2)
    const configData = ConfigManager.data?.difficulty || defaults;

    this.profile = configData[this.difficulty] || defaults.medium;
    this.moveInterval = this.profile.moveInterval || 500;
  }

  getCursorKeys() {
    return this.cursorKeys;
  }

  getAttackKey() {
    return this.attackKey;
  }

  update(time, delta) {
    if (this.fighter.health <= 0) {
      this.resetKeys();
      return;
    }

    this.actionTimer += delta;
    this.reactionTimer += delta;

    // Decision Tick
    if (this.actionTimer > this.moveInterval) {
      this.makeDecision();
      this.actionTimer = 0;
    }

    // Execution
    this.executeAction();
  }

  makeDecision() {
    const distance = Math.abs(this.fighter.x - this.opponent.x);
    const attackRange = 100; // Roughly

    // Reset transient actions (Attack is a pulse, Block is a state)
    this.attackKey.isDown = false;

    // 1. Defensive Check (Reaction)
    // If opponent is attacking and close, chance to Block
    // Note: In real game, we check opponent.isAttacking.
    // Simplified: Check if opponent state is ATTACK
    const opponentAttacking = this.opponent.currentState === "attack"; // String check

    if (
      opponentAttacking &&
      distance < 150 &&
      Math.random() < this.profile.blockRate
    ) {
      this.currentAction = "BLOCK";
      return;
    }

    // 2. Offensive Check
    if (distance < attackRange) {
      // Close enough to attack
      if (Math.random() < this.profile.aggression) {
        this.currentAction = "ATTACK";
      } else {
        // Hesitate or Retreat
        this.currentAction = Math.random() < 0.5 ? "RETREAT" : "IDLE";
      }
    } else {
      // Too far, approach
      this.currentAction = "APPROACH";
    }

    logger.verbose(
      `AI Decision: ${this.currentAction} (Dist: ${Math.round(distance)})`,
    );
  }

  executeAction() {
    this.resetKeys();

    const dx = this.opponent.x - this.fighter.x;
    const directionToOpponent = dx > 0 ? "right" : "left";
    const directionAway = dx > 0 ? "left" : "right";

    switch (this.currentAction) {
      case "APPROACH":
        this.cursorKeys[directionToOpponent].isDown = true;
        break;
      case "RETREAT":
        this.cursorKeys[directionAway].isDown = true;
        break;
      case "BLOCK":
        // Hold Back
        this.cursorKeys[directionAway].isDown = true;
        break;
      case "ATTACK":
        this.attackKey.isDown = true;
        // Stop moving when attacking (though Fighter.js handles this)
        this.currentAction = "IDLE"; // Pulse attack once
        break;
      case "IDLE":
      default:
        // Do nothing
        break;
    }
  }

  resetKeys() {
    this.cursorKeys.up.isDown = false;
    this.cursorKeys.down.isDown = false;
    this.cursorKeys.left.isDown = false;
    this.cursorKeys.right.isDown = false;
    this.attackKey.isDown = false;
  }
}
