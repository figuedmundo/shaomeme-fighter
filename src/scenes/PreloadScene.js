import Phaser from "phaser";
import rosterConfig from "../config/rosterConfig";
import UnifiedLogger from "../utils/Logger.js";
import AudioManager from "../systems/AudioManager.js";

const logger = new UnifiedLogger("Frontend:PreloadScene");

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    logger.info("PreloadScene: Started loading assets...");
    const { width, height } = this.scale;

    // Create loading text immediately so it can be updated during preload
    this.loadingText = this.add
      .text(width / 2, height / 2, "LOADING... 0%", {
        fontFamily: '"Press Start 2P"',
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // UI Assets
    console.log("PreloadScene: Loading UI assets...");
    this.load.image("logo", "resources/shaomeme_fighter.png");

    // Audio
    console.log("PreloadScene: Loading Audio...");
    // UI Sounds
    this.load.audio("ui_select", "resources/attack1.mp3"); // Using attack1 as placeholder for select
    this.load.audio("ui_move", "resources/attack2.mp3"); // Using attack2 as placeholder for move
    this.load.audio("ui_back", "resources/attack3.mp3"); // Using attack3 as placeholder for back

    // Music
    this.load.audio("menu_music", "resources/soundtrack_walking_on_cars.mp3");
    this.load.audio("select_music", "resources/vs.mp3");
    this.load.audio("arena", "resources/arena.mp3");

    this.load.audio("KO", "resources/KO.mp3");

    // Combat Sounds - Impact variations (punch/kick)
    this.load.audio("attack1", "resources/attack1.mp3");
    this.load.audio("attack2", "resources/attack2.mp3");
    this.load.audio("attack3", "resources/attack3.mp3");
    this.load.audio("attack4", "resources/attack4.mp3");
    this.load.audio("attack5", "resources/attack5.mp3");

    // Announcer Sounds
    console.log("PreloadScene: Loading Announcer Audio...");
    const announcerPath = "resources/audio/announcer/";

    // Rounds
    this.load.audio("round_1", `${announcerPath}round_1.mp3`);
    // Using round_1 as placeholder for 2/3 for now to ensure load success,
    // real files should be added later
    this.load.audio("round_2", `${announcerPath}round_1.mp3`);
    this.load.audio("round_3", `${announcerPath}round_1.mp3`);
    this.load.audio("final_round", `${announcerPath}final_round.mp3`);

    // Fight
    this.load.audio("fight", `${announcerPath}the-batle-has-begun-fight.mp3`); // Or round-1-fight_1.mp3

    // Results
    this.load.audio("you_win", `${announcerPath}flawless_victory.mp3`); // Placeholder logic: Flawless is good enough for win
    this.load.audio("you_lose", `${announcerPath}you-loose.mp3`);
    this.load.audio("perfect", `${announcerPath}perfect.mp3`);

    // Combo
    this.load.audio("combo_3", `${announcerPath}combo_3.mp3`);
    this.load.audio("combo_5", `${announcerPath}dominating.mp3`);
    this.load.audio("combo_ultra", `${announcerPath}ultra-kill.mp3`);

    // Characters
    // Using specific mappings where available, placeholders for others
    this.load.audio("announcer_dad", `${announcerPath}dad.mp3`);
    this.load.audio("announcer_mom", `${announcerPath}mom.mp3`);
    this.load.audio("announcer_old_witch", `${announcerPath}the-witch.mp3`);
    this.load.audio("announcer_fresway_worker", `${announcerPath}worker.mp3`);

    // Placeholders for missing characters
    this.load.audio("announcer_ann", `${announcerPath}laugh.mp3`);
    this.load.audio("announcer_brother", `${announcerPath}laugh.mp3`);
    this.load.audio("announcer_fat", `${announcerPath}laugh.mp3`);
    this.load.audio("announcer_ken", `${announcerPath}laugh.mp3`);
    this.load.audio("announcer_ryu", `${announcerPath}laugh.mp3`);

    // TODO: Add whoosh sounds (air-cutting)
    // TODO: Add grunt sounds (effort)
    // TODO: Add hit reaction sounds
    // TODO: Add block sounds

    // Load All Fighter Spritesheets from Roster
    console.log("PreloadScene: Loading Fighter spritesheets...");
    rosterConfig.forEach((char) => {
      console.log(`PreloadScene: Loading spritesheet for ${char.id}`);
      this.load.spritesheet(
        char.id,
        `assets/fighters/${char.id}/${char.id}.png`,
        {
          frameWidth: 100,
          frameHeight: 200,
        },
      );
    });

    // Also load Ryu and Ken as defaults/fallback
    this.load.spritesheet("ryu", "assets/fighters/ryu/ryu.png", {
      frameWidth: 100,
      frameHeight: 200,
    });
    this.load.spritesheet("ken", "assets/fighters/ken/ken.png", {
      frameWidth: 100,
      frameHeight: 200,
    });

    // Handle loading events
    this.load.on("filecomplete", (key) => {
      console.log(`PreloadScene: File complete: ${key}`);
    });

    this.load.on("loaderror", (file) => {
      console.error(`PreloadScene: Error loading file: ${file.key}`, file);
    });

    this.load.on("progress", (value) => {
      if (this.loadingText) {
        this.loadingText.setText(`LOADING... ${Math.floor(value * 100)}%`);
      }
    });

    this.load.on("complete", () => {
      console.log("PreloadScene: Asset load complete.");
      logger.info("PreloadScene: Asset load complete.");

      // Initialize global AudioManager and store in registry
      const audioManager = new AudioManager(this);
      audioManager.init();
      this.registry.set("audioManager", audioManager);
      logger.info("AudioManager initialized and stored in registry");

      // Small delay for smooth transition
      this.time.delayedCall(500, () => {
        console.log("PreloadScene: Transitioning to MainMenuScene...");
        this.scene.start("MainMenuScene");
      });
    });
  }

  create() {
    const { width, height } = this.scale;
    // Show new logo during preload/transition
    const logo = this.add.image(width / 2, height * 0.3, "logo");
    const maxWidth = width * 0.6;
    if (logo.width > maxWidth) {
      logo.setDisplaySize(maxWidth, (maxWidth / logo.width) * logo.height);
    }

    if (this.loadingText) {
      this.loadingText.setY(height * 0.7).setText("LOAD COMPLETE!");
    }
  }
}
