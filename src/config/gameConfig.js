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
      gravity: { y: 1000 },
      debug: true,
    },
  },
  scene: [BootScene, MainMenuScene, WorldMapScene, FightScene],
};

export default gameConfig;
