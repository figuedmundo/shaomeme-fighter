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

    let assetsQueued = false;

    // Check Player 1 (Support both 'player1' and 'playerCharacter' keys)
    const p1Key = targetData.player1 || targetData.playerCharacter;
    if (p1Key) {
      if (!this.textures.exists(p1Key)) {
        logger.info(`Queuing asset: ${p1Key}`);
        this.load.spritesheet(p1Key, `/assets/fighters/${p1Key}/${p1Key}.png`, {
          frameWidth: 200,
          frameHeight: 400,
        });
        assetsQueued = true;
      }
    }

    // Check Player 2 (Support both 'player2' and 'opponentCharacter' keys)
    const p2Key = targetData.player2 || targetData.opponentCharacter;
    if (p2Key) {
      if (!this.textures.exists(p2Key)) {
        logger.info(`Queuing asset: ${p2Key}`);
        this.load.spritesheet(p2Key, `/assets/fighters/${p2Key}/${p2Key}.png`, {
          frameWidth: 200,
          frameHeight: 400,
        });
        assetsQueued = true;
      }
    }

    // Check Arena (if simple image)
    // Note: Parallax layers might be more complex, but assuming standard 'arena_bg' or similar key logic
    // Usually arena assets are loaded in Preload or ArenaSelect.
    // If we want JIT here, we need the specific keys.
    // For now, let's assume we handle the Fighters primarily as they are the big sheets.
    // We can add arena logic if we standardise arena asset keys.

    if (assetsQueued) {
      this.load.on("complete", () => {
        logger.info("JIT Loading complete");
        this.load.off("complete"); // Clean listener
        this.scene.start(targetScene, targetData);
      });

      this.load.on("loaderror", (file) => {
        logger.error(`Failed to load ${file.key}`);
      });

      this.load.start();
    } else {
      // Nothing to load, proceed immediately (with small delay for UX)
      logger.info("Assets already loaded, proceeding.");
      this.time.delayedCall(500, () => {
        this.scene.start(targetScene, targetData);
      });
    }
  }
}
