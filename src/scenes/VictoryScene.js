import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";
import VictorySlideshow from "../components/VictorySlideshow";

const logger = new UnifiedLogger("VictoryScene");

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
  }

  create(data) {
    logger.info("VictoryScene started", data);
    const { width, height } = this.scale;
    const { winner, health, combo, time, city } = data;

    // Initialize Transitions
    this.transition = addTransitions(this);
    this.audioManager = this.registry.get("audioManager");
    if (this.audioManager) {
      this.audioManager.updateScene(this);
    }

    // Background (Dark gradient)
    this.add.rectangle(0, 0, width, height, 0x111111).setOrigin(0);

    // Victory Text
    this.add
      .text(width / 2, height * 0.2, `PLAYER ${winner} WINS!`, {
        fontFamily: '"Press Start 2P"',
        fontSize: "48px",
        fill: "#ffd700",
        stroke: "#880000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Stats Container
    const statsY = height * 0.4;
    const statsStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: "24px",
      fill: "#ffffff",
      lineSpacing: 20,
    };

    this.add
      .text(
        width / 2,
        statsY,
        `REMAINING HP: ${Math.floor(health)}%`,
        statsStyle,
      )
      .setOrigin(0.5);

    this.add
      .text(width / 2, statsY + 50, `MAX COMBO: ${combo}`, statsStyle)
      .setOrigin(0.5);

    this.add
      .text(width / 2, statsY + 100, `TIME: ${99 - time}s`, statsStyle)
      .setOrigin(0.5);

    // Save data for rematch
    this.rematchData = {
      city: data.city,
      backgroundUrl: data.backgroundUrl,
      backgroundKey: data.backgroundKey,
      playerCharacter: data.playerCharacter,
      opponentCharacter: data.opponentCharacter,
      player1: data.playerCharacter, // For LoadingScene loader
      player2: data.opponentCharacter, // For LoadingScene loader
    };

    // Buttons
    // CLAIM REWARD (Main Action)
    const claimBtn = this.add
      .text(width / 2, height * 0.7, "CLAIM REWARD >", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        fill: "#ffd700", // Gold text
        backgroundColor: "#330000", // Dark Red/Brown bg
        padding: { x: 20, y: 15 },
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Pulse Animation
    this.tweens.add({
      targets: claimBtn,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    claimBtn.on("pointerdown", () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");
      this.showSlideshow(city);
    });

    // REMATCH (Secondary Action)
    const rematchBtn = this.add
      .text(width / 2, height * 0.8, "REMATCH", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        fill: "#ffaa00", // Orange
        backgroundColor: "#331100",
        padding: { x: 15, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    rematchBtn.on("pointerdown", async () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");

      // Use LoadingScene for JIT reloading of fighter assets
      await this.transition.transitionTo(
        "LoadingScene",
        {
          targetScene: "FightScene",
          targetData: this.rematchData,
        },
        TransitionPresets.QUICK.type,
        TransitionPresets.QUICK.duration,
        TransitionPresets.QUICK.color,
      );
    });

    // MAIN MENU (Tertiary Action)
    const menuBtn = this.add
      .text(width / 2, height * 0.9, "MAIN MENU", {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        fill: "#666666",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menuBtn.on("pointerdown", async () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");
      await this.transition.transitionTo(
        "MainMenuScene",
        {},
        TransitionPresets.BACK_TO_MENU.type,
        TransitionPresets.BACK_TO_MENU.duration,
        TransitionPresets.BACK_TO_MENU.color,
      );
    });
  }

  showSlideshow(city) {
    // Instantiate the Slideshow component
    // Note: We need to ensure VictorySlideshow is updated to not rely on FightScene context exclusively
    // or we pass this scene as context.
    const slideshow = new VictorySlideshow(this);
    slideshow.show(city);
  }
}
