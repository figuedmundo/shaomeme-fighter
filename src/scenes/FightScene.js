import Phaser from "phaser";

export default class FightScene extends Phaser.Scene {
  constructor() {
    super("FightScene");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#000033"); // Dark blue background

    this.add
      .text(width / 2, height / 2, "FIGHT!", {
        fontSize: "96px",
        fill: "#ff0000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }
}
