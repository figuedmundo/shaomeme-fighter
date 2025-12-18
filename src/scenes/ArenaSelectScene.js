import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:ArenaSelectScene");

export default class ArenaSelectScene extends Phaser.Scene {
  constructor() {
    super("ArenaSelectScene");
    this.arenas = [];
    this.selectedArenaIndex = 0;
    this.thumbnails = [];
    this.playerCharacter = null;
  }

  init(data) {
    if (data && data.playerCharacter) {
      this.playerCharacter = data.playerCharacter;
    }
  }

  preload() {
    // Preload a default placeholder or UI assets if needed
    // The dynamic arena images will be loaded on the fly or in 'create'
    this.load.image("placeholder", "resources/combat-arena.png"); // Fallback
  }

  create() {
    const { width, height } = this.scale;

    // Get AudioManager
    this.audioManager = this.registry.get("audioManager");

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
    const backBtn = this.add
      .text(50, 50, "< BACK", {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 10 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.audioManager) this.audioManager.playUi("ui_select");
        this.scene.start("MainMenuScene");
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

      // Fetch Cities
      const citiesRes = await fetch(`${apiBase}/api/cities`);
      if (!citiesRes.ok) throw new Error("Failed to fetch cities");
      const cities = await citiesRes.json();

      // Fetch one photo for each city to use as preview
      const arenaPromises = cities.map(async (city) => {
        try {
          logger.debug(`Fetching photos for city: ${city}`);
          const photosRes = await fetch(`${apiBase}/api/photos?city=${city}`);
          const photos = await photosRes.json();
          if (photos && photos.length > 0) {
            logger.debug(
              `Found ${photos.length} photos for ${city}. Using first as preview.`,
            );
            // Construct full URL. The API returns relative URL like '/cache/...'
            // We need to prepend base if not on same origin, but usually handled by proxy or same origin.
            // For now assuming localhost dev environment or same origin serving.
            return {
              name: city,
              url: `${apiBase}${photos[0].url}`,
            };
          }
          logger.warn(`No photos found for city: ${city}`);
        } catch (e) {
          logger.error(`Failed to fetch photos for ${city}`, e);
        }
        return null;
      });

      const results = await Promise.all(arenaPromises);
      this.arenas = results.filter((a) => a !== null);
      logger.info(`Loaded ${this.arenas.length} valid arenas`);

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
    const startX =
      width / 2 -
      (this.arenas.length * (thumbnailWidth + gap)) / 2 +
      thumbnailWidth / 2;
    const yPos = height - 200;

    this.arenas.forEach((arena, index) => {
      const key = `arena_bg_${index}`;

      // Thumbnail Image
      const thumb = this.add
        .image(startX + index * (thumbnailWidth + gap), yPos, key)
        .setDisplaySize(thumbnailWidth, thumbnailHeight)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          if (this.audioManager) this.audioManager.playUi("ui_move");
          this.selectArena(index);
        });

      // Border (initially invisible or grey)
      const border = this.add
        .rectangle(
          startX + index * (thumbnailWidth + gap),
          yPos,
          thumbnailWidth + 8,
          thumbnailHeight + 8,
        )
        .setStrokeStyle(4, 0x333333)
        .setFillStyle(); // Transparent fill

      this.thumbnails.push({ img: thumb, border });
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
  }

  confirmSelection() {
    const arena = this.arenas[this.selectedArenaIndex];
    this.scene.start("FightScene", {
      city: arena.name,
      backgroundUrl: arena.url,
      // Pass the preloaded texture key so FightScene doesn't have to fetch it again if possible,
      // OR FightScene can rely on the cache since we loaded it here.
      backgroundKey: `arena_bg_${this.selectedArenaIndex}`,
      playerCharacter: this.playerCharacter,
    });
  }
}
