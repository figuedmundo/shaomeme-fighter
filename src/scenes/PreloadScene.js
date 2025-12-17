import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // UI Assets
    this.load.image("logo", "resources/shaomeme_fighter.png");

    // Audio
    this.load.audio("ui-select", "resources/attack1.mp3"); // Placeholder logic: use attack1 as select
    this.load.audio("soundtrack", "resources/soundtrack.mp3");
    this.load.audio("KO", "resources/KO.mp3");

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
    // Show new logo during preload/transition
    const logo = this.add.image(width / 2, height / 2, "logo");
    const maxWidth = width * 0.6;
    if (logo.width > maxWidth) {
      logo.setDisplaySize(maxWidth, (maxWidth / logo.width) * logo.height);
    }

    this.add
      .text(width / 2, height * 0.7, "LOADING...", {
        fontFamily: '"Press Start 2P"',
        fontSize: "20px",
      })
      .setOrigin(0.5);

    // Simulate loading time or wait for user input if needed
    this.time.delayedCall(1000, () => {
      this.scene.start("MainMenuScene");
    });
  }
}
