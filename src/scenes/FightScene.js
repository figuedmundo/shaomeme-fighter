import Phaser from "phaser";
import Fighter, { FighterState } from "../components/Fighter";
import TouchInputController from "../systems/TouchInputController";
import AIInputController from "../systems/AIInputController";
import TouchVisuals from "../components/TouchVisuals";
import VictorySlideshow from "../components/VictorySlideshow";
import HitFeedbackSystem from "../systems/HitFeedbackSystem";
import MovementFXManager from "../systems/MovementFXManager";
import CriticalMomentsManager from "../systems/CriticalMomentsManager";
import AnnouncerOverlay from "../components/AnnouncerOverlay";

// PHASE 3.2: UI Polish
import UIManager from "../systems/UIManager";

// PHASE 3.1: Stage Enhancement Systems
import ParallaxBackground from "../components/ParallaxBackground";
import AnimatedBackgroundManager from "../components/AnimatedBackgroundManager";
import DynamicLightingSystem from "../systems/DynamicLightingSystem";
import WeatherSystem from "../systems/WeatherSystem";

// Configs
import {
  getParallaxConfigForCity,
  getAnimationPresetForCity,
  getLightingPresetForCity,
  getWeatherPresetForCity,
} from "../config/arenaConfig";
import rosterConfig, { getCharacterDisplayName } from "../config/rosterConfig";

import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:FightScene");

