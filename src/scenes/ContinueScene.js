import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";

const logger = new UnifiedLogger("ContinueScene");

export default class ContinueScene extends Phaser.Scene {
  constructor() {
    super("ContinueScene");
  }

  create(data) {
    logger.info("ContinueScene started", data);
    const { width, height } = this.scale;
    this.restartData = data; // Store data to restart fight

    this.transition = addTransitions(this);
    this.audioManager = this.registry.get("audioManager");
    this.counter = 10;

    // Red Tint Overlay
    this.add.rectangle(0, 0, width, height, 0x330000, 0.8).setOrigin(0);

    // "CONTINUE?" Text
    this.add
      .text(width / 2, height * 0.2, "CONTINUE?", {
        fontFamily: '"Press Start 2P"',
        fontSize: "48px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Countdown Number
    this.countText = this.add
      .text(width / 2, height / 2, "10", {
        fontFamily: '"Press Start 2P"',
        fontSize: "128px",
        fill: "#ff0000",
        stroke: "#ffffff",
        strokeThickness: 10,
      })
      .setOrigin(0.5);

    // Tap to Continue
    const tapText = this.add
      .text(width / 2, height * 0.8, "TAP TO FIGHT!", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { x: 20, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Pulse Animation
    this.tweens.add({
      targets: [this.countText, tapText],
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Interaction
    tapText.on("pointerdown", () => this.restart());
    this.input.on("pointerdown", () => this.restart()); // Tap anywhere

    // Timer Event
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => this.tick(),
      loop: true,
    });
  }

  tick() {
    this.counter -= 1;
    this.countText.setText(this.counter.toString());

    // Play beep sound if available (using UI move as placeholder)
    if (this.audioManager) this.audioManager.playUi("ui_move");

    if (this.counter < 0) {
      this.gameover();
    }
  }

  async restart() {
    if (this.timerEvent) this.timerEvent.remove();
    this.input.off("pointerdown");

    if (this.audioManager) this.audioManager.playUi("ui_select");

    // Flash white then restart
    await this.transition.flash(200, 0xffffff);

    // Pass same data back to FightScene
    this.scene.start("FightScene", this.restartData);
  }

  async gameover() {
    if (this.timerEvent) this.timerEvent.remove();
    this.input.off("pointerdown");

    this.countText.setText("GAME OVER");
    this.countText.setFontSize("64px");

    if (this.audioManager) this.audioManager.playAnnouncer("ko"); // Or a sad sound

    this.time.delayedCall(2000, async () => {
      await this.transition.transitionTo(
        "MainMenuScene",
        {},
        TransitionPresets.BACK_TO_MENU.type,
        TransitionPresets.BACK_TO_MENU.duration,
        TransitionPresets.BACK_TO_MENU.color,
      );
    });
  }
}
