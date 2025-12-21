import Phaser from "phaser";
import rosterConfig from "../config/rosterConfig";
import UnifiedLogger from "../utils/Logger.js";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";

const logger = new UnifiedLogger("Frontend:CharacterSelectScene");

export default class CharacterSelectScene extends Phaser.Scene {
  constructor(config = {}) {
    super("CharacterSelectScene");
    this.selectedCharacterIndex = 0;
    this.opponentCharacter = null;
    this.gridItems = [];
    if (!this.game) {
      this.game = { config: {} }; // For tests and safer config access
    }
    this.transition = config.transitionManager; // Set early for tests
    this._transitionOverride = config.transitionManager;
  }

  preload() {
    // Load Roster Assets
    rosterConfig.forEach((character) => {
      // Use absolute root paths for assets in public/
      const portraitPath = character.portraitPath.startsWith("/")
        ? character.portraitPath
        : `/${character.portraitPath}`;
      const iconPath = character.iconPath.startsWith("/")
        ? character.iconPath
        : `/${character.iconPath}`;
      const fullBodyPath = character.fullBodyPath.startsWith("/")
        ? character.fullBodyPath
        : `/${character.fullBodyPath}`;

      this.load.image(`portrait_${character.id}`, portraitPath);
      this.load.image(`icon_${character.id}`, iconPath);
      this.load.image(`full_body_${character.id}`, fullBodyPath);
    });
  }

  create() {
    const { width, height } = this.scale;

    // Initialize transition system if not overridden
    if (!this.transition) {
      this.transition = addTransitions(this);
    }

    // Fade in from previous transition
    this.transition.fadeIn(300);

    // Get AudioManager
    this.audioManager = this.registry.get("audioManager");
    if (this.audioManager) {
      this.audioManager.playMusic("select_music");
    }

    // Background (Dark)
    this.add.rectangle(width / 2, height / 2, width, height, 0x050505);

    // 0. Dynamic Spotlights (Glows behind fighters)
    this.p1Spotlight = this.add.graphics();
    this.p1Spotlight.fillGradientStyle(
      0x440000,
      0x440000,
      0x000000,
      0x000000,
      0.6,
      0.6,
      0,
      0,
    );
    this.p1Spotlight.fillCircle(width * 0.25, height * 0.6, 300);
    this.p1Spotlight.alpha = 0.5;

    this.aiSpotlight = this.add.graphics();
    this.aiSpotlight.fillGradientStyle(
      0x000044,
      0x000044,
      0x000000,
      0x000000,
      0.6,
      0.6,
      0,
      0,
    );
    this.aiSpotlight.fillCircle(width * 0.75, height * 0.6, 300);
    this.aiSpotlight.alpha = 0.2; // Dimmed until reveal

    // 1. Left Full Body (Player 1)
    const p1X = width * 0.25;
    const centerY = height * 0.5;
    this.leftPortrait = this.add
      .image(p1X, centerY, `full_body_${rosterConfig[0].id}`)
      .setOrigin(0.5); // Center origin for better fitting
    this.fitInArea(this.leftPortrait, width * 0.45, height * 0.85);

    // 2. Right Silhouette (Opponent)
    const aiX = width * 0.75;
    this.rightPortrait = this.add
      .image(aiX, centerY, `full_body_${rosterConfig[1].id}`)
      .setOrigin(0.5)
      .setTint(0x000000)
      .setAlpha(0.3);
    this.fitInArea(this.rightPortrait, width * 0.45, height * 0.85);

    // Add "?" Overlay for AI
    this.aiQuestionMark = this.add
      .text(aiX, height / 2, "?", {
        fontFamily: '"Press Start 2P"',
        fontSize: "128px",
        color: "#333333",
      })
      .setOrigin(0.5);

    // 3. Central Grid
    this.buildGrid();

    // 4. Character Name Text (Large and Retro)
    this.nameText = this.add
      .text(
        width * 0.25,
        height * 0.1,
        rosterConfig[0].displayName.toUpperCase(),
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "48px",
          color: "#ffffff",
          stroke: "#880000",
          strokeThickness: 8,
        },
      )
      .setOrigin(0.5);

