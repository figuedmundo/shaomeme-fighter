import Phaser from "phaser";

export const FighterState = {
  IDLE: "idle",
  WALK: "walk",
  JUMP: "jump",
  CROUCH: "crouch",
  ATTACK: "attack",
  BLOCK: "block",
  HIT: "hit",
  DIE: "die",
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
    // Reduce hitbox width slightly
    this.body.setSize(60, 180);
    this.body.setOffset(20, 20);

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

    this.createAnimations(texture);
  }

  createAnimations(textureKey) {
    // Frame indices based on generate_placeholders.py
    // Idle (4), Walk (6), Jump (1), Crouch (1), Attack (3), Hit (1), Block (1), Die (1)
    // Total frames: 18 (0-17)

    const createAnim = (key, start, end, frameRate = 10, repeat = -1) => {
      this.scene.anims.create({
        key: `${textureKey}-${key}`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, {
          start,
          end,
        }),
        frameRate,
        repeat,
      });
    };

    // Indices based on the generator loop order
    // 0-3: Idle
    createAnim(FighterState.IDLE, 0, 3, 6);
    // 4-9: Walk
    createAnim(FighterState.WALK, 4, 9, 10);
    // 10: Jump
    createAnim(FighterState.JUMP, 10, 10, 1, 0);
    // 11: Crouch
    createAnim(FighterState.CROUCH, 11, 11, 1, 0);
    // 12-14: Attack
    createAnim(FighterState.ATTACK, 12, 14, 12, 0); // Fast attack
    // 15: Hit
    createAnim(FighterState.HIT, 15, 15, 1, 0);
    // 16: Block
    createAnim(FighterState.BLOCK, 16, 16, 1, 0);
    // 17: Die
    createAnim(FighterState.DIE, 17, 17, 1, 0);

    this.play(`${textureKey}-${FighterState.IDLE}`);
  }

  setControls(cursors, attackKeys, touchController = null) {
    this.cursors = cursors;
    this.keys = attackKeys;
    this.touchController = touchController;
  }

  setState(newState) {
    if (this.currentState === newState) return;

    // Logic to prevent breaking out of committed states
    if (
      this.currentState === FighterState.ATTACK &&
      this.anims.isPlaying &&
      newState !== FighterState.HIT
    ) {
      return;
    }

    this.currentState = newState;
    this.play(`${this.texture.key}-${newState}`, true);

    // Reset physics on certain state changes
    if (newState === FighterState.CROUCH || newState === FighterState.IDLE) {
      this.setVelocityX(0);
    }
  }

  update() {
    if (!this.cursors || this.health <= 0) return;

    // State Machine Logic
    if (this.isHit || this.currentState === FighterState.HIT) {
      // Hitstun logic would go here
      return;
    }

    if (
      this.currentState === FighterState.ATTACK &&
      this.anims.isPlaying &&
      this.anims.currentAnim.key.includes("attack")
    ) {
      // Lock movement during attack
      this.setVelocityX(0);
      // Check for animation completion
      this.on(
        "animationcomplete",
        () => {
          this.setState(FighterState.IDLE);
        },
        this
      );
      return;
    }

    const onGround = this.body.blocked.down;

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
