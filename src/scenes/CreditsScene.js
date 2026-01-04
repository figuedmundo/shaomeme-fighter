import Phaser from "phaser";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";
import RoseBorder from "../components/RoseBorder";

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

    // Letter State
    this.isShowingLetter = true;

    // Rose Border Animation
    this.roseBorder = new RoseBorder(this);
    this.roseBorder.start();

    // Letter Text (Paragraphs)
    const letterParagraphs = [
      "Shaomeme QQ, I like mucho your heart, it is kind and selfless, always thinking about other people more than yourself, but that is also your burden when you forget about yourself.",
      "Also, I like mucho the way you are like a spotlight. When you get into a room, class, or group, everyone fox on you. You don't like it, you would prefer to be unnoticed, but everyone is always mucho attentive to what you say and do. It means you are mucho interesting, that your energy makes other people attracted to you, like a moth to a flame.",
      "I like mucho your laugh, your sincere amusement when you have something new in front of you, and your desire to learn, visit new places, and live new experiences.",
    ];

    // Join with double newlines for spacing
    const letterContent = letterParagraphs.join("\n\n");

    this.letterText = this.add
      .text(width / 2, height * 0.4, letterContent, {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "18px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: width * 0.85 },
        lineSpacing: 14,
      })
      .setOrigin(0.5)
      .setAlpha(0); // Start hidden for fade-in

    // Fade in letter
    this.tweens.add({
      targets: this.letterText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.showTapPrompt();
      },
    });

    this.tapPrompt = this.add
      .text(width / 2, height * 0.9, "TAP TO CONTINUE", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "18px",
        fill: "#ffd700",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Credits Container (Initially hidden)
    this.creditsContainer = this.add.container(0, 0).setAlpha(0);

    // Header
    const header = this.add
      .text(width / 2, height * 0.15, "CREDITS", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "48px",
        fill: "#ffd700",
        stroke: "#880000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.creditsContainer.add(header);

    // Content Container
    const contentY = height * 0.4;

    // Created By
    const createdByLabel = this.add
      .text(width / 2, contentY, "Created by", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "16px",
        fill: "#aaaaaa",
      })
      .setOrigin(0.5);
    this.creditsContainer.add(createdByLabel);

    const createdByName = this.add
      .text(width / 2, contentY + 40, "Edmundo", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "32px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.creditsContainer.add(createdByName);

    // Dedication
    const dedication = this.add
      .text(width / 2, contentY + 120, "For Ann", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "16px",
        fill: "#aaaaaa",
      })
      .setOrigin(0.5);
    this.creditsContainer.add(dedication);

    // Easter Egg Trigger (The "Love" message)
    const loveText = this.add
      .text(width / 2, contentY + 180, "Made with love for Shaomeme QQ", {
        fontFamily: '"Press Start 2P", sans-serif',
        fontSize: "14px",
        fill: "#ff69b4", // Hot pink
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.creditsContainer.add(loveText);

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
    this.creditsContainer.add(backBtn);

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

    // Transition Trigger
    this.input.on("pointerdown", () => {
      if (this.isShowingLetter) {
        this.showActualCredits();
      }
    });
  }

  showTapPrompt() {
    this.tweens.add({
      targets: this.tapPrompt,
      alpha: 1,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  showActualCredits() {
    this.isShowingLetter = false;

    if (this.roseBorder) {
      this.roseBorder.destroy();
      this.roseBorder = null;
    }

    // Fade out letter
    this.tweens.add({
      targets: [this.letterText, this.tapPrompt],
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.letterText.destroy();
        this.tapPrompt.destroy();

        // Fade in credits
        this.tweens.add({
          targets: this.creditsContainer,
          alpha: 1,
          duration: 1000,
        });
      },
    });
  }

  triggerEasterEgg() {
    if (this.audioManager) {
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
