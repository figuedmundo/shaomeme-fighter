import ConfigManager from "../config/ConfigManager";
import gameData from "../config/gameData.json";
import UnifiedLogger from "../utils/Logger";

const logger = new UnifiedLogger("VictorySlideshow");

export default class VictorySlideshow {
  constructor(scene) {
    this.scene = scene;
    this.overlay = null;
    this.photos = [];
    this.currentIndex = 0;
    this.slideshowTimeout = null;
    this.heartIntervalId = null;
    this.audioManager = scene.registry.get("audioManager");
    this.preloadQueue = new Map(); // Store preloaded Image objects
    this.buffers = []; // Double buffer for cross-fade
    this.activeBufferIndex = 0;
    this.isExiting = false;
    this.abortController = new AbortController();

    // Config check
    this.cinematicMode = gameData.cinematicMode !== false;
  }

  async show(city) {
    this.currentCity = city;
    // 1. Fetch Photos
    try {
      const res = await fetch(`/api/photos?city=${city}`);
      if (res.ok) {
        const data = await res.json();
        // Handle both new object structure and legacy array structure for safety
        const allPhotos = Array.isArray(data) ? data : data.photos || [];
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

    // Create double buffers for smooth cross-fading
    for (let i = 0; i < 2; i += 1) {
      const img = document.createElement("img");
      img.className = "victory-image-buffer cinematic-filter";
      img.alt = "Memory";
      img.style.opacity = 0;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.transition = "opacity 1s ease-in-out";
      img.style.willChange = "opacity";

      this.polaroidFrame.appendChild(img);
      this.buffers.push(img);
    }

    // Date Element
    this.dateElement = document.createElement("div");
    this.dateElement.className = "polaroid-date";
    this.polaroidFrame.appendChild(this.dateElement);

    // Note Element
    this.noteElement = document.createElement("div");
    this.noteElement.className = "polaroid-note";
    this.polaroidFrame.appendChild(this.noteElement);

    imgContainer.appendChild(this.polaroidFrame);

    const smokeBorder = document.createElement("div");
    smokeBorder.className = "smoke-border";
    imgContainer.appendChild(smokeBorder);

    this.overlay.appendChild(imgContainer);

    this.exitBtn = document.createElement("button");
    this.exitBtn.className = "victory-close";
    this.exitBtn.innerText = "✕";
    this.exitBtn.onclick = (e) => {
      e.stopPropagation();
      this.exit();
    };
    this.overlay.appendChild(this.exitBtn);

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

  async startSlideshow() {
    this.currentIndex = 0;
    this.playSequence();
  }

  async playSequence() {
    if (this.isExiting) return;

    try {
      await this.showPhoto(this.currentIndex);

      if (this.isExiting) return;

      // Wait for slide duration with interrupt support
      await new Promise((resolve) => {
        const { signal } = this.abortController;
        let timeoutId;

        const onAbort = () => {
          clearTimeout(timeoutId);
          resolve();
        };

        timeoutId = setTimeout(() => {
          signal.removeEventListener("abort", onAbort);
          resolve();
        }, 5000);

        signal.addEventListener("abort", onAbort);
      });

      if (!this.isExiting) {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        // eslint-disable-next-line no-void
        void this.playSequence();
      }
    } catch (error) {
      if (!this.isExiting) {
        console.error("Slideshow sequence error:", error);
      }
    }
  }

  async showPhoto(index) {
    if (this.isExiting || !this.photos[index]) return;

    const photoUrl = this.photos[index].url;
    const photoDate =
      this.photos[index].date || this.capitalize(this.currentCity);
    const photoNote = this.photos[index].note || "";

    // Get next buffer
    const nextBufferIndex = (this.activeBufferIndex + 1) % 2;
    const nextBuffer = this.buffers[nextBufferIndex];
    const currentBuffer = this.buffers[this.activeBufferIndex];

    // 1. Preload image data
    await new Promise((resolve, reject) => {
      nextBuffer.src = photoUrl;
      nextBuffer.onload = resolve;
      nextBuffer.onerror = reject;
    });

    if (this.isExiting) return;

    // 2. Prepare visual state
    if (this.dateElement) {
      this.dateElement.style.opacity = 0;
      if (this.noteElement) this.noteElement.style.opacity = 0;

      setTimeout(() => {
        if (this.dateElement) {
          this.dateElement.innerText = photoDate;
          this.dateElement.style.opacity = 1;
        }
        if (this.noteElement) {
          this.noteElement.innerText = photoNote;
          this.noteElement.style.opacity = photoNote ? 1 : 0;
        }
      }, 500);
    }

    if (this.bgElement) {
      this.bgElement.style.opacity = 0;
      setTimeout(() => {
        if (this.bgElement) {
          this.bgElement.src = photoUrl;
          this.bgElement.style.opacity = 0.5;
        }
      }, 500);
    }

    // 3. Trigger Ken Burns
    if (this.polaroidFrame) {
      this.polaroidFrame.classList.remove("ken-burns-active");

      // Calculate dynamic dimensions to fit screen (85% max)
      const maxWidth = window.innerWidth * 0.85;
      const maxHeight = window.innerHeight * 0.85;

      const naturalWidth = nextBuffer.naturalWidth || 800;
      const naturalHeight = nextBuffer.naturalHeight || 600;

      const aspect = naturalWidth / naturalHeight;

      let finalWidth;
      let finalHeight;

      // Determine dimensions based on "contain" logic
      if (naturalWidth / maxWidth > naturalHeight / maxHeight) {
        // Width is the limiting factor
        finalWidth = Math.min(naturalWidth, maxWidth);
        finalHeight = finalWidth / aspect;
      } else {
        // Height is the limiting factor
        finalHeight = Math.min(naturalHeight, maxHeight);
        finalWidth = finalHeight * aspect;
      }

      // Apply calculated dimensions to the frame
      this.polaroidFrame.style.width = `${finalWidth}px`;
      this.polaroidFrame.style.height = `${finalHeight}px`;

      // Keep class logic for potential CSS specific tuning (optional but good for consistency)
      this.polaroidFrame.classList.remove("is-portrait");
      this.polaroidFrame.classList.remove("is-landscape");

      if (naturalHeight > naturalWidth) {
        this.polaroidFrame.classList.add("is-portrait");
      } else {
        this.polaroidFrame.classList.add("is-landscape");
      }

      // eslint-disable-next-line no-unused-expressions
      this.polaroidFrame.offsetHeight;
      this.polaroidFrame.classList.add("ken-burns-active");
    }

    // 4. Cross-fade
    nextBuffer.style.opacity = 1;
    currentBuffer.style.opacity = 0;

    // 5. Update state
    this.activeBufferIndex = nextBufferIndex;

    // 6. Background preloading & cleanup
    this.preloadImages(index);
    this.cleanupImages(index);
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

  /**
   * Preload next 2 images in the background
   */
  async preloadImages(index) {
    if (!this.photos || this.photos.length === 0) return;

    // Buffer size of 2
    for (let i = 1; i <= 2; i += 1) {
      const nextIndex = (index + i) % this.photos.length;
      const { url } = this.photos[nextIndex];

      if (!this.preloadQueue.has(url)) {
        const img = new Image();
        img.src = url;
        this.preloadQueue.set(url, img);
        console.log(`Preloading memory: ${url}`);
      }
    }
  }

  /**
   * Remove previous image from memory
   */
  cleanupImages(currentIndex) {
    const prevIndex =
      (currentIndex - 1 + this.photos.length) % this.photos.length;
    const { url } = this.photos[prevIndex];

    const img = this.preloadQueue.get(url);
    if (img) {
      img.src = ""; // Stop any pending load
      this.preloadQueue.delete(url);
      console.log(`Cleaned up memory: ${url}`);
    }
  }

  async exit() {
    if (this.isExiting) return;
    this.isExiting = true;

    // Helper for timestamped logs
    const startTime = Date.now();
    const log = (msg) => logger.info(`[${Date.now() - startTime}ms] ${msg}`);

    this.abortController.abort(); // Signal pending slideshow waits to stop (but we won't stop the loop explicitly yet)

    try {
      log("Exit sequence initiated - Black Curtain Strategy");

      // 1. Create a Black Curtain for smooth fade-to-black
      // This ensures we fade to BLACK, not to "transparent" (which reveals the static game)
      let curtain = null;
      if (this.overlay) {
        curtain = document.createElement("div");
        curtain.style.position = "absolute";
        curtain.style.top = "0";
        curtain.style.left = "0";
        curtain.style.width = "100%";
        curtain.style.height = "100%";
        curtain.style.backgroundColor = "black";
        curtain.style.zIndex = "1000"; // Above everything in the overlay
        curtain.style.opacity = "0";
        curtain.style.transition = "opacity 0.8s ease-in-out";
        curtain.style.pointerEvents = "none";

        this.overlay.appendChild(curtain);

        // Force reflow
        // eslint-disable-next-line no-unused-expressions
        curtain.offsetHeight;

        // Use a small timeout to ensure the browser has registered the initial 'opacity: 0' state
        // before we switch it to 'opacity: 1'.
        await new Promise((resolve) => {
          setTimeout(() => resolve(), 50);
        });

        if (curtain) curtain.style.opacity = "1";
        log("Starting visual fade to black");
      }

      // 2. Start Music Fade
      if (this.audioManager) {
        this.audioManager.stopMusic(800);
      }

      // 3. Wait for Fade (800ms)
      // We keep hearts/slideshow running behind the curtain to avoid "stuck" feeling
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 800);
      });
      log("Visual fade complete");

      // 4. Stop Logic
      if (this.slideshowTimeout) clearTimeout(this.slideshowTimeout);
      if (this.heartIntervalId) clearInterval(this.heartIntervalId);

      // 5. Navigate
      // We do NOT remove the overlay yet. We want it to cover the scene transition.
      log("Navigating to MainMenuScene");
      this.scene.scene.start("MainMenuScene");

      // 6. Deferred Cleanup
      // Remove the overlay 2 seconds AFTER navigation starts.
      // This ensures the MainMenu has time to init and start its own fade-in
      // and that the browser is completely done with the heavy work.
      setTimeout(() => {
        this.cleanupResources();
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;

        // Cleanup spin style
        const spinStyle = document.getElementById("spin-style");
        if (spinStyle && spinStyle.parentNode) {
          spinStyle.parentNode.removeChild(spinStyle);
        }
        log("Cleanup complete");
      }, 2000);
    } catch (error) {
      console.error("Error during exit sequence:", error);
      // Emergency Fallback
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.scene.scene.start("MainMenuScene");
    }
  }

  cleanupResources() {
    // Move potentially blocking cleanup here
    this.preloadQueue.forEach((img) => {
      // eslint-disable-next-line no-param-reassign
      img.src = "";
    });
    this.preloadQueue.clear();

    this.buffers.forEach((img) => {
      // eslint-disable-next-line no-param-reassign
      img.src = "";
    });
    this.buffers = [];
  }
}
