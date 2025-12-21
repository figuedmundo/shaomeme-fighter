import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger";

const logger = new UnifiedLogger("LoadingScene");

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  create(data) {
    logger.info("LoadingScene started", data);
    const { width, height } = this.scale;
    const { targetScene, targetData = {} } = data;

    // Background
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

    // "LOADING..." Text
    const loadingText = this.add
      .text(width / 2, height / 2, "LOADING...", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(10);

    // Pulsing Animation
    this.tweens.add({
      targets: loadingText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Start loading process
    this.startLoading(targetScene, targetData);
  }

  startLoading(targetScene, targetData) {
    if (!targetScene) {
      logger.warn("No target scene provided to LoadingScene");
      return;
    }

    // Simulate minimum load time (e.g., 1.5 seconds) to prevent flickering
    // In a real scenario, this could also listen for asset loading events
    this.time.delayedCall(1500, () => {
      logger.info(`Loading complete. Starting ${targetScene}`);
      this.scene.start(targetScene, targetData);
    });
  }
}
