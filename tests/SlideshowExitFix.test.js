import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

describe("VictorySlideshow Exit Fix", () => {
  let slideshow;
  let mockScene;

  beforeEach(() => {
    mockScene = {
      scene: { start: vi.fn() },
      registry: {
        get: vi.fn().mockReturnValue({
          playMusic: vi.fn(),
          stopMusic: vi.fn(),
          playUi: vi.fn(),
        }),
      },
    };
    slideshow = new VictorySlideshow(mockScene);
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should set isExiting to true immediately on exit", async () => {
    slideshow.createOverlay();
    const exitPromise = slideshow.exit();
    expect(slideshow.isExiting).toBe(true);
    await exitPromise;
  });

  it("should stop sequence loop immediately on exit", async () => {
    slideshow.photos = [{ url: "p1.jpg" }, { url: "p2.jpg" }];
    slideshow.createOverlay();

    // Start sequence but don't await yet
    slideshow.startSlideshow();

    // Exit immediately
    await slideshow.exit();

    // If it didn't hang, it's good.
    // We'll also check if navigation was called.
    expect(mockScene.scene.start).toHaveBeenCalledWith("MainMenuScene");
  });
});
