import "./styles/styles.css";
import "./styles/touch.css";
import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import MainMenuScene from "./scenes/MainMenuScene";
import CharacterSelectScene from "./scenes/CharacterSelectScene";
import ArenaSelectScene from "./scenes/ArenaSelectScene";
import FightScene from "./scenes/FightScene";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    CharacterSelectScene,
    ArenaSelectScene,
    FightScene,
  ],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
