import ConfigManager from "../config/ConfigManager";
import UnifiedLogger from "../utils/Logger.js";
import { FighterState } from "../components/Fighter.js";

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
    this.currentAction = "IDLE"; // IDLE, APPROACH, RETREAT, ATTACK, BLOCK, SPACING
    this.actionQueue = []; // For multi-step sequences (combos)
    this.reactionTimer = 0;
    this.pendingReaction = null;
    this.reactionDelay = this.getReactionDelay();

    // AI Internal State - Personality & Confidence
    this.personality = ConfigManager.getCharacterPersonality(
      fighter.texture?.key || "ann",
    );
    this.confidence = 1.0;
    this.actionCommitmentTimer = 0;
    this.lastFighterState = fighter.currentState;

    // Load Profile
    this.loadProfile();

    logger.info(
      `AI initialized with difficulty: ${this.difficulty}, personality: ${this.personality}`,
    );
  }

  getReactionDelay() {
    const config = ConfigManager.getDifficultyConfig(this.difficulty);
    const range = config.reactionTime || { min: 400, max: 700 };

    // Adaptive Scaling
    let { min } = range;
    let { max } = range;

    if (this.difficulty === "nightmare") {
      // Nightmare "Cheating" logic: if losing badly, reduce reaction time further
      if (this.confidence < 0.3) {
        min *= 0.7;
        max *= 0.7;
      }
    } else {
      // Standard Adaptive: High confidence (AI winning) increases delay (mercy)
      // Low confidence (AI losing) decreases delay (desperation)
      const mercyFactor = 0.5 + this.confidence; // 0.5 to 1.5
      min *= mercyFactor;
      max *= mercyFactor;
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  loadProfile() {
    this.profile = ConfigManager.getDifficultyConfig(this.difficulty);
    // Decision frequency: also scaled by difficulty
    const intervals = {
      nightmare: 100,
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

    // Detect Wake-up
    if (
      this.lastFighterState === FighterState.CRUMPLE ||
      this.lastFighterState === FighterState.HIT
    ) {
      if (this.fighter.currentState === FighterState.IDLE) {
        this.decideWakeupOption();
      }
    }
    this.lastFighterState = this.fighter.currentState;

    this.actionTimer += delta;
    this.reactionTimer += delta;

    // 1. Handle Action Queue (High Priority)
    if (this.actionQueue.length > 0) {
      const current = this.actionQueue[0];
      this.currentAction = current.type;
      current.duration -= delta;

      if (current.duration <= 0) {
        this.actionQueue.shift();
        // If queue is now empty, reset currentAction to IDLE to prevent stuck state
        if (this.actionQueue.length === 0) {
          this.currentAction = "IDLE";
        }
      }
      this.executeAction();
      return;
    }

    // 2. Handle Action Commitment
    if (this.actionCommitmentTimer > 0) {
      this.actionCommitmentTimer -= delta;
      this.executeAction();
      return;
    }

    // 3. Reactive Monitoring (Every Frame)
    this.monitorOpponent(delta);

    // 4. Confidence Update (Every Frame)
    this.confidence = this.calculateConfidence();

    // 5. Decision Tick (Throttled but dynamic)
    if (this.actionTimer > this.moveInterval) {
      this.makeDecision();
      this.actionTimer = 0;
    }

    // Execution
    this.executeAction();
  }

  calculateConfidence() {
    // Max health is usually 100 but we get it from config if possible
    const maxHealth = 100;
    const healthRatio = this.fighter.health / maxHealth;
    const opponentHealthRatio = this.opponent.health / maxHealth;

    // Base confidence is health ratio vs opponent
    let confidence = (healthRatio + (1 - opponentHealthRatio)) / 2;

    // Desperation/Mercy logic from Spec
    if (
      this.difficulty !== "nightmare" &&
      healthRatio > 0.8 &&
      opponentHealthRatio < 0.3
    ) {
      // Mercy: AI is dominating, lower confidence to trigger "hesitation"
      confidence *= 0.7;
    } else if (
      this.difficulty === "nightmare" &&
      healthRatio < 0.3 &&
      opponentHealthRatio > 0.8
    ) {
      // Nightmare Desperation: AI is losing, trigger "focus" (higher confidence)
      // Note: In nightmare, higher confidence doesn't mean mercy, it means optimization
      confidence = 0.1; // Low confidence in nightmare triggers faster reactions in getReactionDelay
    }

    // Clamp 0-1
    return Math.max(0.01, Math.min(1, confidence));
  }

  decideWakeupOption() {
    logger.debug("Wake-up decision triggered!");
    const rand = Math.random();

    // Default weights
    let attackWeight = 0.3;
    let blockWeight = 0.4;

    if (this.difficulty === "nightmare") {
      attackWeight = 0.5;
      blockWeight = 0.4;
    } else if (this.difficulty === "easy") {
      attackWeight = 0.1;
      blockWeight = 0.2;
    }

    if (rand < attackWeight) {
      this.actionQueue = [{ type: "ATTACK", duration: 300 }];
    } else if (rand < attackWeight + blockWeight) {
      this.actionQueue = [{ type: "BLOCK", duration: 600 }];
    } else {
      this.actionQueue = [{ type: "JUMP_ESCAPE", duration: 600 }];
    }
  }

  getModifiedAggression() {
    let { aggression } = this.profile;

    // Personality Modifiers
    if (this.personality === "aggressive") aggression += 0.2;
    if (this.personality === "defensive") aggression -= 0.2;
    if (this.personality === "zoner") aggression -= 0.1;

    // Confidence Modifiers
    if (this.difficulty === "nightmare" && this.confidence < 0.3) {
      aggression += 0.2; // Nightmare gets more aggressive when losing
    } else {
      aggression *= 0.5 + this.confidence * 0.5; // At 0 confidence, aggression is halved
    }

    return Math.max(0.1, Math.min(0.99, aggression));
  }

  getModifiedBlockRate() {
    let { blockRate } = this.profile;

    if (this.personality === "defensive") blockRate += 0.2;
    if (this.personality === "aggressive") blockRate -= 0.1;

    // Low confidence increases blocking (fear)
    if (this.confidence < 0.4) blockRate += 0.2;

    // Mistake Injection: Reduce block rate based on mistake chance
    const mistakeChance = this.getModifiedMistakeChance();
    if (Math.random() < mistakeChance) {
      blockRate *= 0.5;
    }

    return Math.max(0.05, Math.min(1.0, blockRate));
  }

  getModifiedMistakeChance() {
    let { mistakeChance } = this.profile;

    // Adaptive: AI makes more mistakes when winning (mercy)
    if (this.difficulty !== "nightmare" && this.confidence > 0.8) {
      mistakeChance += 0.2;
    } else if (this.difficulty === "nightmare" && this.confidence < 0.3) {
      // Nightmare makes almost NO mistakes when losing
      mistakeChance = 0;
    }

    return Math.max(0, Math.min(0.5, mistakeChance));
  }

  monitorOpponent(delta) {
    const isOpponentAttacking = this.opponent.currentState === "attack";
    const distance = Math.abs(this.fighter.x - this.opponent.x);

    // Whiff Punish Logic
    if (isOpponentAttacking && distance > 140 && distance < 250) {
      // Opponent is swinging and missing
      if (
        Math.random() < this.getModifiedAggression() &&
        this.actionQueue.length === 0
      ) {
        logger.debug("Whiff punish triggered!");
        this.actionQueue = [
          { type: "APPROACH", duration: 200 },
          { type: "ATTACK", duration: 200 },
        ];
        return;
      }
    }

    // If opponent starts attacking and we aren't already reacting
    if (
      isOpponentAttacking &&
      !this.pendingReaction &&
      this.actionQueue.length === 0
    ) {
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

  planCombo() {
    const comboLength = this.difficulty === "nightmare" ? 4 : 3;
    this.actionQueue = [];
    for (let i = 0; i < comboLength; i += 1) {
      this.actionQueue.push({ type: "ATTACK", duration: 150 });
      this.actionQueue.push({ type: "IDLE", duration: 100 }); // Timing window
    }
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
    // Get actual attack range from config (default 80)
    const combatConfig = ConfigManager.getCombatConfig();
    const attackRange = combatConfig?.attackRange || 80;

    // Spacing should be just outside attack range + buffer
    const spacingRange = attackRange + 100;
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
    // Use a slightly larger range for AI decision to allow for movement during attack startup
    if (distance < attackRange + 10) {
      if (Math.random() < modifiedAggression) {
        // Decide between single hit and combo
        if (Math.random() < (this.profile.aggression || 0.5)) {
          this.planCombo();
        } else {
          this.currentAction = "ATTACK";
          this.actionCommitmentTimer = 200;
        }
      } else if (this.personality === "aggressive") {
        this.currentAction = "IDLE";
      } else {
        this.currentAction = Math.random() < 0.5 ? "RETREAT" : "IDLE";
        this.actionCommitmentTimer = 300;
      }
    } else if (distance < spacingRange) {
      // Aggression Override: If aggressive, ignore spacing and close in
      if (Math.random() < modifiedAggression) {
        this.currentAction = "APPROACH";
        this.actionCommitmentTimer = 200; // Short commit to check range soon
      } else {
        // Passive/Tactical: Maintain spacing
        this.currentAction = "SPACING";
        this.actionCommitmentTimer = 300;
      }
    } else if (distance < 400 && this.personality === "zoner") {
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
      case "SPACING":
        // Maintain spacing range (no random jitter)
        // If too close, retreat. If too far, approach.
        {
          const distance = Math.abs(this.fighter.x - this.opponent.x);
          const combatConfig = ConfigManager.getCombatConfig();
          const baseRange = combatConfig?.attackRange || 80;
          // Ideally sit at range + 60 (safe to whiff punish)
          const idealSpacing = baseRange + 60;

          if (distance < idealSpacing - 20) {
            this.cursorKeys[directionAway].isDown = true;
          } else if (distance > idealSpacing + 20) {
            this.cursorKeys[directionToOpponent].isDown = true;
          }
        }
        break;
      case "BLOCK":
        // Hold Back
        this.cursorKeys[directionAway].isDown = true;
        break;
      case "ATTACK":
        this.attackKey.isDown = true;
        // Ensure we face the opponent when attacking
        // But only if we aren't already locked in an attack (handled by Fighter state)
        // We press the direction key to force a turn if needed
        this.cursorKeys[directionToOpponent].isDown = true;

        // If it's a pulsed attack (not in queue), reset to IDLE after pulse
        if (this.actionQueue.length === 0) {
          this.currentAction = "IDLE";
        }
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
