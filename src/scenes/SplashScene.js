import Phaser from "phaser";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";

export default class SplashScene extends Phaser.Scene {
  constructor() {
    super("SplashScene");
  }

  create() {
    const { width, height } = this.scale;

    // Transition manager
    this.transition = addTransitions(this);
    this.audioManager = this.registry.get("audioManager");

    // Background
    this.cameras.main.setBackgroundColor("#000000");

    // Logo (Centered)
    const logo = this.add.image(width / 2, height / 2, "logo");
    logo.setAlpha(0); // Start invisible

    // Scale logo safely
    const maxDim = Math.min(width, height) * 0.6;
    if (logo.width > maxDim) {
      logo.setScale(maxDim / logo.width);
    }

    // "Tap to Skip" text
    const skipText = this.add
      .text(width / 2, height * 0.9, "Tap to Skip", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "12px",
        fill: "#666666",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Skip Handler (Invisible full-screen interactive zone)
    const skipZone = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0)
      .setInteractive()
      .setDepth(100);

    this.skipTriggered = false;
    skipZone.on("pointerdown", () => {
      if (!this.skipTriggered) {
        this.skipTriggered = true;
        this.goToMenu();
      }
    });

    // Animation Sequence
    this.animationChain = this.tweens.chain({
      tweens: [
        // 1. Fade In Logo
        {
          targets: logo,
          alpha: 1,
          duration: 500,
          ease: "Power2",
        },
        // 2. Fade In Skip Text
        {
          targets: skipText,
          alpha: 1,
          duration: 500,
          delay: 0, // removed overlap for simplicity in chain
        },
        // 3. Hold (using delay on next item or a dummy tween)
        {
          targets: logo,
          duration: 2000,
        },
        // 4. Fade Out All
        {
          targets: [logo, skipText],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            if (!this.skipTriggered) {
              this.goToMenu();
            }
          },
        },
      ],
    });
  }

  async goToMenu() {
    // Stop chain if running
    if (this.animationChain) this.animationChain.stop();

    await this.transition.transitionTo(
      "MainMenuScene",
      {},
      TransitionPresets.QUICK.type,
      TransitionPresets.QUICK.duration,
    );
  }
}