    // VS Text in center
    this.add
      .text(width / 2, height * 0.1, "VS", {
        fontFamily: '"Press Start 2P"',
        fontSize: "64px",
        fill: "#ffd700",
        fontStyle: "italic",
        stroke: "#000000",
        strokeThickness: 10,
      })
      .setOrigin(0.5);

    // 5. Select Button (Visual cue)
    this.selectBtn = this.add
      .text(width / 2, height * 0.9, "SELECT", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        fill: "#ffd700",
        backgroundColor: "#330000",
        padding: { x: 20, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.confirmSelection());

    // Back Button
    this.add
      .text(50, 50, "< BACK", {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 10 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", async () => {
        if (this.audioManager) this.audioManager.playUi("ui_select");

        // Quick fade back to menu
        await this.transition.transitionTo(
          "MainMenuScene",
          {},
          TransitionPresets.BACK_TO_MENU.type,
          TransitionPresets.BACK_TO_MENU.duration,
          TransitionPresets.BACK_TO_MENU.color,
        );
      });

    // Pulse animation for spotlight
    this.tweens.add({
      targets: this.p1Spotlight,
      alpha: 0.8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Initial Selection
    this.selectCharacter(0);
  }

  buildGrid() {
    const { width, height } = this.scale;
    const cols = 3; // 3 columns
    const rows = Math.ceil(rosterConfig.length / cols);
    const iconSize = 100;
    const gap = 10;

    const gridWidth = cols * iconSize + (cols - 1) * gap;
    const gridHeight = rows * iconSize + (rows - 1) * gap;

    const startX = width / 2 - gridWidth / 2 + iconSize / 2;
    const startY = height / 2 - gridHeight / 2 + iconSize / 2;

    rosterConfig.forEach((char, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = startX + col * (iconSize + gap);
      const y = startY + row * (iconSize + gap);

      // Icon
      const icon = this.add
        .image(x, y, `icon_${char.id}`)
        .setDisplaySize(iconSize, iconSize)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          if (this.audioManager) this.audioManager.playUi("ui_move");
          this.selectCharacter(index);
        });

      // Border
      const border = this.add
        .rectangle(x, y, iconSize + 6, iconSize + 6)
        .setStrokeStyle(2, 0x444444); // Default grey

      this.gridItems.push({ icon, border });
    });
  }

  selectCharacter(index) {
    if (index < 0 || index >= rosterConfig.length) return;

    this.selectedCharacterIndex = index;
    const char = rosterConfig[index];
    logger.debug(`Selected character index: ${index}, name: ${char.id}`);

    // Update Portrait (Full Body)
    this.leftPortrait.setTexture(`full_body_${char.id}`);
    const { width, height } = this.scale;
    this.fitInArea(this.leftPortrait, width * 0.45, height * 0.85);

    // Smooth fade in for new texture
    this.leftPortrait.setAlpha(0);
    this.tweens.add({
      targets: this.leftPortrait,
      alpha: 1,
      duration: 200,
    });

    // Update Name
    this.nameText.setText(char.displayName.toUpperCase());

    // Update Grid Highlights
    this.gridItems.forEach((item, i) => {
      if (i === index) {
        item.border.setStrokeStyle(4, 0xffd700); // Gold
      } else {
        item.border.setStrokeStyle(2, 0x444444); // Grey
      }
    });
  }

