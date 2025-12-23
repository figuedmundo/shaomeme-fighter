import ConfigManager from "../config/ConfigManager";
import { TransitionPresets } from "../utils/SceneTransition";
import gameData from "../config/gameData.json";

export default class VictorySlideshow {
  constructor(scene) {
    this.scene = scene;
    this.overlay = null;
    this.photos = [];
    this.currentIndex = 0;
    this.slideshowTimeout = null;
    this.heartIntervalId = null;
    this.audioManager = scene.registry.get("audioManager");

    // Config check
    this.cinematicMode = gameData.cinematicMode !== false;
  }

  async show(city) {
    this.currentCity = city;
    // 1. Fetch Photos
    try {
      const res = await fetch(`/api/photos?city=${city}`);
      if (res.ok) {
        const allPhotos = await res.json();
        this.photos = allPhotos.filter((p) => !p.isBackground);
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
    this.overlay = document.createElement("div");
    this.overlay.className = "victory-overlay";

    this.overlay.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        this.spawnHeart(e.clientX, e.clientY);
      }
    });

    this.bgElement = document.createElement("img");
    this.bgElement.className = "blurred-background";
    this.bgElement.alt = "";
    this.overlay.appendChild(this.bgElement);

    if (this.cinematicMode) {
      const cinematic = document.createElement("div");
      cinematic.className = "cinematic-overlay";
      this.overlay.appendChild(cinematic);
    }

    this.heartContainer = document.createElement("div");
    this.heartContainer.className = "heart-container";
    this.overlay.appendChild(this.heartContainer);

    const imgContainer = document.createElement("div");
    imgContainer.className = "victory-image-container";

    this.polaroidFrame = document.createElement("div");
    this.polaroidFrame.className = "polaroid-frame";

    this.imgElement = document.createElement("img");
    this.imgElement.className = "victory-image cinematic-filter";
    this.imgElement.alt = "Memory";

    this.polaroidFrame.appendChild(this.imgElement);

    // Date Element
    this.dateElement = document.createElement("div");
    this.dateElement.className = "polaroid-date";
    this.polaroidFrame.appendChild(this.dateElement);

    imgContainer.appendChild(this.polaroidFrame);

    const smokeBorder = document.createElement("div");
    smokeBorder.className = "smoke-border";
    imgContainer.appendChild(smokeBorder);

    this.overlay.appendChild(imgContainer);

    const exitBtn = document.createElement("button");
    exitBtn.className = "victory-close";
    exitBtn.innerText = "✕";
    exitBtn.onclick = (e) => {
      e.stopPropagation();
      this.exit();
    };
    this.overlay.appendChild(exitBtn);

    document.body.appendChild(this.overlay);

    this.heartIntervalId = setInterval(() => {
      if (this.polaroidFrame) {
        const rect = this.polaroidFrame.getBoundingClientRect();
        // Spawn randomly within the polaroid frame
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        this.spawnHeart(x, y);
      }
    }, 800); // Increased frequency slightly for better effect
  }

  startSlideshow() {
    this.currentIndex = 0;
    this.showPhoto(this.currentIndex);
  }

  nextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.showPhoto(this.currentIndex);
  }

  showPhoto(index) {
    if (!this.imgElement || !this.photos[index]) return;

    const photoUrl = this.photos[index].url;
    // Use date from photo, or fallback to Arena Name (Capitalized)
    const photoDate =
      this.photos[index].date || this.capitalize(this.currentCity);

    // Fade Out
    this.imgElement.style.opacity = 0;
    if (this.dateElement) this.dateElement.style.opacity = 0;
    if (this.bgElement) this.bgElement.style.opacity = 0;

    if (this.slideshowTimeout) clearTimeout(this.slideshowTimeout);

    setTimeout(() => {
      this.imgElement.src = photoUrl;
      if (this.dateElement) this.dateElement.innerText = photoDate;
      if (this.bgElement) this.bgElement.src = photoUrl;

      this.imgElement.onload = () => {
        // Trigger Ken Burns "Shake" on the whole frame
        if (this.polaroidFrame) {
          this.polaroidFrame.classList.remove("ken-burns-active");
          this.polaroidFrame.classList.remove("is-portrait");
          // Trigger reflow for animation restart
          // eslint-disable-next-line no-unused-expressions
          this.polaroidFrame.offsetHeight;
          this.polaroidFrame.classList.add("ken-burns-active");
        }

        const isPortrait = this.isPortrait(this.imgElement);
        if (isPortrait && this.polaroidFrame) {
          this.polaroidFrame.classList.add("is-portrait");
        }

        // Fade In
        this.imgElement.style.opacity = 1;
        if (this.dateElement) this.dateElement.style.opacity = 1;
        if (this.bgElement) this.bgElement.style.opacity = 1;

        this.slideshowTimeout = setTimeout(() => {
          this.nextPhoto();
        }, 5000);
      };
    }, 200);
  }

  isPortrait(img) {
    return img.naturalHeight > img.naturalWidth;
  }

  capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  spawnHeart(x, y) {
    if (!this.heartContainer) return;

    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    this.heartContainer.appendChild(heart);

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
    if (this.slideshowTimeout) clearTimeout(this.slideshowTimeout);
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