export default class FightScene extends Phaser.Scene {
  constructor() {
    super("FightScene");

    // Ensure basic structures exist for tests/subsystems
    if (!this.cameras) {
      this.cameras = {
        main: { zoom: 1, scrollX: 0, scrollY: 0, ignore: () => {} },
        add: () => ({
          setScroll: () => ({
            setZoom: () => ({
              setName: () => ({
                ignore: () => {},
              }),
            }),
          }),
          ignore: () => {},
        }),
      };
    }

    // Support graphics methods used by UIManager in integration tests
    if (!this.add) {
      this.add = {
        graphics: () => ({
          clear: () => {},
          setScrollFactor: () => {},
          setDepth: () => {},
          fillStyle: () => {},
          fillPoints: () => {},
          lineStyle: () => {},
          strokePoints: () => {},
          destroy: () => {},
        }),
        text: () => ({
          setOrigin: () => ({
            setScrollFactor: () => ({
              setDepth: () => ({ setText: () => {} }),
            }),
          }),
          destroy: () => {},
        }),
        image: () => ({
          setDisplaySize: () => ({
            setScrollFactor: () => ({
              setDepth: () => ({ setFlipX: () => {} }),
            }),
          }),
          destroy: () => {},
        }),
      };
    }

    this.backgroundUrl = null;
    this.backgroundKey = null;
    this.city = "Unknown";
    this.playerCharacter = null;
    this.isGameOver = false;

    // PHASE 3.1: Stage Enhancement Systems
    this.parallaxBg = null;
    this.bgAnimations = null;
    this.lighting = null;
    this.weather = null;

    // PHASE 3.2: UI Manager
    this.uiManager = null;
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

    // Always ensure default background is available as fallback
    if (!this.textures.exists("default_bg")) {
      this.load.image("default_bg", "assets/images/backgrounds/main-bg.jpg");
    }

    if (this.backgroundKey && this.textures.exists(this.backgroundKey)) {
      logger.debug(`Using cached background: ${this.backgroundKey}`);
    } else if (this.backgroundUrl) {
      this.backgroundKey = `dynamic_bg_${Date.now()}`;
      logger.debug(`Dynamic load needed for background: ${this.backgroundUrl}`);
      this.load.image(this.backgroundKey, this.backgroundUrl);
    } else {
      this.backgroundKey = "default_bg";
      logger.debug("Using default background fallback");
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

    // 0. PHASE 3.1: Enhanced Background with Parallax, Lighting, Weather
    this.setupEnhancedBackground();
    this.setupDynamicLighting();
    this.setupAnimatedBackground();
    this.setupWeatherEffects();

    // 1. Setup Scene Geometry (Floor)
    const floorHeight = 100;
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
    const p1Texture = this.playerCharacter || rosterConfig[0].id;

    // Pick random opponent from roster excluding P1
    const availableOpponents = rosterConfig.filter((c) => c.id !== p1Texture);
    const randomOpponent =
      availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    const p2Texture = randomOpponent ? randomOpponent.id : rosterConfig[0].id;

    logger.debug(
      `FightScene: Creating fighters P1:${p1Texture}, P2:${p2Texture}`,
    );
    this.player1 = new Fighter(this, 300, height - 150, p1Texture);
    this.player2 = new Fighter(this, width - 300, height - 150, p2Texture);
    this.player2.setFlipX(true);

    // Link opponents for relative direction logic (Blocking)
    this.player1.setOpponent(this.player2);
    this.player2.setOpponent(this.player1);

    logger.debug("FightScene: Fighters created");

    // PHASE 3.1: Add spotlights on fighters if enabled
    if (this.lighting) {
      const preset = getLightingPresetForCity(this.city);
      if (preset.spotlights) {
        this.lighting.addSpotlight(this.player1, preset.spotlightConfig);
        this.lighting.addSpotlight(this.player2, preset.spotlightConfig);
        logger.debug("Fighter spotlights added");
      }
    }

    // 3. Collisions
    this.physics.add.collider(this.player1, this.floor);
    this.physics.add.collider(this.player2, this.floor);
    this.physics.add.collider(this.player1, this.player2);
    logger.debug("FightScene: Colliders added");

    // 4. Controls
    this.touchController = new TouchInputController(this);
    this.touchVisuals = new TouchVisuals(this);
    logger.debug("FightScene: Touch controls initialized");

    // Player 1: Human (Keyboard + Touch)
    const p1Cursors = this.input.keyboard.createCursorKeys();
    const p1Keys = {
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
    this.player1.setControls(p1Cursors, p1Keys, this.touchController);

    // Player 2: AI (AI Input Controller)
    // We use AIInputController as the "Touch Controller" (3rd arg) for consistency
    // Passing null for keyboard keys as AI generates its own state
    this.aiController = new AIInputController(
      this,
      this.player2,
      this.player1,
      "medium",
    );
    this.player2.setControls(
      this.aiController.getCursorKeys(),
      { attack: this.aiController.getAttackKey() },
      null, // No touch controller for AI
    );

    logger.debug("FightScene: All controls set (P1 Human, P2 AI)");

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

    // 8. PHASE 3.2: UI Manager - Replaces individual UI components
    this.uiManager = new UIManager(this, {
      p1Character: p1Texture,
      p1Name: getCharacterDisplayName(p1Texture),
      p2Character: p2Texture,
      p2Name: getCharacterDisplayName(p2Texture),
      totalRounds: 3,
      matchTime: 99,
      onTimeUp: () => this.handleTimeUp(),
      onLowTime: () => this.handleLowTime(),
    });
    logger.debug("FightScene: UI Manager initialized");

    // 9. Announcer System (Overlays) - Keep for announcements
    this.announcerOverlay = new AnnouncerOverlay(this);
    // Note: ComboOverlay replaced by UIManager's EnhancedComboDisplay

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

    // Initial positions (Off-screen)
    const { width, height } = this.scale;
    this.player1.setPosition(-100, height - 150);
    this.player2.setPosition(width + 100, height - 150);

    // Walk-in animation
    this.tweens.add({
      targets: this.player1,
      x: 300,
      duration: 1500,
      ease: "Power1",
      onStart: () => this.player1.setState(FighterState.WALK),
      onComplete: () => {
        this.player1.setState(FighterState.INTRO);
      },
    });

    this.tweens.add({
      targets: this.player2,
      x: width - 300,
      duration: 1500,
      ease: "Power1",
      onStart: () => this.player2.setState(FighterState.WALK),
      onComplete: () => {
        this.player2.setState(FighterState.INTRO);
      },
    });

    // Timing for "ROUND 1" and "FIGHT!" after intro
    this.time.delayedCall(2000, () => {
      // "ROUND 1"
      this.announcerOverlay.showRound(1);
      if (this.audioManager) this.audioManager.playAnnouncer("round_1");

      this.time.delayedCall(1500, () => {
        // "FIGHT!"
        this.announcerOverlay.showFight();
        if (this.audioManager) this.audioManager.playAnnouncer("fight");

        this.inputEnabled = true;
        if (this.player1) this.player1.setInputEnabled(true);
        if (this.player2) this.player2.setInputEnabled(true);

        // PHASE 3.2: Start match timer
        if (this.uiManager) {
          this.uiManager.startTimer();
        }
      });
    });
  }

  update(time, delta) {
    this.player1.update();
    this.player2.update();

    // Update AI
    if (this.aiController) {
      this.aiController.update(time, delta);
    }

    // 1. Dynamic Camera Follow
    this.updateCamera();

    // PHASE 3.1: Update stage enhancement systems
    if (this.parallaxBg) {
      this.parallaxBg.update(time, delta);
    }

    if (this.lighting) {
      this.lighting.update();
    }

    if (this.weather) {
      this.weather.update();
    }

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

  updateCamera() {
    const { width, height } = this.scale;

    // Calculate midpoint
    const midX = (this.player1.x + this.player2.x) / 2;
    const midY = (this.player1.y + this.player2.y) / 2;

    // Standard follow
    this.cameras.main.scrollX = midX - width / 2;
    // Don't follow Y too much to keep floor visible
    this.cameras.main.scrollY = Math.max(0, midY - height / 2 - 50);

    // Dynamic Zoom based on distance
    const dist = Phaser.Math.Distance.Between(
      this.player1.x,
      this.player1.y,
      this.player2.x,
      this.player2.y,
    );
    const minZoom = 0.8;
    const maxZoom = 1.2;
    const zoom = Phaser.Math.Clamp(1280 / (dist + 400), minZoom, maxZoom);

    // Smoothly interpolate zoom
    this.cameras.main.zoom = Phaser.Math.Linear(
      this.cameras.main.zoom,
      zoom,
      0.05,
    );
  }

  processComboHit() {
    const now = Date.now();
    // Reset combo if too much time passed (2 seconds)
    if (now - this.lastHitTime > 2000) {
      this.comboCounter = 0;
    }

    this.comboCounter += 1;
    this.lastHitTime = now;

    // PHASE 3.2: Update UI Manager combo display
    if (this.uiManager) {
      // Determine who is attacking (player 1 vs player 2)
      // For now, always show on P1 side (can be enhanced later)
      this.uiManager.updateCombo(this.comboCounter, true);
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
        // Block Logic
        if (defender.currentState === FighterState.BLOCK) {
          logger.info(
            `${defender.texture.key} blocked attack from ${attacker.texture.key}`,
          );
          this.hitFeedback.triggerBlockFeedback(defender);
          if (this.audioManager) {
            this.audioManager.playBlock();
          }
          return; // Damage mitigated (100%)
        }

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

        // Knockdown Physics for lethal hits
        if (isLethal) {
          const knockbackX = attacker.flipX ? -200 : 200;
          defender.setVelocityX(knockbackX);
          defender.setVelocityY(-300); // Slight pop-up
        }

        // PHASE 3.1: Flash effect on hit
        if (this.lighting) {
          const flashColor = isHeavyHit ? 0xff0000 : 0xffffff;
          const flashIntensity = isHeavyHit ? 0.9 : 0.6;
          this.lighting.flash(flashColor, 100, flashIntensity);
        }

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

      // PHASE 3.2: Stop timer and determine winner
      const winnerNum = this.player1.health > 0 ? 1 : 2;

      if (this.uiManager) {
        this.uiManager.stopTimer();
        this.uiManager.showVictory(winnerNum);
      }

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
        winnerName = getCharacterDisplayName(winner.texture.key);
      }

      this.time.delayedCall(2000, () => {
        if (this.announcerOverlay) {
          this.announcerOverlay.showWin(winnerName);
        }
        if (this.audioManager) {
          this.audioManager.playAnnouncer("you_win"); // Or 'perfect' check
        }

        // Trigger victory animation
        if (winner) {
          winner.setState(FighterState.VICTORY);
        }

        // PHASE 3.1: Dramatic victory lighting
        if (this.lighting && winner) {
          this.lighting.setAmbientLight(0.3, 1000);
          this.lighting.addSpotlight(winner, {
            radius: 200,
            intensity: 2.0,
            color: 0xffffaa,
          });
          logger.debug("Victory spotlight activated");
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

    // PHASE 3.2: Cleanup UI Manager
    if (this.uiManager) {
      this.uiManager.destroy();
      this.uiManager = null;
    }

    // PHASE 3.1: Cleanup stage enhancement systems
    if (this.parallaxBg) {
      this.parallaxBg.destroy();
      this.parallaxBg = null;
    }

    if (this.bgAnimations) {
      this.bgAnimations.destroy();
      this.bgAnimations = null;
    }

    if (this.lighting) {
      this.lighting.destroy();
      this.lighting = null;
    }

    if (this.weather) {
      this.weather.destroy();
      this.weather = null;
    }

    logger.info("FightScene: All systems cleaned up");
  }

  // ============================================================
  // PHASE 3.1: STAGE ENHANCEMENT SETUP METHODS
  // ============================================================

  setupEnhancedBackground() {
    const bgKey = this.textures.exists(this.backgroundKey)
      ? this.backgroundKey
      : "default_bg";

    // Check if we have parallax layers for this city
    const cityConfig = getParallaxConfigForCity(this.city);

    // Check if the primary layer of the city config exists
    const hasCityTextures =
      cityConfig && cityConfig.layers.every((l) => this.textures.exists(l.key));

    if (cityConfig && hasCityTextures) {
      // Use full parallax system
      this.parallaxBg = new ParallaxBackground(this, {
        layers: cityConfig.layers,
        baseDepth: -100,
      });
      logger.debug("Multi-layer parallax background created");
    } else {
      // Fallback: Photo background with subtle parallax and styling
      // Using "Sweet Spot" settings: 1.0 alpha and 0xdddddd tint for natural colors
      this.parallaxBg = new ParallaxBackground(this, {
        layers: [
          {
            key: bgKey,
            scrollFactor: 0.1, // Reduced to keep photo more stable
            alpha: 1.0,
            tint: 0xdddddd, // Subtly pushed back, but preserves real colors
          },
        ],
        baseDepth: -100,
      });
      logger.debug("Simple parallax background created from photo (Fallback)");
    }
  }

  setupAnimatedBackground() {
    // Get animation preset for this city
    const preset = getAnimationPresetForCity(this.city);

    if (preset) {
      this.bgAnimations = new AnimatedBackgroundManager(this);
      this.bgAnimations.applyPreset(preset);
      logger.debug(`Animated background created with ${this.city} preset`);
    } else {
      // Default: subtle ambient effects
      this.bgAnimations = new AnimatedBackgroundManager(this);
      this.bgAnimations.addFloatingParticles({
        type: "dust",
        count: 15,
      });
      logger.debug("Default ambient particles created");
    }
  }

  setupDynamicLighting() {
    const preset = getLightingPresetForCity(this.city);

    this.lighting = new DynamicLightingSystem(this, {
      enableSpotlights: preset.spotlights || false,
      enableAmbient: true,
      enableDynamic: true,
    });

    this.lighting.setAmbientLight(preset.ambientLevel || 1.0, 1000);
    logger.debug(`Dynamic lighting created with ${this.city} preset`);
  }

  setupWeatherEffects() {
    const weatherPreset = getWeatherPresetForCity(this.city);

    if (weatherPreset) {
      this.weather = new WeatherSystem(this);
      this.weather.setWeather(weatherPreset.type, weatherPreset.config);
      logger.debug(`Weather set to: ${weatherPreset.type}`);
    } else {
      logger.debug("No weather effects for this arena");
    }
  }

  /**
   * Handle timer reaching zero
   */
  handleTimeUp() {
    if (this.isGameOver) return;

    logger.info("Time's up!");
    this.isGameOver = true;
    this.physics.pause();

    // Determine winner by health
    const winner = this.player1.health > this.player2.health ? 1 : 2;

    if (this.uiManager) {
      this.uiManager.showVictory(winner);
    }

    // Announcer
    if (this.announcerOverlay) {
      this.announcerOverlay.showKO();
    }

    if (this.audioManager) {
      this.audioManager.playKO();
      this.audioManager.stopMusic(2000);
    }

    // Continue with victory sequence
    this.time.delayedCall(2000, () => {
      if (this.announcerOverlay) {
        const winnerName =
          winner === 1
            ? getCharacterDisplayName(this.player1.texture.key)
            : getCharacterDisplayName(this.player2.texture.key);
        this.announcerOverlay.showWin(winnerName);
      }

      if (this.audioManager) {
        this.audioManager.playAnnouncer("you_win");
      }

      this.time.delayedCall(2000, () => {
        this.slideshow.show(this.city);
      });
    });
  }

  /**
   * Handle low time warning (10 seconds)
   */
  handleLowTime() {
    logger.warn("Low time warning - 10 seconds remaining!");

    // Speed up music slightly for urgency
    if (this.audioManager) {
      this.audioManager.setMusicRate(1.1);
    }
  }
}
