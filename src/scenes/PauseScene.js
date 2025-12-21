import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger";

const logger = new UnifiedLogger("PauseScene");

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }

  create() {
    logger.info("PauseScene started");
    const { width, height } = this.scale;
    this.audioManager = this.registry.get("audioManager");

    // 1. Semi-transparent background
    this.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setInteractive(); // Block input to scene below

    // 2. Title
    this.add
      .text(width / 2, height * 0.3, "PAUSED", {
        fontFamily: '"Press Start 2P"',
        fontSize: "48px",
        fill: "#ffd700", // Gold
        stroke: "#880000", // Red
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // 3. Menu Options Container
    const startY = height * 0.5;
    const spacing = 60;

    // RESUME
    this.createMenuOption(width / 2, startY, "RESUME", () => {
      this.resumeGame();
    });

    // AUDIO TOGGLE
    const isMuted = this.sound.mute;
    this.audioText = this.createMenuOption(
      width / 2,
      startY + spacing,
      `AUDIO: ${isMuted ? "OFF" : "ON"}`,
      () => {
        this.toggleAudio();
      },
    );

    // QUIT TO MENU
    this.createMenuOption(
      width / 2,
      startY + spacing * 2,
      "QUIT TO MENU",
      () => {
        this.quitToMenu();
      },
    );
  }

  createMenuOption(x, y, text, callback) {
    const option = this.add
      .text(x, y, text, {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    option.on("pointerover", () => {
      option.setStyle({ fill: "#ffd700" }); // Gold on hover
    });

    option.on("pointerout", () => {
      option.setStyle({ fill: "#ffffff" });
    });

    option.on("pointerdown", () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");
      callback();
    });

    return option;
  }

  resumeGame() {
    logger.info("Resuming game...");
    this.scene.resume("FightScene");
    this.scene.stop();
  }

  toggleAudio() {
    this.sound.mute = !this.sound.mute;
    const isMuted = this.sound.mute;
    this.audioText.setText(`AUDIO: ${isMuted ? "OFF" : "ON"}`);
    logger.info(`Audio toggled: ${isMuted ? "OFF" : "ON"}`);
  }

  quitToMenu() {
    logger.info("Quitting to menu...");
    this.scene.stop("FightScene");

    // We can't use the TransitionManager easily here because it's bound to the scenes.
    // So we just start MainMenuScene directly, or use a simple transition if possible.
    // For safety/simplicity in Pause menu, direct switch is often fine, or fade.

    this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
      if (progress === 1) {
        this.scene.start("MainMenuScene");
        this.scene.stop();
      }
    });
  }
}
