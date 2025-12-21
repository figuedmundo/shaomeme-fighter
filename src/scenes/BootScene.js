import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    console.log("BootScene: Started. Transitioning to PreloadScene...");
    // Clear the loading message from index.html
    const container = document.getElementById("game-container");
    if (container) {
      const loadingMsg = container.querySelector("div");
      if (loadingMsg) loadingMsg.remove();
    }

    // Orientation Handling
    this.checkOrientation(this.scale.orientation);
    this.scale.on("orientationchange", (orientation) => {
      this.checkOrientation(orientation);
    });

    // PHASE 3.1 TESTING: Uncomment the line below to test stage effects
    // Comment out when done testing
    // this.scene.start("StageEffectsTestScene");

    // Normal flow:
    // PHASE 5.1: Use LoadingScene as intermediary
    this.scene.start("LoadingScene", {
      targetScene: "PreloadScene",
    });
  }

  checkOrientation(orientation) {
    if (orientation === Phaser.Scale.PORTRAIT) {
      this.showOrientationWarning();
    } else {
      this.hideOrientationWarning();
    }
  }

  showOrientationWarning() {
    if (!this.orientationText) {
      const { width, height } = this.scale;
      this.orientationText = this.add
        .text(
          width / 2,
          height / 2,
          "PLEASE ROTATE YOUR DEVICE\nTO LANDSCAPE",
          {
            fontFamily: '"Press Start 2P"',
            fontSize: "24px",
            fill: "#ffffff",
            backgroundColor: "#ff0000",
            align: "center",
            padding: { x: 20, y: 20 },
          },
        )
        .setOrigin(0.5)
        .setDepth(1000);
    }
    this.orientationText.setVisible(true);
  }

  hideOrientationWarning() {
    if (this.orientationText) {
      this.orientationText.setVisible(false);
    }
  }
}
