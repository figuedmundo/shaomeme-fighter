import Phaser from "phaser";
import Fighter, { FighterState } from "../components/Fighter";
import TouchInputController from "../systems/TouchInputController";
import TouchVisuals from "../components/TouchVisuals";
import VictorySlideshow from "../components/VictorySlideshow";
import HitFeedbackSystem from "../systems/HitFeedbackSystem";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:FightScene");

export default class FightScene extends Phaser.Scene {
  constructor() {
    super("FightScene");
    this.backgroundUrl = null;
    this.backgroundKey = null;
    this.city = "Unknown";
    this.playerCharacter = null;
    this.isGameOver = false;
  }

  init(data) {
    if (data) {
      this.city = data.city || "Unknown";
      this.backgroundUrl = data.backgroundUrl;
      this.backgroundKey = data.backgroundKey;
      this.playerCharacter = data.playerCharacter;
      logger.info(
        `Fight initialized with character: ${this.playerCharacter} in city: ${this.city}`,
      );
    }
  }

  preload() {
    logger.debug("FightScene: Preload started");
    // If a specific background was passed and it's not already in cache (or we want to ensure it's loaded)
    // We can try to load it. If it was preloaded in ArenaSelectScene, we might just reuse the key.

    // Check if the key exists in texture manager
    if (this.backgroundKey && this.textures.exists(this.backgroundKey)) {
      // It's already loaded, no action needed
      logger.debug(`Using cached background: ${this.backgroundKey}`);
    } else if (this.backgroundUrl) {
      // Dynamic load needed (e.g. direct deep link or reload)
      this.backgroundKey = `dynamic_bg_${Date.now()}`;
      logger.debug(`Dynamic load needed for background: ${this.backgroundUrl}`);
      this.load.image(this.backgroundKey, this.backgroundUrl);
    } else {
      // Fallback
      this.backgroundKey = "default_bg";
      logger.debug("Using default background fallback");
      // Ensure default is loaded if not already (assuming PreloadScene usually does this)
      // Since PreloadScene isn't fully robust yet, let's just use the placeholder or check cache
      if (!this.textures.exists("default_bg")) {
        // Assuming 'resources/main-bg.jpg' is available from public/resources or similar
        // But let's check what PreloadScene does. For now, strict fallback logic:
        this.load.image("default_bg", "resources/main-bg.jpg");
      }
    }
  }

  create() {
    logger.info("FightScene: Starting create...");
    const { width, height } = this.scale;
    this.isGameOver = false;

    // 0. Background
    const bgKey = this.textures.exists(this.backgroundKey)
      ? this.backgroundKey
      : "default_bg";
    this.add.image(width / 2, height / 2, bgKey).setDisplaySize(width, height);
    logger.debug(`FightScene: Background set to ${bgKey}`);

    // 1. Setup Scene Geometry (Floor)
    const floorHeight = 50;
    this.floor = this.physics.add.staticGroup();
    const floorRect = this.add.rectangle(
      width / 2,
      height - floorHeight / 2,
      width,
      floorHeight,
      0x000000,
      0,
    );
    this.physics.add.existing(floorRect, true);
    this.floor.add(floorRect);
    logger.debug("FightScene: Floor created");

    // World Bounds
    this.physics.world.setBounds(0, 0, width, height);

    // 2. Instantiate Fighters
    const p1Texture = this.playerCharacter || "ryu";
    const p2Texture = p1Texture === "ken" ? "ryu" : "ken";

    logger.debug(
      `FightScene: Creating fighters P1:${p1Texture}, P2:${p2Texture}`,
    );
    this.player1 = new Fighter(this, 200, height - 100, p1Texture);
    this.player2 = new Fighter(this, width - 200, height - 100, p2Texture);
    this.player2.setFlipX(true);
    logger.debug("FightScene: Fighters created");

    // 3. Collisions
    this.physics.add.collider(this.player1, this.floor);
    this.physics.add.collider(this.player2, this.floor);
    this.physics.add.collider(this.player1, this.player2);
    logger.debug("FightScene: Colliders added");

    // 4. Controls
    this.touchController = new TouchInputController(this);
    this.touchVisuals = new TouchVisuals(this);
    logger.debug("FightScene: Touch controls initialized");

    const p1Cursors = this.input.keyboard.createCursorKeys();
    const p1Keys = {
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
    this.player1.setControls(p1Cursors, p1Keys, this.touchController);

    const p2Cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    const p2Keys = {
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
    };
    this.player2.setControls(p2Cursors, p2Keys);
    logger.debug("FightScene: All controls set");

    // 5. Hit Feedback System
    this.hitFeedback = new HitFeedbackSystem(this);
    logger.debug("FightScene: Hit feedback system initialized");

    // 6. Victory System
    this.slideshow = new VictorySlideshow(this);
    logger.info("FightScene: create() complete");
  }

  update() {
    this.player1.update();
    this.player2.update();

    if (!this.isGameOver) {
      // Hitbox Detection
      this.checkAttack(this.player1, this.player2);
      this.checkAttack(this.player2, this.player1);

      // Win Condition
      this.checkWinCondition();
    }
  }

  checkAttack(attacker, defender) {
    if (
      attacker.currentState === FighterState.ATTACK &&
      attacker.anims.isPlaying &&
      attacker.anims.currentFrame &&
      attacker.anims.currentFrame.index === 2
    ) {
      // Define Attack Box (Simple overlap check for now)
      // In a real app, this would be a separate physics body spawned for 1 frame
      const attackRange = 80;
      const distance = Phaser.Math.Distance.Between(
        attacker.x,
        attacker.y,
        defender.x,
        defender.y,
      );

      // Simple directional check
      const facingTarget = attacker.flipX
        ? attacker.x > defender.x
        : attacker.x < defender.x;

      if (
        distance < attackRange &&
        facingTarget &&
        !defender.isHit &&
        defender.health > 0
      ) {
        // Hit Confirmed
        logger.info(`${attacker.texture.key} hit ${defender.texture.key}!`);

        // Determine if heavy hit (can add combo logic later)
        const isHeavyHit = false; // TODO: Implement heavy hit detection

        // Trigger all hit feedback effects
        this.hitFeedback.triggerHitFeedback(attacker, defender, 10, isHeavyHit);

        // Apply hit state to defender
        defender.takeDamage(10);
      } else {
        logger.verbose(
          `Attack check: dist=${Math.round(distance)}, range=${attackRange}, facing=${facingTarget}`,
        );
      }
    }
  }

  checkWinCondition() {
    if (this.player1.health <= 0 || this.player2.health <= 0) {
      this.isGameOver = true;
      this.physics.pause();

      // Disable inputs
      this.player1.setControls(null, null, null);
      // this.player2.setControls(null, null); // If p2 was controllable

      // Determine winner (Opposite of who died)
      const winner = this.player1.health > 0 ? this.player1 : this.player2;

      // Play Victory Animation for winner? (Optional, if we had one)
      // winner.setState(FighterState.VICTORY);

      // Wait for Death Animation to finish roughly (2 seconds)
      this.time.delayedCall(2000, () => {
        this.slideshow.show(this.city);
      });
    }
  }

  shutdown() {
    logger.info("FightScene: Shutting down...");
    if (this.hitFeedback) {
      this.hitFeedback.destroy();
    }
  }
}
