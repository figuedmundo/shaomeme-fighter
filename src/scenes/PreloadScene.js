import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("logo", "assets/logo.png");

    // Load Fighter Spritesheets
    // Frame size 100x200 as defined in generator
    this.load.spritesheet("ryu", "assets/fighters/ryu/ryu.png", {
      frameWidth: 100,
      frameHeight: 200,
    });
    this.load.spritesheet("ken", "assets/fighters/ken/ken.png", {
      frameWidth: 100,
      frameHeight: 200,
    });
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
