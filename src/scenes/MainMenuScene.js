import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.scale;

    const startText = this.add
      .text(width / 2, height / 2, "Start Game", {
        fontSize: "64px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    startText.on("pointerdown", () => {
      this.scene.start("FightScene");
    });

    startText.on("pointerover", () => {
      startText.setStyle({ fill: "#ff0" });
    });

    startText.on("pointerout", () => {
      startText.setStyle({ fill: "#fff" });
    });
  }
}
