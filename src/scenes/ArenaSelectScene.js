import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";
import { addTransitions, TransitionPresets } from "../utils/SceneTransition";
import rosterConfig from "../config/rosterConfig";
import gameData from "../config/gameData.json";

const logger = new UnifiedLogger("Frontend:ArenaSelectScene");

export default class ArenaSelectScene extends Phaser.Scene {
  constructor(config = {}) {
    super("ArenaSelectScene");
    this.arenas = [];
    this.selectedArenaIndex = 0;
    this.thumbnails = [];
    this.playerCharacter = null;
    this.transition = config.transitionManager;
    this._transitionOverride = config.transitionManager;
  }

  init(data) {
    if (data && data.playerCharacter) {
      this.playerCharacter = data.playerCharacter;
    }
    if (data && data.opponentCharacter) {
      this.opponentCharacter = data.opponentCharacter;
    }
  }

  preload() {
    // Preload a default placeholder or UI assets if needed
    // The dynamic arena images will be loaded on the fly or in 'create'
    this.load.image("placeholder", "/assets/images/backgrounds/main-bg.jpg"); // Fallback to existing file
  }

  create() {
    const { width, height } = this.scale;

    // Initialize transition system if not overridden
    if (!this.transition) {
      this.transition = addTransitions(this);
    }

    // Fade in from previous transition
    this.transition.fadeIn(300);

    // Get AudioManager
    this.audioManager = this.registry.get("audioManager");
    if (this.audioManager) {
      this.audioManager.updateScene(this);
    }

    // 1. Hero Background (Full Screen)
    // Initialize with black or a default until data loads
    this.heroBackground = this.add
      .image(width / 2, height / 2, "placeholder")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Apply Cinematic Filter (Sepia + Contrast)
    if (this.heroBackground.preFX) {
      this.heroBackground.preFX.addColorMatrix().sepia(0.3);
      this.heroBackground.preFX.addColorMatrix().contrast(1.2);
    }

    // Add a dark gradient/overlay at the bottom for the grid readability
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(
      0x000000,
      0x000000,
      0x000000,
      0x000000,
      0,
      0,
      0.8,
      0.8,
    );
    gradient.fillRect(0, height * 0.6, width, height * 0.4);

    // 2. Title Text
    this.titleText = this.add
      .text(width / 2, height * 0.1, "LOADING...", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px", // Reduced size for pixel font
        color: "#ffd700",
        stroke: "#880000",
        strokeThickness: 6,
        shadow: { blur: 0, color: "#000000", fill: true },
      })
      .setOrigin(0.5);