  async confirmSelection() {
    const char = rosterConfig[this.selectedCharacterIndex];
    logger.info(`Confirmed character selection: ${char.id}`);

    // Disable button to prevent double-selection
    this.selectBtn.disableInteractive();

    // 1. Play P1 Confirmed Audio
    if (this.audioManager) {
      this.audioManager.playUi("ui_select");
      this.audioManager.playAnnouncer(`announcer_${char.id}`);
    }

    // 2. Fade out secondary UI (Grid and Buttons)
    this.tweens.add({
      targets: [
        this.selectBtn,
        ...this.gridItems.map((item) => item.icon),
        ...this.gridItems.map((item) => item.border),
      ],
      alpha: 0,
      duration: 300,
    });

    // 3. Opponent Reveal "Roll" Logic
    const availableOpponents = rosterConfig.filter((c) => c.id !== char.id);
    const opponent =
      availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    this.opponentCharacter = opponent.id;

    // Remove question mark early
    if (this.aiQuestionMark) this.aiQuestionMark.destroy();

    // "Slot Machine" cycling
    const rollDuration = 500;
    const rollInterval = 50;
    let elapsed = 0;

    this.time.addEvent({
      delay: rollInterval,
      repeat: rollDuration / rollInterval,
      callback: () => {
        elapsed += rollInterval;
        if (elapsed < rollDuration) {
          // Cycle silhouettes
          const randomChar =
            rosterConfig[Math.floor(Math.random() * rosterConfig.length)];
          this.rightPortrait.setTexture(`full_body_${randomChar.id}`);
          this.fitInArea(
            this.rightPortrait,
            this.scale.width * 0.45,
            this.scale.height * 0.85,
          );
          this.rightPortrait.setTint(0x000000);
          this.rightPortrait.setAlpha(0.3);

          if (this.audioManager) this.audioManager.playUi("ui_move");
        } else {
          // Reveal actual opponent
          this.revealOpponent(opponent);
        }
      },
    });
  }

  async revealOpponent(opponent) {
    logger.info(`Revealing opponent: ${opponent.id}`);

    // Update Right Portrait (Clear tint and set final texture)
    this.rightPortrait.clearTint();
    this.rightPortrait.setTexture(`full_body_${opponent.id}`);
    const { width, height } = this.scale;
    this.fitInArea(this.rightPortrait, width * 0.45, height * 0.85);

    // Update AI Spotlight
    this.tweens.add({
      targets: this.aiSpotlight,
      alpha: 0.8,
      duration: 300,
    });

    // Fade in and Scale up
    this.rightPortrait.setAlpha(1);
    this.tweens.add({
      targets: this.rightPortrait,
      scale: this.rightPortrait.scale * 1.2,
      duration: 200,
      yoyo: true,
      ease: "Sine.easeOut",
    });

    // Play Opponent Announcer
    if (this.audioManager) {
      this.audioManager.playAnnouncer(`announcer_${opponent.id}`);
    }

    // 4. VS Splash Effect
    // Scale both portraits
    this.tweens.add({
      targets: [this.leftPortrait, this.rightPortrait],
      scaleX: this.leftPortrait.scaleX * 1.2,
      scaleY: this.leftPortrait.scaleY * 1.2,
      duration: 200,
      ease: "Sine.easeOut",
    });

    // Flash Effect
    await this.transition.flash(200, 0xffffff);

    // 5. Final Handoff to Arena Select
    const transitionData = {
      playerCharacter: rosterConfig[this.selectedCharacterIndex].id,
      opponentCharacter: this.opponentCharacter,
    };

    if (this.game && this.game.config && this.game.config.test) {
      // Immediate handoff for tests
      await this.transition.transitionTo(
        "ArenaSelectScene",
        transitionData,
        TransitionPresets.SELECT_TO_ARENA.type,
        TransitionPresets.SELECT_TO_ARENA.duration,
        TransitionPresets.SELECT_TO_ARENA.color,
      );
    } else {
      this.time.delayedCall(800, async () => {
        await this.transition.transitionTo(
          "ArenaSelectScene",
          transitionData,
          TransitionPresets.SELECT_TO_ARENA.type,
          TransitionPresets.SELECT_TO_ARENA.duration,
          TransitionPresets.SELECT_TO_ARENA.color,
        );
      });
    }
  }

  shutdown() {
    if (this.transition) {
      this.transition.destroy();
    }
  }

  /**
   * Proportional scaling to fit within a maximum width and height
   * @param {Phaser.GameObjects.Image} image
   * @param {number} maxWidth
   * @param {number} maxHeight
   */
  fitInArea(image, maxWidth, maxHeight) {
    if (!image.texture) return;

    // Reset scale to 1 to get natural dimensions
    image.setScale(1);

    const scaleX = maxWidth / image.width;
    const scaleY = maxHeight / image.height;

    // Use the smaller scale to ensure it fits perfectly within the box
    const finalScale = Math.min(scaleX, scaleY);
    image.setScale(finalScale);
  }
}
