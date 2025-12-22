import "./styles/styles.css";
import "./styles/touch.css";
import "./styles/overlays.css";
import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import LoadingScene from "./scenes/LoadingScene";
import PreloadScene from "./scenes/PreloadScene";
import SplashScene from "./scenes/SplashScene";
import MainMenuScene from "./scenes/MainMenuScene";
import CharacterSelectScene from "./scenes/CharacterSelectScene";
import ArenaSelectScene from "./scenes/ArenaSelectScene";
import FightScene from "./scenes/FightScene";
import VictoryScene from "./scenes/VictoryScene";
import ContinueScene from "./scenes/ContinueScene";
import CreditsScene from "./scenes/CreditsScene";
import PauseScene from "./scenes/PauseScene";
import TutorialOverlayScene from "./scenes/TutorialOverlayScene";
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
    LoadingScene,
    PreloadScene,
    SplashScene,
    StageEffectsTestScene, // Add this for testing Phase 3.1 effects
    MainMenuScene,
    CreditsScene,
    CharacterSelectScene,
    ArenaSelectScene,
    FightScene,
    VictoryScene,
    ContinueScene,
    PauseScene,
    TutorialOverlayScene,
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
