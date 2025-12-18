import Phaser from "phaser";

export default class ComboOverlay {
  constructor(scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    // Placement: Left side (P1) or Right side (P2)?
    // For now, let's put it on the side of the attacker.
    // But simpler: just generic combo counter on left/right depending on who hits?
    // Requirement: "Display X HIT COMBO text on screen".
    // Let's make a single shared overlay that moves or fixed position.
    // Most fighting games have one per player.
    // For simplicity: One overlay that shows "X HITS" on the side of the active combo.

    const { width, height } = this.scene.scale;

    this.style = {
      fontFamily: '"Mortal Kombat 4", Impact, sans-serif',
      fontSize: "60px",
      fill: "#ff0000", // Red for combo
      stroke: "#ffffff",
      strokeThickness: 4,
      align: "center",
      fontStyle: "italic",
    };

    // Container to hold text
    this.container = this.scene.add
      .container(0, 0)
      .setDepth(900)
      .setVisible(false);

    this.comboText = this.scene.add
      .text(0, 0, "2 HITS", this.style)
      .setOrigin(0, 0.5);
    this.milestoneText = this.scene.add
      .text(0, 60, "", {
        ...this.style,
        fontSize: "40px",
        fill: "#ffff00", // Yellow
      })
      .setOrigin(0, 0.5);

    this.container.add([this.comboText, this.milestoneText]);

    this.hideTimer = null;
  }

  /**
   * Update combo display
   * @param {number} count - Current hit count
   * @param {boolean} isPlayer1 - True if P1 is attacking (combo on P2 side?)
   * Usually combo shows on the VICTIM's side or ATTACKER's side?
   * SF2: Shows on Attacker's side.
   */
  updateCombo(count, isPlayer1 = true) {
    if (count < 2) {
      this.container.setVisible(false);
      return;
    }

    const { width, height } = this.scene.scale;

    // Position: P1 attacks -> Show on Left side? Or P1 side?
    // Let's put it on the side of the screen corresponding to the player.
    // P1 (Left) -> x = 100
    // P2 (Right) -> x = width - 200

    const x = isPlayer1 ? 50 : width - 250;
    const y = height * 0.3;

    this.container.setPosition(x, y);
    this.container.setVisible(true);
    this.container.setAlpha(1);

    this.comboText.setText(`${count} HITS`);
    this.milestoneText.setText(""); // Reset milestone text unless set explicitly

    // Pulse animation
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 50,
      yoyo: true,
      ease: "Quad.out",
    });

    // Reset hide timer
    if (this.hideTimer) this.hideTimer.remove();
    this.hideTimer = this.scene.time.delayedCall(2000, () => {
      this.container.setVisible(false);
    });
  }

  showMilestone(text) {
    this.milestoneText.setText(text);

    // Flash effect
    this.scene.tweens.add({
      targets: this.milestoneText,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 3,
    });
  }
}
