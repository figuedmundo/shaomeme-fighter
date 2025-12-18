import Phaser from "phaser";

export default class AnnouncerOverlay {
  constructor(scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    const { width, height } = this.scene.scale;

    // Setup shared text style
    this.style = {
      fontFamily: '"Mortal Kombat 4", Impact, sans-serif',
      fontSize: "120px",
      fill: "#ffcc00", // Gold-ish
      stroke: "#000000",
      strokeThickness: 8,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: "#000000",
        blur: 4,
        stroke: true,
        fill: true,
      },
      align: "center",
    };

    // Main center text (ROUND, FIGHT, KO)
    this.centerText = this.scene.add
      .text(width / 2, height / 2, "", this.style)
      .setOrigin(0.5)
      .setDepth(1000)
      .setAlpha(0)
      .setVisible(false);

    // Secondary text (Subtitles or WINNER)
    this.subText = this.scene.add
      .text(width / 2, height / 2 + 100, "", {
        ...this.style,
        fontSize: "80px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setAlpha(0)
      .setVisible(false);
  }

  showRound(num) {
    this.centerText
      .setText(`ROUND ${num}`)
      .setScale(1.5)
      .setAlpha(0)
      .setVisible(true);

    // Pop in animation
    this.scene.tweens.add({
      targets: this.centerText,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.out",
    });
  }

  showFight() {
    this.centerText
      .setText("FIGHT!")
      .setScale(2)
      .setAlpha(1) // Assuming it transitions from Round
      .setVisible(true);

    this.scene.tweens.add({
      targets: this.centerText,
      scale: 1,
      duration: 200,
      ease: "Bounce.out",
      onComplete: () => {
        // Fade out after a moment
        this.scene.tweens.add({
          targets: this.centerText,
          alpha: 0,
          duration: 500,
          delay: 500,
          onComplete: () => {
            this.centerText.setVisible(false);
          },
        });
      },
    });
  }

  showKO() {
    this.centerText.setText("K.O.").setScale(3).setAlpha(0).setVisible(true);

    this.scene.tweens.add({
      targets: this.centerText,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: "Back.out",
    });
  }

  showWin(name) {
    // Hide KO text if still visible
    this.centerText.setVisible(false);

    // Reuse center text for "YOU WIN" or specific name
    // Requirement says "YOU WIN" overlay usually
    const text = name ? `${name.toUpperCase()} WINS` : "YOU WIN";

    this.centerText.setText(text).setScale(1.5).setAlpha(0).setVisible(true);

    this.scene.tweens.add({
      targets: this.centerText,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: "Power2",
    });
  }

  hideAll() {
    this.centerText.setVisible(false);
    this.subText.setVisible(false);
  }
}
