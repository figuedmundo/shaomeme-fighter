import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

// Mock Image constructor
global.Image = class {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.src = "";
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }
};

describe("VictorySlideshow Optimization", () => {
  let slideshow;
  let mockScene;

  beforeEach(() => {
    mockScene = {
      scene: { start: vi.fn() },
      registry: {
        get: vi
          .fn()
          .mockReturnValue({ playMusic: vi.fn(), stopMusic: vi.fn() }),
      },
    };
    slideshow = new VictorySlideshow(mockScene);
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with preloading capability", () => {
    expect(slideshow.preloadQueue).toBeDefined();
    expect(slideshow.preloadQueue).toBeInstanceOf(Map);
  });

  it("should preload next images", async () => {
    slideshow.photos = [
      { url: "p1.jpg" },
      { url: "p2.jpg" },
      { url: "p3.jpg" },
      { url: "p4.jpg" },
    ];

    await slideshow.preloadImages(0);

    // Should have preloaded 1 and 2 if current is 0
    expect(slideshow.preloadQueue.has("p2.jpg")).toBe(true);
    expect(slideshow.preloadQueue.has("p3.jpg")).toBe(true);
  });

  it("should cleanup passed images from memory", async () => {
    slideshow.photos = [
      { url: "p1.jpg" },
      { url: "p2.jpg" },
      { url: "p3.jpg" },
    ];

    // Manually add to queue
    const img = new Image();
    img.src = "p1.jpg";
    slideshow.preloadQueue.set("p1.jpg", img);

    slideshow.cleanupImages(1); // Current is 1, so 0 is passed

    expect(slideshow.preloadQueue.has("p1.jpg")).toBe(false);
    expect(img.src).toBe("");
  });

  it("should have double-buffered images in the DOM", () => {
    slideshow.createOverlay();

    const buffers = document.querySelectorAll(".victory-image-buffer");
    expect(buffers.length).toBe(2);

    // One should be active, one hidden
    expect(buffers[0].style.opacity).toBe("0");
    expect(buffers[1].style.opacity).toBe("0");
  });

  it("should await image load before starting transition", async () => {
    slideshow.photos = [{ url: "p1.jpg" }];
    slideshow.createOverlay();

    const playPromise = slideshow.showPhoto(0);

    // Buffers should still be at 0 opacity before load completes
    const nextBuffer = slideshow.buffers[(slideshow.activeBufferIndex + 1) % 2];
    expect(nextBuffer.style.opacity).toBe("0");

    // Manually trigger load
    nextBuffer.onload();

    await playPromise;

    expect(nextBuffer.style.opacity).toBe("1");
  });

  it("should stop all async operations on exit", async () => {
    slideshow.photos = [{ url: "p1.jpg" }, { url: "p2.jpg" }];
    slideshow.createOverlay();

    // Start sequence
    slideshow.startSlideshow();

    // Trigger exit immediately
    await slideshow.exit();

    expect(slideshow.isExiting).toBe(true);
    expect(slideshow.preloadQueue.size).toBe(0);
    expect(slideshow.buffers.length).toBe(0);
  });
});
