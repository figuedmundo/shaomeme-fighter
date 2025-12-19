import "./styles/styles.css";
import "./styles/touch.css";
import "./styles/overlays.css";
import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import MainMenuScene from "./scenes/MainMenuScene";
import CharacterSelectScene from "./scenes/CharacterSelectScene";
import ArenaSelectScene from "./scenes/ArenaSelectScene";
import FightScene from "./scenes/FightScene";
import StageEffectsTestScene from "./scenes/StageEffectsTestScene";

console.log("index.js: Imports complete");

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: false,
    },
  },
  input: {
    activePointers: 3,
  },
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    expandParent: true,
    orientation: Phaser.Scale.LANDSCAPE,
  },
  scene: [
    BootScene,
    PreloadScene,
    StageEffectsTestScene, // Add this for testing Phase 3.1 effects
    MainMenuScene,
    CharacterSelectScene,
    ArenaSelectScene,
    FightScene,
  ],
};

console.log("index.js: Initializing Phaser Game with config:", config);
try {
  // eslint-disable-next-line no-new
  const game = new Phaser.Game(config);
  console.log("index.js: Phaser Game Instance created:", game);
} catch (error) {
  console.error("index.js: CRITICAL ERROR during Game creation:", error);
}
