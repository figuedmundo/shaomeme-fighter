import Phaser from "phaser";
import Fighter, { FighterState } from "../components/Fighter";
import TouchInputController from "../systems/TouchInputController";
import TouchVisuals from "../components/TouchVisuals";
import VictorySlideshow from "../components/VictorySlideshow";
import HitFeedbackSystem from "../systems/HitFeedbackSystem";
import MovementFXManager from "../systems/MovementFXManager";
import CriticalMomentsManager from "../systems/CriticalMomentsManager";
import AnnouncerOverlay from "../components/AnnouncerOverlay";
import ComboOverlay from "../components/ComboOverlay";
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
    if (this.backgroundKey && this.textures.exists(this.backgroundKey)) {
      logger.debug(`Using cached background: ${this.backgroundKey}`);
    } else if (this.backgroundUrl) {
      this.backgroundKey = `dynamic_bg_${Date.now()}`;
      logger.debug(`Dynamic load needed for background: ${this.backgroundUrl}`);
      this.load.image(this.backgroundKey, this.backgroundUrl);
    } else {
      this.backgroundKey = "default_bg";
      logger.debug("Using default background fallback");
      if (!this.textures.exists("default_bg")) {
        this.load.image("default_bg", "resources/main-bg.jpg");
      }
    }
  }

  create() {
    logger.info("FightScene: Starting create...");
    const { width, height } = this.scale;
    this.isGameOver = false;

    // Get AudioManager from registry
    this.audioManager = this.registry.get("audioManager");
    if (this.audioManager) {
      this.audioManager.playStageMusic(this.city);
      logger.debug(`FightScene: Started stage music for ${this.city}`);
    } else {
      logger.warn("AudioManager not found in registry");
    }

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

    // 6. Movement FX System
    this.movementFX = new MovementFXManager(this);
    this.player1.setFXManager(this.movementFX);
    this.player2.setFXManager(this.movementFX);
    logger.debug("FightScene: Movement FX system initialized");

    // 6b. Connect AudioManager to fighters
    if (this.audioManager) {
      this.player1.setAudioManager(this.audioManager);
      this.player2.setAudioManager(this.audioManager);
      logger.debug("FightScene: AudioManager connected to fighters");
    }

    // 7. Critical Moments Manager
    this.criticalMoments = new CriticalMomentsManager(this);
    this.criticalMoments.playRoundStartZoom();
    logger.debug("FightScene: Critical Moments system initialized");

    // 8. Announcer System (Overlays)
    this.announcerOverlay = new AnnouncerOverlay(this);
    this.comboOverlay = new ComboOverlay(this);

    // Audio Dynamic State
    this.musicRateSet = false;

    // Combo State
    this.comboCounter = 0;
    this.lastHitTime = 0;
    this.inputEnabled = false; // Block input during round start

    // 9. Victory System
    this.slideshow = new VictorySlideshow(this);

    // Start Round Sequence
    this.startRoundSequence();

    logger.info("FightScene: create() complete");
  }

  startRoundSequence() {
    this.inputEnabled = false;

    // Disable controls initially
    if (this.player1) this.player1.setInputEnabled(false);
    if (this.player2) this.player2.setInputEnabled(false);

    // "ROUND 1"
    this.time.delayedCall(500, () => {
      this.announcerOverlay.showRound(1);
      if (this.audioManager) this.audioManager.playAnnouncer("round_1");
    });

    // "FIGHT!"
    this.time.delayedCall(2000, () => {
      this.announcerOverlay.showFight();
      if (this.audioManager) this.audioManager.playAnnouncer("fight");

      this.inputEnabled = true;
      if (this.player1) this.player1.setInputEnabled(true);
      if (this.player2) this.player2.setInputEnabled(true);
    });
  }

  update() {
    this.player1.update();
    this.player2.update();

    // Update visual effects
    if (this.movementFX) {
      this.movementFX.update();
    }

    if (this.criticalMoments && !this.isGameOver) {
      const lowestHP = Math.min(this.player1.health, this.player2.health);
      this.criticalMoments.updateHealthPulse(lowestHP);

      // Dynamic Music Rate
      if (lowestHP <= 20 && !this.musicRateSet) {
        if (this.audioManager) this.audioManager.setMusicRate(1.15); // 15% faster
        this.musicRateSet = true;
      }
    }

    if (!this.isGameOver) {
      // Hitbox Detection
      this.checkAttack(this.player1, this.player2);
      this.checkAttack(this.player2, this.player1);

      // Win Condition
      this.checkWinCondition();
    }
  }

  processComboHit() {
    const now = Date.now();
    // Reset combo if too much time passed (2 seconds)
    if (now - this.lastHitTime > 2000) {
      this.comboCounter = 0;
    }

    this.comboCounter += 1;
    this.lastHitTime = now;

    if (this.comboOverlay) {
      this.comboOverlay.updateCombo(this.comboCounter);
    }

    // Announcer Milestones
    if (this.audioManager) {
      if (this.comboCounter === 3) this.audioManager.playAnnouncer("combo_3");
      else if (this.comboCounter === 5)
        this.audioManager.playAnnouncer("combo_5");
      else if (this.comboCounter >= 7 && this.comboCounter % 5 === 2)
        this.audioManager.playAnnouncer("combo_ultra"); // 7, 12, etc roughly
    }
  }

  checkAttack(attacker, defender) {
    if (
      attacker.currentState === FighterState.ATTACK &&
      attacker.anims.isPlaying &&
      attacker.anims.currentFrame &&
      attacker.anims.currentFrame.index === 2
    ) {
      const attackRange = 80;
      const distance = Phaser.Math.Distance.Between(
        attacker.x,
        attacker.y,
        defender.x,
        defender.y,
      );

      const facingTarget = attacker.flipX
        ? attacker.x > defender.x
        : attacker.x < defender.x;

      if (
        distance < attackRange &&
        facingTarget &&
        !defender.isHit &&
        defender.health > 0
      ) {
        logger.info(`${attacker.texture.key} hit ${defender.texture.key}!`);

        const damage = 10;
        const isLethal = defender.health - damage <= 0;
        const isHeavyHit = false; // TODO: Implement heavy hit detection

        // Combo Update
        this.processComboHit();

        // Trigger hit feedback
        this.hitFeedback.triggerHitFeedback(
          attacker,
          defender,
          damage,
          isHeavyHit,
          isLethal,
        );

        // Play impact sound
        if (this.audioManager) {
          this.audioManager.playImpact(isHeavyHit);
        }

        // Play hit reaction sound for defender
        if (this.audioManager && !isLethal) {
          this.audioManager.playHitReaction();
        }

        if (isLethal) {
          // Trigger slow motion after the hit stop (500ms)
          // HitFeedbackSystem handles the freeze. CriticalMoments handles slow mo.
          // We queue the slow motion to start exactly when the freeze ends.
          this.time.delayedCall(500, () => {
            this.criticalMoments.triggerSlowMotion();
          });
        }

        defender.takeDamage(damage);
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

      this.player1.setControls(null, null, null);

      // Announcer KO
      if (this.announcerOverlay) {
        this.announcerOverlay.showKO();
      }

      // Play KO sound
      if (this.audioManager) {
        this.audioManager.playKO();
        this.audioManager.stopMusic(2000); // 2 second fade out
      }

      // Stop health pulse
      if (this.criticalMoments && this.criticalMoments.vignette) {
        this.criticalMoments.vignette.setVisible(false);
      }

      let winner = null;
      if (this.player1.health > 0) {
        winner = this.player1;
      } else if (this.player2.health > 0) {
        winner = this.player2;
      }

      let winnerName = "Draw";
      if (winner) {
        winnerName = winner.texture.key === "ryu" ? "Ryu" : "Ken"; // Simplification, should use config name
      }

      this.time.delayedCall(2000, () => {
        if (this.announcerOverlay) {
          this.announcerOverlay.showWin(winnerName);
        }
        if (this.audioManager) {
          this.audioManager.playAnnouncer("you_win"); // Or 'perfect' check
        }

        this.time.delayedCall(2000, () => {
          this.slideshow.show(this.city);
        });
      });
    }
  }

  shutdown() {
    logger.info("FightScene: Shutting down...");
    if (this.hitFeedback) {
      this.hitFeedback.destroy();
    }
    if (this.movementFX) {
      this.movementFX.destroy();
    }
    if (this.criticalMoments) {
      this.criticalMoments.destroy();
    }
  }
}
