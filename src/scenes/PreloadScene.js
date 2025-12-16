import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "logo").setOrigin(0.5);

    // Simulate loading time or wait for user input if needed
    this.time.delayedCall(1000, () => {
      this.scene.start("MainMenuScene");
    });
  }
}
