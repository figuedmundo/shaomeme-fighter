import Phaser from "phaser";
import BootScene from "../scenes/BootScene";
import MainMenuScene from "../scenes/MainMenuScene";
import WorldMapScene from "../scenes/WorldMapScene";
import FightScene from "../scenes/FightScene";

const gameConfig = {
  type: Phaser.AUTO,
  width: 1024, // Base resolution, will scale
  height: 768,
  backgroundColor: "#2d2d2d",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Top-down/Side-scroller hybrid usually 0 or simulated manually for beat-em-up
      debug: false,
    },
  },
  scene: [BootScene, MainMenuScene, WorldMapScene, FightScene],
};

export default gameConfig;
