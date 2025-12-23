import Phaser from "phaser";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.scale;

    // Initialize transition system
    this.transition = addTransitions(this);

    // Fade in when scene starts
    this.transition.fadeIn(500);

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

    startText.on("pointerdown", async () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");

      // Disable button to prevent double-clicks
      startText.disableInteractive();

      // Use dramatic radial wipe transition
      await this.transition.transitionTo(
        "CharacterSelectScene",
        {},
        TransitionPresets.MENU_TO_SELECT.type,
        TransitionPresets.MENU_TO_SELECT.duration,
        TransitionPresets.MENU_TO_SELECT.color,
      );
    });

    startText.on("pointerover", () => {
      startText.setStyle({ fill: "#ffffff" });
    });

    startText.on("pointerout", () => {
      startText.setStyle({ fill: "#ffd700" });
    });

    // Credits Button
    const creditsBtn = this.add
      .text(width - 20, height - 20, "CREDITS", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "16px",
        fill: "#666666",
      })
      .setOrigin(1, 1) // Bottom Right
      .setInteractive({ useHandCursor: true });

    creditsBtn.on("pointerover", () =>
      creditsBtn.setStyle({ fill: "#ffffff" }),
    );
    creditsBtn.on("pointerout", () => creditsBtn.setStyle({ fill: "#666666" }));
    creditsBtn.on("pointerdown", async () => {
      if (this.audioManager) this.audioManager.playUi("ui_select");
      await this.transition.transitionTo(
        "CreditsScene",
        {},
        TransitionPresets.QUICK.type,
        TransitionPresets.QUICK.duration,
      );
    });

    // Footer (Replaced by Credits Button logic essentially, but keeping original footer text as plain decoration if needed,
    // or we can remove it since Credits Scene has the info. Spec said to reuse footer style, but maybe we replace the static footer with the button?)
    // Let's keep the static footer but maybe make it the button?
    // Spec said: "Add a small 'Credits' button... Position: Bottom-Right or distinct".
    // I will keep the footer text as "Created by..." and ADD the Credits button.

    // Footer
    this.add
      .text(width / 2, height * 0.95, "Created by FeiFei for Shaomeme QQ", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "14px",
        fill: "#d5ceceff", // Darker to not compete
      })
      .setOrigin(0.5);
  }

  shutdown() {
    if (this.transition) {
      this.transition.destroy();
    }
  }
}