    // 3. Loading Indicator
    this.loadingText = this.add
      .text(width / 2, height / 2, "Fetching Arenas...", {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // 4. Back Button
    this.add
      .text(50, 50, "< BACK", {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 10 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", async () => {
        if (this.audioManager) this.audioManager.playUi("ui_select");

        // Horizontal wipe left to go back
        await this.transition.wipeHorizontal(500, 0x000000, "left");
        this.scene.start("CharacterSelectScene");
      });

    // 5. Fight Button (Confirm)
    this.fightBtn = this.add
      .text(width - 150, height - 100, "FIGHT >", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        fill: "#ffd700", // Gold
        backgroundColor: "#330000",
        padding: { x: 20, y: 10 },
        stroke: "#ffd700",
        strokeThickness: 0, // Pixel fonts don't need heavy stroke usually
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false) // Hide until loaded
      .on("pointerdown", () => {
        if (this.audioManager) this.audioManager.playUi("ui_select");
        this.confirmSelection();
      });

    // Start Fetching Data
    this.fetchArenas();
  }

  async fetchArenas() {
    try {
      const apiBase = ""; // Use relative paths, Vite will proxy to :3000 in dev

      // Fetch Cities (now returns { name, photoCount })
      const citiesRes = await fetch(`${apiBase}/api/cities`);
      if (!citiesRes.ok) throw new Error("Failed to fetch cities");
      const cities = await citiesRes.json();

      // Fetch one photo for each city to use as preview
      const arenaPromises = cities.map(async (cityObj) => {
        // Handle backwards compatibility if API returns strings
        const cityName = typeof cityObj === "string" ? cityObj : cityObj.name;
        const photoCount = typeof cityObj === "string" ? 1 : cityObj.photoCount;

        try {
          logger.debug(`Fetching photos for city: ${cityName}`);
          const photosRes = await fetch(
            `${apiBase}/api/photos?city=${cityName}`,
          );
          const data = await photosRes.json();
          // Handle both new object structure and legacy array structure
          const photos = Array.isArray(data) ? data : data.photos || [];

          if (photos && photos.length > 0) {
            // Find the background image if it exists, otherwise use the first one
            const bgPhoto = photos.find((p) => p.isBackground) || photos[0];

            logger.debug(
              `Found ${photos.length} photos for ${cityName}. Using ${bgPhoto.filename} as preview.`,
            );
            return {
              name: cityName,
              url: `${apiBase}${bgPhoto.url}`,
              photoCount,
            };
          }
          // If photoCount is 0 but we have a background via API (unlikely but possible if logic differs)
          // or if we decide to show it anyway (we need a url)
          // If no photos, we can't show preview unless we have a fallback or specific logic
          // For now returning null if no images found at all

          logger.warn(`No photos found for city: ${cityName}`);
        } catch (e) {
          logger.error(`Failed to fetch photos for ${cityName}`, e);
        }
        return null;
      });

      const results = await Promise.all(arenaPromises);
      const validArenas = results.filter((a) => a !== null);
      logger.info(`Loaded ${validArenas.length} valid arenas`);

      // Sort arenas based on order in gameData.json
      if (gameData && gameData.arenas) {
        const orderedKeys = Object.keys(gameData.arenas);
        validArenas.sort((a, b) => {
          const indexA = orderedKeys.indexOf(a.name.toLowerCase());
          const indexB = orderedKeys.indexOf(b.name.toLowerCase());

          // If both found in config, sort by config order
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          // If only A found, it comes first
          if (indexA !== -1) return -1;
          // If only B found, it comes first
          if (indexB !== -1) return 1;
          // If neither found, sort alphabetically
          return a.name.localeCompare(b.name);
        });
        logger.debug("Sorted arenas based on gameData configuration");
      }

      this.arenas = validArenas;

      if (this.arenas.length > 0) {
        this.loadArenaImages();
      } else {
        this.loadingText.setText("No Arenas Found.");
      }
    } catch (err) {
      logger.error("Arena fetch flow failed:", err);
      // Fallback to default arena so the game is still playable
      logger.warn("Falling back to default arena.");
      this.arenas = [
        {
          name: "Training Ground",
          url: "resources/combat-arena.png", // Use the local resource directly
          photoCount: 1,
        },
      ];
      this.loadArenaImages();
    }
  }

  loadArenaImages() {
    logger.info("Loading arena textures into Phaser...");
    this.loadingText.setText("Loading Images...");

    // Load images into Phaser Texture Manager
    this.arenas.forEach((arena, index) => {
      const key = `arena_bg_${index}`;
      logger.debug(`Queuing texture: ${key} -> ${arena.url}`);
      this.load.image(key, arena.url);
    });

    this.load.once("complete", () => {
      logger.info("Arena textures load complete");
      this.loadingText.setVisible(false);
      this.buildGrid();
      this.selectArena(0); // Select first one
      this.fightBtn.setVisible(true);
    });

    this.load.start();
  }

  buildGrid() {
    const { width, height } = this.scale;
    const thumbnailWidth = 200;
    const thumbnailHeight = 120;
    const gap = 20;

    // Calculate Grid Layout (3 Rows)
    const itemsPerRow = Math.ceil(this.arenas.length / 3);
    const totalRowWidth = itemsPerRow * (thumbnailWidth + gap) - gap;
    const startX = width / 2 - totalRowWidth / 2 + thumbnailWidth / 2;
    // Move grid higher to accommodate 3 larger rows (Total height ~400px)
    const startY = height - 480;

    this.arenas.forEach((arena, index) => {
      const key = `arena_bg_${index}`;

      // Calculate Grid Position
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const xPos = startX + col * (thumbnailWidth + gap);
      const yPos = startY + row * (thumbnailHeight + gap);

      // Thumbnail Image
      const thumb = this.add
        .image(xPos, yPos, key)
        .setDisplaySize(thumbnailWidth, thumbnailHeight)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          if (this.audioManager) this.audioManager.playUi("ui_move");
          this.selectArena(index);
        });

      // Border (initially invisible or grey)
      const border = this.add
        .rectangle(xPos, yPos, thumbnailWidth + 8, thumbnailHeight + 8)
        .setStrokeStyle(4, 0x333333)
        .setFillStyle(); // Transparent fill

      // Lock Visuals (if photoCount === 0)
      let lockContainer = null;
      if (arena.photoCount === 0) {
        // Apply Grayscale
        if (thumb.preFX) {
          thumb.preFX.addColorMatrix().grayscale(1.0);
        } else {
          thumb.setTint(0x555555); // Fallback if FX not supported/enabled
        }

        // Create "Coming Soon" Stamp
        lockContainer = this.add.container(xPos, yPos);

        // Stamp Graphics (Border)
        const stampGraphics = this.add.graphics();
        stampGraphics.lineStyle(4, 0xff0000, 1); // Red thick border
        stampGraphics.strokeRoundedRect(
          -thumbnailWidth / 2 + 10,
          -20,
          thumbnailWidth - 20,
          40,
          8,
        );

        // Stamp Text
        const stampText = this.add
          .text(0, 0, "COMING SOON", {
            fontFamily: '"Press Start 2P"',
            fontSize: "14px",
            color: "#ff0000",
            align: "center",
          })
          .setOrigin(0.5);

        lockContainer.add([stampGraphics, stampText]);
        lockContainer.setAngle(-10); // Angled
      }

      this.thumbnails.push({ img: thumb, border, lockContainer });
    });
  }

  selectArena(index) {
    if (index < 0 || index >= this.arenas.length) return;

    this.selectedArenaIndex = index;
    const arena = this.arenas[index];
    const key = `arena_bg_${index}`;

    // Update Hero Background
    this.heroBackground.setTexture(key);
    // Maintain aspect ratio cover or fit?
    // For hero background, we usually want 'cover'.
    // Phaser setDisplaySize stretches. Let's force stretch for now or implement cover logic.
    this.heroBackground.setDisplaySize(this.scale.width, this.scale.height);

    // Update Title
    this.titleText.setText(arena.name.toUpperCase());

    // Update Highlights
    this.thumbnails.forEach((t, i) => {
      if (i === index) {
        t.border.setStrokeStyle(4, 0xffd700); // Gold for selected
      } else {
        t.border.setStrokeStyle(4, 0x333333); // Dark grey for others
      }
    });

    // Handle Lock State
    if (arena.photoCount === 0) {
      this.fightBtn.setVisible(false);
    } else {
      this.fightBtn.setVisible(true);
      this.fightBtn.setInteractive({ useHandCursor: true });
    }
  }

  async confirmSelection() {
    const arena = this.arenas[this.selectedArenaIndex];

    // Double check lock
    if (arena.photoCount === 0) {
      if (this.audioManager) this.audioManager.playUi("ui_cancel"); // Error sound
      return;
    }

    // Disable button
    this.fightBtn.disableInteractive();

    // Determine Opponent
    // If passed from CharacterSelect, use it. Otherwise (fallback), pick random.
    let { opponentCharacter } = this;
    if (!opponentCharacter) {
      const availableOpponents = rosterConfig.filter(
        (c) => c.id !== this.playerCharacter,
      );
      const randomOpponent =
        availableOpponents[
          Math.floor(Math.random() * availableOpponents.length)
        ];
      opponentCharacter = randomOpponent
        ? randomOpponent.id
        : rosterConfig[0].id;
    }

    // Transition to LoadingScene (JIT Loading)
    // Pass 'player1' and 'player2' keys for the loader to recognize
    await this.transition.transitionTo(
      "LoadingScene",
      {
        targetScene: "FightScene",
        targetData: {
          city: arena.name,
          backgroundUrl: arena.url,
          backgroundKey: `arena_bg_${this.selectedArenaIndex}`,
          playerCharacter: this.playerCharacter,
          opponentCharacter,
          player1: this.playerCharacter, // For LoadingScene loader
          player2: opponentCharacter, // For LoadingScene loader
        },
      },
      TransitionPresets.ARENA_TO_FIGHT.type,
      TransitionPresets.ARENA_TO_FIGHT.duration,
      TransitionPresets.ARENA_TO_FIGHT.color,
    );
  }

  shutdown() {
    if (this.transition) {
      this.transition.destroy();
    }

    // Aggressive Memory Cleanup
    // Unload all arena background textures
    this.arenas.forEach((_, index) => {
      const key = `arena_bg_${index}`;
      if (this.textures.exists(key)) {
        this.textures.remove(key);
      }
    });
    logger.debug(`Cleaned up ${this.arenas.length} arena textures`);
  }
}
