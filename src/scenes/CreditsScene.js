import Phaser from "phaser";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    const { width, height } = this.scale;
    this.transition = addTransitions(this);
    this.audioManager = this.registry.get("audioManager");

    // Fade in
    this.transition.fadeIn(500);

    // Header
    this.add
      .text(width / 2, height * 0.15, "CREDITS", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "48px",
        fill: "#ffd700",
        stroke: "#880000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Content Container
    const contentY = height * 0.4;

    // Created By
    this.add
      .text(width / 2, contentY, "Created by", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "16px",
        fill: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, contentY + 40, "FeiFei", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "32px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Dedication
    this.add
      .text(width / 2, contentY + 120, "For Shaomeme Fighter", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "16px",
        fill: "#aaaaaa",
      })
      .setOrigin(0.5);

    // Easter Egg Trigger (The "Love" message)
    const loveText = this.add
      .text(width / 2, contentY + 180, "Made with love for Shaomeme QQ", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "14px",
        fill: "#ff69b4", // Hot pink
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Easter Egg Logic
    let clickCount = 0;
    loveText.on("pointerdown", () => {
      clickCount += 1;

      // Subtle bounce
      this.tweens.add({
        targets: loveText,
        scale: 1.2,
        duration: 100,
        yoyo: true,
      });

      if (clickCount === 5) {
        this.triggerEasterEgg();
      }
    });

    // Back Button
    const backBtn = this.add
      .text(width / 2, height * 0.9, "BACK", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "24px",
        fill: "#ffd700",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerover", () => backBtn.setStyle({ fill: "#ffffff" }));
    backBtn.on("pointerout", () => backBtn.setStyle({ fill: "#ffd700" }));

    backBtn.on("pointerdown", async () => {
      if (this.audioManager) this.audioManager.playUi("ui_back");
      await this.transition.transitionTo(
        "MainMenuScene",
        {},
        TransitionPresets.BACK_TO_MENU.type,
        TransitionPresets.BACK_TO_MENU.duration,
      );
    });
  }

  triggerEasterEgg() {
    if (this.audioManager) {
      // Play a "secret" sound (or reuse a victory/rare sound)
      // Ideally we'd have a 'secret_found' sound. For now, let's use a distinct UI sound or check if we can reuse something.
      // Using 'ui_select' pitched up or similar if possible, or just calling it 'secret_found' and letting AudioManager handle fallback/error gracefully if missing.
      // Actually, based on previous tasks, we have 'ui_select'. Let's try to mock a special sound key.
      this.audioManager.playUi("secret_found");
    }

    // Visual fanfare
    const { width, height } = this.scale;
    const particles = this.add.particles(width / 2, height / 2, "spark", {
      speed: { min: -200, max: 200 },
      scale: { start: 1, end: 0 },
      lifespan: 1000,
      blendMode: "ADD",
      quantity: 20,
    });

    this.time.delayedCall(1000, () => particles.destroy());
  }
}
