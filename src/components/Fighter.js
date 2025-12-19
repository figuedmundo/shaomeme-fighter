import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:Fighter");

export const FighterState = {
  IDLE: "idle",
  WALK: "walk",
  JUMP: "jump",
  CROUCH: "crouch",
  ATTACK: "attack",
  BLOCK: "block",
  HIT: "hit",
  DIE: "die",
  INTRO: "intro",
  VICTORY: "victory",
  CRUMPLE: "crumple",
};

export default class Fighter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.config = config || {};

    // Physics setup
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1); // Anchor at bottom center (feet)
    this.setScale(0.5); // High resolution (200x400) scaled to standard size (100x200)
    this.baseScale = 0.5;
    // Reduce hitbox width slightly (Scaled for 200x400 unscaled, will be 60x180 at 0.5 scale)
    this.body.setSize(120, 360);
    this.body.setOffset(40, 40);

    // Properties
    this.velocity = 160;
    this.jumpPower = -600;
    this.health = 100;
    this.currentState = FighterState.IDLE;
    this.isAttacking = false;
    this.isHit = false;

    // Controls
    this.cursors = null;
    this.keys = null;
    this.inputEnabled = true;

    this.createAnimations(texture);
    this.logger = logger.child(texture);

    // FX Integration
    this.fxManager = null;
    this.wasOnGround = false;

    // Audio Integration
    this.audioManager = null;
  }

  setFXManager(manager) {
    this.fxManager = manager;
    if (this.fxManager) {
      this.fxManager.addFighter(this);
    }
  }

  setAudioManager(manager) {
    this.audioManager = manager;
  }

  createAnimations(textureKey) {
    logger.debug(`Creating animations for ${textureKey}...`);
    // Frame indices based on generate_placeholders.py (32 frames total)
    // Idle (6), Walk (6), Jump (1), Crouch (1), Attack (3), Hit (1), Block (1), Intro (4), Victory (4), Crumple (2), Die (3)

    const createAnim = (key, start, end, frameRate = 10, repeat = -1) => {
      const animKey = `${textureKey}-${key}`;
      if (this.scene.anims.exists(animKey)) return;

      const frames = this.scene.anims.generateFrameNumbers(textureKey, {
        start,
        end,
      });

      if (!frames || frames.length === 0) {
        logger.warn(`No frames found for animation ${animKey}. Skipping.`);
        return;
      }

      this.scene.anims.create({
        key: animKey,
        frames,
        frameRate,
        repeat,
      });
    };

    // Indices based on the generator loop order
    // 0-5: Idle (6 frames)
    createAnim(FighterState.IDLE, 0, 5, 8);
    // 6-11: Walk (6 frames)
    createAnim(FighterState.WALK, 6, 11, 10);
    // 12: Jump
    createAnim(FighterState.JUMP, 12, 12, 1, 0);
    // 13: Crouch
    createAnim(FighterState.CROUCH, 13, 13, 1, 0);
    // 14-16: Attack (3 frames)
    createAnim(FighterState.ATTACK, 14, 16, 12, 0);
    // 17: Hit
    createAnim(FighterState.HIT, 17, 17, 1, 0);
    // 18: Block
    createAnim(FighterState.BLOCK, 18, 18, 1, 0);
    // 19-22: Intro (4 frames)
    createAnim(FighterState.INTRO, 19, 22, 10, 0);
    // 23-26: Victory (4 frames)
    createAnim(FighterState.VICTORY, 23, 26, 10, -1); // Looping victory
    // 27-28: Crumple (2 frames)
    createAnim(FighterState.CRUMPLE, 27, 28, 8, 0);
    // 29-31: Die (3 frames)
    createAnim(FighterState.DIE, 29, 31, 8, 0);

    this.play(`${textureKey}-${FighterState.IDLE}`);
  }

  setControls(cursors, attackKeys, touchController = null) {
    this.cursors = cursors;
    this.keys = attackKeys;
    this.touchController = touchController;
  }

  setInputEnabled(enabled) {
    this.inputEnabled = enabled;
    if (!enabled) {
      this.setVelocityX(0); // Stop moving if input disabled
      if (
        this.currentState === FighterState.WALK ||
        this.currentState === FighterState.CROUCH
      ) {
        this.setState(FighterState.IDLE);
      }
    }
  }

  setState(newState) {
    if (this.currentState === newState) return;

    // Logic to prevent breaking out of committed states
    // Allow HIT and DIE to interrupt ATTACK, INTRO, etc.
    const committedStates = [
      FighterState.ATTACK,
      FighterState.INTRO,
      FighterState.VICTORY,
      FighterState.CRUMPLE,
    ];

    if (
      committedStates.includes(this.currentState) &&
      this.anims.isPlaying &&
      newState !== FighterState.HIT &&
      newState !== FighterState.DIE
    ) {
      return;
    }

    this.currentState = newState;
    this.play(`${this.texture.key}-${newState}`, true);
    this.logger.debug(`State changed to: ${newState}`);

    // State completion listeners
    if (newState === FighterState.INTRO) {
      this.once("animationcomplete", () => {
        if (this.currentState === FighterState.INTRO) {
          this.setState(FighterState.IDLE);
        }
      });
    }

    if (newState === FighterState.CRUMPLE) {
      this.once("animationcomplete", () => {
        if (this.currentState === FighterState.CRUMPLE) {
          this.setState(FighterState.DIE);
        }
      });
    }

    // FX Hooks
    if (this.fxManager) {
      if (newState === FighterState.JUMP) {
        this.fxManager.onJump(this);
      }
      // Future: Add Dash hook here if Dash state is added
    }

    // If attacking, set up completion listener once
    if (newState === FighterState.ATTACK) {
      // Play whoosh sound on attack start
      if (this.audioManager) {
        this.audioManager.playWhoosh();
      }

      // Play grunt sound when attacking (TODO: add actual grunt sounds)
      // if (this.audioManager) {
      //   this.audioManager.playGrunt();
      // }

      this.once("animationcomplete", () => {
        if (this.currentState === FighterState.ATTACK) {
          this.setState(FighterState.IDLE);
        }
      });
    }

    // Reset physics on certain state changes
    if (
      newState === FighterState.CROUCH ||
      newState === FighterState.IDLE ||
      newState === FighterState.DIE
    ) {
      this.setVelocityX(0);
    }
  }

  takeDamage(amount) {
    if (this.health <= 0) return;

    this.health -= amount;
    this.logger.info(`Took ${amount} damage. Health: ${this.health}`);

    // PHASE 3.2: Update UI Manager health display
    if (this.scene.uiManager) {
      const playerNum = this === this.scene.player1 ? 1 : 2;
      this.scene.uiManager.updateHealth(playerNum, this.health);
    }

    if (this.health <= 0) {
      this.health = 0;
      this.setState(FighterState.CRUMPLE);
    } else {
      this.setState(FighterState.HIT);
      this.isHit = true;
      // Note: Flash effect is now handled by HitFeedbackSystem

      // Simple Hitstun
      this.scene.time.delayedCall(300, () => {
        if (this.health > 0) {
          // Only recover if still alive
          this.isHit = false;
          this.setState(FighterState.IDLE);
        }
      });
    }
  }

  update() {
    // If dead, ensure we stay dead and don't process inputs
    if (this.health <= 0) {
      if (this.currentState !== FighterState.DIE) {
        this.setState(FighterState.DIE);
      }
      return;
    }

    if (!this.cursors) return;
    if (!this.inputEnabled) return;

    // State Machine Logic
    if (
      this.isHit ||
      this.currentState === FighterState.HIT ||
      this.currentState === FighterState.INTRO ||
      this.currentState === FighterState.VICTORY ||
      this.currentState === FighterState.CRUMPLE
    ) {
      // Input-locked states
      if (this.currentState !== FighterState.INTRO) {
        this.setVelocityX(0);
      }
      return;
    }

    if (
      this.currentState === FighterState.ATTACK &&
      this.anims.isPlaying &&
      this.anims.currentAnim.key.includes("attack")
    ) {
      // Lock movement during attack
      this.setVelocityX(0);
      return;
    }

    const onGround = this.body.blocked.down;

    // FX Hooks: Landing Detection
    if (onGround && !this.wasOnGround && this.fxManager) {
      this.fxManager.onLand(this);
    }
    this.wasOnGround = onGround;

    // Input Merging (Keyboard + Touch)
    const touchCursors = this.touchController
      ? this.touchController.getCursorKeys()
      : {
          left: { isDown: false },
          right: { isDown: false },
          up: { isDown: false },
          down: { isDown: false },
        };
    const touchAttack = this.touchController
      ? this.touchController.getAttackKey()
      : { isDown: false };

    const left = this.cursors.left.isDown || touchCursors.left.isDown;
    const right = this.cursors.right.isDown || touchCursors.right.isDown;
    const up = this.cursors.up.isDown || touchCursors.up.isDown;
    const down = this.cursors.down.isDown || touchCursors.down.isDown;
    const attack =
      this.scene.input.keyboard.checkDown(this.keys.attack, 250) ||
      touchAttack.isDown;

    // Ground Movement
    if (onGround) {
      if (down) {
        this.setState(FighterState.CROUCH);
      } else if (attack) {
        this.setState(FighterState.ATTACK);
      } else if (left) {
        this.setVelocityX(-this.velocity);
        this.setFlipX(true);
        this.setState(FighterState.WALK);
      } else if (right) {
        this.setVelocityX(this.velocity);
        this.setFlipX(false);
        this.setState(FighterState.WALK);
      } else if (up) {
        this.setVelocityY(this.jumpPower);
        this.setState(FighterState.JUMP);
      } else {
        this.setState(FighterState.IDLE);
      }
    } else {
      // Air Control (Limited)
      this.setState(FighterState.JUMP);
      if (left) {
        this.setVelocityX(-this.velocity * 0.8);
      } else if (right) {
        this.setVelocityX(this.velocity * 0.8);
      }
    }
  }
}
