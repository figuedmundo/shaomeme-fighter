export default class VictorySlideshow {
  constructor(scene) {
    this.scene = scene;
    this.overlay = null;
    this.photos = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.music = null;
  }

  async show(city) {
    // 1. Fetch Photos
    try {
      const res = await fetch(`/api/photos?city=${city}`);
      if (res.ok) {
        const allPhotos = await res.json();
        // EXCLUDE the arena background from the reward slideshow
        this.photos = allPhotos.filter(p => !p.isBackground);
        console.log(`VictorySlideshow: Found ${allPhotos.length} total photos, using ${this.photos.length} as rewards (excluded background).`);
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

    // Title
    const title = document.createElement("h1");
    title.className = "victory-title";
    title.innerText = "YOU WIN!";
    this.overlay.appendChild(title);

    // Image Container
    const imgContainer = document.createElement("div");
    imgContainer.className = "victory-image-container";

    // Image Element
    this.imgElement = document.createElement("img");
    this.imgElement.className = "victory-image cinematic-filter";
    this.imgElement.alt = "Memory";
    imgContainer.appendChild(this.imgElement);

    // Smoke Border (Overlay on top of image)
    const smokeBorder = document.createElement("div");
    smokeBorder.className = "smoke-border";
    imgContainer.appendChild(smokeBorder);

    this.overlay.appendChild(imgContainer);

    // Exit Button
    const exitBtn = document.createElement("button");
    exitBtn.className = "victory-close";
    exitBtn.innerText = "EXIT >";
    exitBtn.onclick = () => this.exit();
    this.overlay.appendChild(exitBtn);

    document.body.appendChild(this.overlay);
  }

  startSlideshow() {
    this.currentIndex = 0;
    this.showPhoto(this.currentIndex);

    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
      this.showPhoto(this.currentIndex);
    }, 4000); // 4 seconds
  }

  showPhoto(index) {
    if (!this.imgElement || !this.photos[index]) return;

    // Simple opacity fade
    this.imgElement.style.opacity = 0;

    setTimeout(() => {
      this.imgElement.src = this.photos[index].url;
      this.imgElement.style.opacity = 1;
    }, 200); // Wait for fade out
  }

  showFallback() {
    if (this.imgElement) {
      this.imgElement.style.display = "none";
    }
    const msg = document.createElement("p");
    msg.innerText = "No memories found for this location yet.";
    msg.style.color = "white";
    this.overlay.appendChild(msg);
  }

  handleAudio(city) {
    // Stop all current sounds
    this.scene.sound.stopAll();

    // Play KO sound immediately
    this.scene.sound.play("KO", { volume: 0.8 });

    // Wait slightly then play victory/slideshow music
    setTimeout(() => {
      // Use specific soundtrack if available
      const trackKey = this.scene.cache.audio.exists("soundtrack")
        ? "soundtrack"
        : "arena";

      this.music = this.scene.sound.add(trackKey, { loop: true, volume: 0.5 });
      this.music.play();
    }, 1500);
  }

  exit() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.music) this.music.stop();
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
    }

    // Navigate back
    this.scene.scene.start("ArenaSelectScene");
  }
}
