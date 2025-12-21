import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger";

const logger = new UnifiedLogger("TutorialOverlayScene");

export default class TutorialOverlayScene extends Phaser.Scene {
  constructor() {
    super("TutorialOverlayScene");
  }

  create() {
    logger.info("TutorialOverlayScene started");
    const { width, height } = this.scale;
    this.audioManager = this.registry.get("audioManager");

    // 1. Semi-transparent background
    this.add
      .rectangle(0, 0, width, height, 0x000000, 0.85)
      .setOrigin(0)
      .setInteractive()
      .on("pointerdown", () => this.dismiss());

    // 2. Title
    this.add
      .text(width / 2, height * 0.15, "HOW TO FIGHT", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        fill: "#ffd700",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // 3. Layout (Left / Right)
    const col1X = width * 0.25;
    const col2X = width * 0.75;
    const contentY = height * 0.4;

    // LEFT COL: Movement
    this.add
      .text(col1X, contentY - 60, "MOVEMENT", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        fill: "#00ffff", // Cyan
      })
      .setOrigin(0.5);

    this.createInstruction(col1X, contentY, "SWIPE RIGHT", "Move Forward");
    this.createInstruction(col1X, contentY + 50, "SWIPE LEFT", "Move Back");
    this.createInstruction(col1X, contentY + 100, "SWIPE UP", "Jump");
    this.createInstruction(col1X, contentY + 150, "SWIPE DOWN", "Crouch");

    // RIGHT COL: Combat
    this.add
      .text(col2X, contentY - 60, "COMBAT", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        fill: "#ff4444", // Red
      })
      .setOrigin(0.5);

    this.createInstruction(col2X, contentY, "TAP SCREEN", "Attack");
    this.createInstruction(col2X, contentY + 50, "HOLD BACK", "Block High");
    this.createInstruction(
      col2X,
      contentY + 100,
      "HOLD DOWN+BACK",
      "Block Low",
    );

    // 4. "Tap to Start" (Blinking)
    const tapText = this.add
      .text(width / 2, height * 0.85, "TAP ANYWHERE TO START", {
        fontFamily: '"Press Start 2P"',
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: tapText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  createInstruction(x, y, action, desc) {
    this.add
      .text(x, y, action, {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 20, desc, {
        fontFamily: '"Press Start 2P"',
        fontSize: "12px",
        fill: "#aaaaaa",
      })
      .setOrigin(0.5);
  }

  dismiss() {
    logger.info("Dismissing tutorial...");

    // Set flag
    try {
      localStorage.setItem("has_seen_tutorial", "true");
    } catch (e) {
      logger.warn("Failed to set localStorage", e);
    }

    if (this.audioManager) this.audioManager.playUi("ui_select");

    // Resume fight
    this.scene.resume("FightScene");
    this.scene.stop();
  }
}
