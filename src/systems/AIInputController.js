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
    this.pendingReaction = null;
    this.reactionDelay = this.getReactionDelay();

    // AI Internal State - Personality & Confidence
    this.personality = ConfigManager.getCharacterPersonality(
      fighter.texture?.key || "ann",
    );
    this.confidence = 1.0;
    this.actionCommitmentTimer = 0;

    // Load Profile
    this.loadProfile();

    logger.info(
      `AI initialized with difficulty: ${this.difficulty}, personality: ${this.personality}`,
    );
  }

  getReactionDelay() {
    const config = ConfigManager.getDifficultyConfig(this.difficulty);
    const range = config.reactionTime || { min: 400, max: 700 };
    return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
  }

  loadProfile() {
    this.profile = ConfigManager.getDifficultyConfig(this.difficulty);
    // Decision frequency: also scaled by difficulty
    const intervals = {
      hard: 200,
      medium: 400,
    };
    this.moveInterval = intervals[this.difficulty] || 800;
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

    // Handle Action Commitment
    if (this.actionCommitmentTimer > 0) {
      this.actionCommitmentTimer -= delta;
      this.executeAction();
      return;
    }

    // 1. Reactive Monitoring (Every Frame)
    this.monitorOpponent(delta);

    // 2. Confidence Update (Every Frame)
    this.confidence = this.calculateConfidence();

    // 3. Decision Tick (Throttled but dynamic)
    if (this.actionTimer > this.moveInterval) {
      this.makeDecision();
      this.actionTimer = 0;
    }

    // Execution
    this.executeAction();
  }

  calculateConfidence() {
    const healthRatio = this.fighter.health / 100;
    const opponentHealthRatio = this.opponent.health / 100;

    // Base confidence is health ratio vs opponent
    const confidence = (healthRatio + (1 - opponentHealthRatio)) / 2;

    // Clamp 0-1
    return Math.max(0, Math.min(1, confidence));
  }

  getModifiedAggression() {
    let { aggression } = this.profile;

    // Personality Modifiers
    if (this.personality === "aggressive") aggression += 0.2;
    if (this.personality === "defensive") aggression -= 0.2;
    if (this.personality === "zoner") aggression -= 0.1;

    // Confidence Modifiers
    aggression *= 0.5 + this.confidence * 0.5; // At 0 confidence, aggression is halved

    return Math.max(0.1, Math.min(0.99, aggression));
  }

  getModifiedBlockRate() {
    let { blockRate } = this.profile;

    if (this.personality === "defensive") blockRate += 0.2;
    if (this.personality === "aggressive") blockRate -= 0.1;

    // Low confidence increases blocking (fear)
    if (this.confidence < 0.4) blockRate += 0.2;

    // Mistake Injection: Reduce block rate based on mistake chance
    if (Math.random() < (this.profile.mistakeChance || 0)) {
      blockRate *= 0.5;
    }

    return Math.max(0.05, Math.min(1.0, blockRate));
  }

  monitorOpponent(delta) {
    const isOpponentAttacking = this.opponent.currentState === "attack";

    // If opponent starts attacking and we aren't already reacting
    if (isOpponentAttacking && !this.pendingReaction) {
      this.pendingReaction = {
        type: "BLOCK",
        startTime: 0,
        triggerTime: this.reactionDelay,
      };
    }

    // Process pending reaction
    if (this.pendingReaction) {
      this.pendingReaction.startTime += delta;
      if (this.pendingReaction.startTime >= this.pendingReaction.triggerTime) {
        if (Math.random() < this.getModifiedBlockRate()) {
          this.currentAction = this.pendingReaction.type;
          this.actionCommitmentTimer = 400; // Commit to block for a bit
        }
        this.pendingReaction = null;
        this.reactionDelay = this.getReactionDelay(); // Re-roll for next time
      }
    }

    // Clear reaction if opponent stops attacking
    if (!isOpponentAttacking && this.pendingReaction?.type === "BLOCK") {
      this.pendingReaction = null;
    }
  }

  isOpponentJumping() {
    return (
      this.opponent.currentState === "jump" ||
      this.opponent.currentState === "fall"
    );
  }

  makeDecision() {
    // If we are currently executing a reaction (like BLOCK), don't override immediately
    // unless it's been a while.
    if (
      this.currentAction === "BLOCK" &&
      this.opponent.currentState === "attack"
    ) {
      return;
    }

    const distance = Math.abs(this.fighter.x - this.opponent.x);
    const attackRange = 140;
    const spacingRange = 250;
    const isInCorner = this.fighter.x < 100 || this.fighter.x > 700; // Screen bounds approx

    // Reset attack pulse
    this.attackKey.isDown = false;

    const modifiedAggression = this.getModifiedAggression();

    // 1. Anti-Corner Logic
    if (isInCorner && distance < 200 && Math.random() < 0.3) {
      this.currentAction = "JUMP_ESCAPE";
      this.actionCommitmentTimer = 600;
      return;
    }

    // 2. Offensive Logic
    if (distance < attackRange) {
      if (Math.random() < modifiedAggression) {
        this.currentAction = "ATTACK";
        this.actionCommitmentTimer = 200; // Small commitment to the swing
      } else if (this.personality === "aggressive") {
        this.currentAction = "IDLE";
      } else {
        this.currentAction = Math.random() < 0.5 ? "RETREAT" : "IDLE";
        this.actionCommitmentTimer = 300;
      }
    } else if (distance < spacingRange && this.personality === "zoner") {
      // Zoners try to maintain spacing
      this.currentAction = "RETREAT";
      this.actionCommitmentTimer = 400;
    } else if (Math.random() < 0.05) {
      // Occasional jump approach
      this.currentAction = "JUMP_APPROACH";
      this.actionCommitmentTimer = 600;
    } else if (Math.random() < modifiedAggression + 0.3) {
      this.currentAction = "APPROACH";
    } else {
      this.currentAction = "IDLE";
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
      case "JUMP_APPROACH":
        this.cursorKeys[directionToOpponent].isDown = true;
        this.cursorKeys.up.isDown = true;
        break;
      case "JUMP_ESCAPE":
        this.cursorKeys[directionToOpponent].isDown = true; // Jump over opponent
        this.cursorKeys.up.isDown = true;
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
