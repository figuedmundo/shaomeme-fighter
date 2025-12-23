import ConfigManager from "../config/ConfigManager";
import { TransitionPresets } from "../utils/SceneTransition";
import gameData from "../config/gameData.json";

export default class VictorySlideshow {
  constructor(scene) {
    this.scene = scene;
    this.overlay = null;
    this.photos = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.heartIntervalId = null;
    this.audioManager = scene.registry.get("audioManager");

    // Config check
    this.cinematicMode = gameData.cinematicMode !== false;
  }

  async show(city) {
    // 1. Fetch Photos
    try {
      const res = await fetch(`/api/photos?city=${city}`);
      if (res.ok) {
        const allPhotos = await res.json();
        // EXCLUDE the arena background from the reward slideshow
        this.photos = allPhotos.filter((p) => !p.isBackground);
        console.log(
          `VictorySlideshow: Found ${allPhotos.length} total photos, using ${this.photos.length} as rewards (excluded background).`,
        );
      } else {
        console.warn("Failed to fetch photos");
      }
    } catch (e) {
      console.error("Error fetching photos:", e);
    }

    // 2. Create UI
    this.createOverlay();

    // 3. Start Slideshow
    if (this.photos.length > 0) {
      this.startSlideshow();
    } else {
      this.showFallback();
    }

    // 4. Audio Switch
    this.handleAudio(city);
  }

  createOverlay() {
    // Create Overlay Container
    this.overlay = document.createElement("div");
    this.overlay.className = "victory-overlay";

    // Heart Spawner Listener
    this.overlay.addEventListener("click", (e) => {
      // Only spawn if click is on overlay/background, not buttons
      if (!e.target.closest("button")) {
        this.spawnHeart(e.clientX, e.clientY);
      }
    });

    // Background Container (Blurred)
    this.bgElement = document.createElement("img");
    this.bgElement.className = "blurred-background";
    this.bgElement.alt = "";
    this.overlay.appendChild(this.bgElement);

    // Cinematic Overlay
    if (this.cinematicMode) {
      const cinematic = document.createElement("div");
      cinematic.className = "cinematic-overlay";
      this.overlay.appendChild(cinematic);
    }

    // Heart Container
    this.heartContainer = document.createElement("div");
    this.heartContainer.className = "heart-container";
    this.overlay.appendChild(this.heartContainer);

    // Add Title
    const title = document.createElement("h1");
    title.className = "victory-title";
    title.innerText = "VICTORY";
    this.overlay.appendChild(title);

    // Image Container
    const imgContainer = document.createElement("div");
    imgContainer.className = "victory-image-container";

    // Polaroid Frame
    const polaroidFrame = document.createElement("div");
    polaroidFrame.className = "polaroid-frame";

    // Image Element
    this.imgElement = document.createElement("img");
    this.imgElement.className = "victory-image cinematic-filter";
    this.imgElement.alt = "Memory";

    polaroidFrame.appendChild(this.imgElement);
    imgContainer.appendChild(polaroidFrame);

    // Smoke Border (Keeping existing visual element)
    const smokeBorder = document.createElement("div");
    smokeBorder.className = "smoke-border";
    imgContainer.appendChild(smokeBorder);

    this.overlay.appendChild(imgContainer);

    // Exit Button
    const exitBtn = document.createElement("button");
    exitBtn.className = "victory-close";
    exitBtn.innerText = "EXIT >";
    exitBtn.onclick = (e) => {
      e.stopPropagation();
      this.exit();
    };
    this.overlay.appendChild(exitBtn);

    document.body.appendChild(this.overlay);

    // Start Heart Auto-Spawn
    this.heartIntervalId = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight; // Start from bottom
      this.spawnHeart(x, y);
    }, 2000); // Every 2 seconds
  }

  startSlideshow() {
    this.currentIndex = 0;
    this.showPhoto(this.currentIndex);

    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
      this.showPhoto(this.currentIndex);
    }, 5000);
  }

  showPhoto(index) {
    if (!this.imgElement || !this.photos[index]) return;

    const photoUrl = this.photos[index].url;

    // Fade Out
    this.imgElement.style.opacity = 0;
    if (this.bgElement) this.bgElement.style.opacity = 0;

    setTimeout(() => {
      // Update Source
      this.imgElement.src = photoUrl;
      if (this.bgElement) this.bgElement.src = photoUrl;

      // Random Ken Burns Effect
      this.imgElement.classList.remove("ken-burns-active");
      const _triggerReflow = this.imgElement.offsetWidth;
      this.imgElement.classList.add("ken-burns-active");

      // Removed random polaroid rotation per user request

      // Fade In
      this.imgElement.style.opacity = 1;
      if (this.bgElement) this.bgElement.style.opacity = 1;
    }, 200);
  }

  spawnHeart(x, y) {
    if (!this.heartContainer) return;

    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    this.heartContainer.appendChild(heart);

    // Cleanup after animation
    setTimeout(() => {
      if (this.heartContainer && this.heartContainer.contains(heart)) {
        this.heartContainer.removeChild(heart);
      }
    }, 3000);
  }

  showFallback() {
    if (this.imgElement) {
      this.imgElement.style.display = "none";
    }
    const msg = document.createElement("p");
    msg.className = "victory-fallback-msg";
    msg.innerText = "No memories found for this location yet.";
    msg.style.color = "white";
    this.overlay.appendChild(msg);
  }

  handleAudio(city) {
    if (!this.audioManager) return;

    const trackKey = ConfigManager.getVictoryMusicForCity(city);
    this.audioManager.playMusic(trackKey, { loop: true, volume: 0.5 });
  }

  async exit() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.heartIntervalId) clearInterval(this.heartIntervalId);

    if (this.audioManager) {
      this.audioManager.stopMusic(500);
    }
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
    }

    if (this.scene._transition) {
      await this.scene._transition.transitionTo(
        "MainMenuScene",
        {},
        TransitionPresets.BACK_TO_MENU.type,
        TransitionPresets.BACK_TO_MENU.duration,
        TransitionPresets.BACK_TO_MENU.color,
      );
    } else {
      this.scene.scene.start("MainMenuScene");
    }
  }
}
