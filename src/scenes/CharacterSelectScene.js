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

    // Layout Constants
    this.PORTRAIT_FIT_WIDTH = 0.45;
    this.PORTRAIT_FIT_HEIGHT = 0.75; // Reduced from 0.85 to allow 1.2x zoom to stay within screen
    this.ZOOM_FACTOR = 1.2;
  }

  preload() {
    this.load.image("select_bg", "/assets/images/backgrounds/select_bg.png");

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
      this.audioManager.updateScene(this);
      this.audioManager.playMusic("select_music");
    }

    // Background (Image)
    const bg = this.add
      .image(width / 2, height / 2, "select_bg")
      .setOrigin(0.5);
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

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
    this.fitInArea(
      this.leftPortrait,
      width * this.PORTRAIT_FIT_WIDTH,
      height * this.PORTRAIT_FIT_HEIGHT,
    );

    // 2. Right Silhouette (Opponent)
    const aiX = width * 0.75;
    this.rightPortrait = this.add
      .image(aiX, centerY, `full_body_${rosterConfig[1].id}`)
      .setOrigin(0.5)
      .setTint(0x000000)
      .setAlpha(0.3);
    this.fitInArea(
      this.rightPortrait,
      width * this.PORTRAIT_FIT_WIDTH,
      height * this.PORTRAIT_FIT_HEIGHT,
    );

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
    const cols = 2; // 2 columns as requested (3 rows for 6 characters)
    const rows = Math.ceil(rosterConfig.length / cols);
    const slotWidth = 80;
    const slotHeight = 105;
    const gap = 4;

    const gridWidth = cols * slotWidth + (cols - 1) * gap;
    const gridHeight = rows * slotHeight + (rows - 1) * gap;

    // Center the grid perfectly in the middle (vertically and horizontally)
    const startX = width / 2 - gridWidth / 2 + slotWidth / 2;
    const startY = height * 0.5 - gridHeight / 2 + slotHeight / 2;

    rosterConfig.forEach((char, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = startX + col * (slotWidth + gap);
      const y = startY + row * (slotHeight + gap);

      // Container for Scale Effect
      const container = this.add.container(x, y);

      // Metallic Border (Graphics)
      const border = this.add.graphics();
      this.drawMetallicBorder(
        border,
        -slotWidth / 2,
        -slotHeight / 2,
        slotWidth,
        slotHeight,
        false,
      );
      container.add(border);

      // Icon (Masked or Fitted)
      const icon = this.add.image(0, 0, `icon_${char.id}`);
      this.fitInArea(icon, slotWidth - 4, slotHeight - 4); // Fit inside border
      container.add(icon);

      // Interaction Zone (Transparent Image/Rect)
      const hitArea = this.add
        .rectangle(0, 0, slotWidth, slotHeight, 0x000000, 0)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          if (this.audioManager) this.audioManager.playUi("ui_move");
          this.selectCharacter(index);
        });
      container.add(hitArea);

      // Store references
      this.gridItems.push({ container, border, icon, charId: char.id });
    });
  }

  drawMetallicBorder(graphics, x, y, w, h, isSelected, isP1 = true) {
    graphics.clear();

    // Outer Border (Dark Bronze)
    graphics.lineStyle(2, 0x5c4d3c);
    graphics.strokeRect(x, y, w, h);

    // Inner Border (Bright Gold)
    graphics.lineStyle(1, isSelected ? 0xffffff : 0xa88d57);
    graphics.strokeRect(x + 2, y + 2, w - 4, h - 4);

    if (isSelected) {
      // Inner Glow / Tint Effect
      const color = isP1 ? 0xff0000 : 0x0000ff; // Red for P1, Blue for AI
      graphics.lineStyle(2, color, 0.8);
      graphics.strokeRect(x - 2, y - 2, w + 4, h + 4); // External Glow Ring
    }
  }

  selectCharacter(index) {
    if (index < 0 || index >= rosterConfig.length) return;

    // Deselect previous
    if (this.gridItems[this.selectedCharacterIndex]) {
      const prev = this.gridItems[this.selectedCharacterIndex];
      this.tweens.add({
        targets: prev.container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Sine.easeOut",
      });
      prev.icon.setAlpha(0.9);
      this.drawMetallicBorder(prev.border, -40, -52.5, 80, 105, false); // Hardcoded size for now
    }

    this.selectedCharacterIndex = index;
    const char = rosterConfig[index];
    logger.debug(`Selected character index: ${index}, name: ${char.id}`);

    // Select New
    const curr = this.gridItems[index];
    if (curr) {
      this.tweens.add({
        targets: curr.container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: "Sine.easeOut",
      });
      curr.icon.setAlpha(1);
      this.drawMetallicBorder(curr.border, -40, -52.5, 80, 105, true, true); // P1 Select
    }

    // Update Portrait (Full Body)
    this.leftPortrait.setTexture(`full_body_${char.id}`);
    const { width, height } = this.scale;
    this.fitInArea(
      this.leftPortrait,
      width * this.PORTRAIT_FIT_WIDTH,
      height * this.PORTRAIT_FIT_HEIGHT,
    );

    // Smooth fade in for new texture
    this.leftPortrait.setAlpha(0);
    this.tweens.add({
      targets: this.leftPortrait,
      alpha: 1,
      duration: 200,
    });

    // Update Name
    this.nameText.setText(char.displayName.toUpperCase());
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
        ...this.gridItems.map((item) => item.container),
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
    const rollInterval = 100; // Increased from 50ms to prevent sound spam
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
            this.scale.width * this.PORTRAIT_FIT_WIDTH,
            this.scale.height * this.PORTRAIT_FIT_HEIGHT,
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
    this.fitInArea(
      this.rightPortrait,
      width * this.PORTRAIT_FIT_WIDTH,
      height * this.PORTRAIT_FIT_HEIGHT,
    );

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
      scale: this.rightPortrait.scale * this.ZOOM_FACTOR,
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
      scaleX: this.leftPortrait.scaleX * this.ZOOM_FACTOR,
      scaleY: this.leftPortrait.scaleY * this.ZOOM_FACTOR,
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
