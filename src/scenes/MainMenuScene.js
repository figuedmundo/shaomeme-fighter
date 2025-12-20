import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.scale;

    // Get AudioManager
    this.audioManager = this.registry.get("audioManager");
    if (this.audioManager) {
      this.audioManager.playMusic("menu_music");
    }

    // Logo
    const logo = this.add.image(width / 2, height * 0.3, "logo");
    // Scale logo to fit if needed (e.g. max width 80% of screen)
    const maxWidth = width * 0.8;
    if (logo.width > maxWidth) {
      logo.setDisplaySize(maxWidth, (maxWidth / logo.width) * logo.height);
    }

    // Start Button
    const startText = this.add
      .text(width / 2, height * 0.6, "Start Game", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "32px",
        fill: "#ffd700", // Gold
        stroke: "#880000", // Red
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive();

    startText.on("pointerdown", () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");
      this.scene.start("CharacterSelectScene");
    });

    startText.on("pointerover", () => {
      startText.setStyle({ fill: "#ffffff" });
    });

    startText.on("pointerout", () => {
      startText.setStyle({ fill: "#ffd700" });
    });

    // Footer
    this.add
      .text(width / 2, height * 0.95, "Created by FeiFei for Shaomeme QQ", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "12px",
        fill: "#666666",
      })
      .setOrigin(0.5);
  }
}
