import Phaser from "phaser";
import rosterConfig from "../config/rosterConfig";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:PreloadScene");

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    logger.info("PreloadScene: Started loading assets...");
    const { width, height } = this.scale;

    // Create loading text immediately so it can be updated during preload
    this.loadingText = this.add
      .text(width / 2, height / 2, "LOADING... 0%", {
        fontFamily: '"Press Start 2P"',
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // UI Assets
    console.log("PreloadScene: Loading UI assets...");
    this.load.image("logo", "resources/shaomeme_fighter.png");

    // Audio
    console.log("PreloadScene: Loading Audio...");
    this.load.audio("ui-select", "resources/attack1.mp3");
    this.load.audio("soundtrack", "resources/soundtrack.mp3");
    this.load.audio("KO", "resources/KO.mp3");

    // Load All Fighter Spritesheets from Roster
    console.log("PreloadScene: Loading Fighter spritesheets...");
    rosterConfig.forEach((char) => {
      console.log(`PreloadScene: Loading spritesheet for ${char.id}`);
      this.load.spritesheet(
        char.id,
        `assets/fighters/${char.id}/${char.id}.png`,
        {
          frameWidth: 100,
          frameHeight: 200,
        },
      );
    });

    // Also load Ryu and Ken as defaults/fallback
    this.load.spritesheet("ryu", "assets/fighters/ryu/ryu.png", {
      frameWidth: 100,
      frameHeight: 200,
    });
    this.load.spritesheet("ken", "assets/fighters/ken/ken.png", {
      frameWidth: 100,
      frameHeight: 200,
    });

    // Handle loading events
    this.load.on("filecomplete", (key) => {
      console.log(`PreloadScene: File complete: ${key}`);
    });

    this.load.on("loaderror", (file) => {
      console.error(`PreloadScene: Error loading file: ${file.key}`, file);
    });

    this.load.on("progress", (value) => {
      if (this.loadingText) {
        this.loadingText.setText(`LOADING... ${Math.floor(value * 100)}%`);
      }
    });

    this.load.on("complete", () => {
      console.log("PreloadScene: Asset load complete.");
      logger.info("PreloadScene: Asset load complete.");
      // Small delay for smooth transition
      this.time.delayedCall(500, () => {
        console.log("PreloadScene: Transitioning to MainMenuScene...");
        this.scene.start("MainMenuScene");
      });
    });
  }

  create() {
    const { width, height } = this.scale;
    // Show new logo during preload/transition
    const logo = this.add.image(width / 2, height * 0.3, "logo");
    const maxWidth = width * 0.6;
    if (logo.width > maxWidth) {
      logo.setDisplaySize(maxWidth, (maxWidth / logo.width) * logo.height);
    }

    if (this.loadingText) {
      this.loadingText.setY(height * 0.7).setText("LOAD COMPLETE!");
    }
  }
}
