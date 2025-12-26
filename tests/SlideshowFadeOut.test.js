import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

describe("VictorySlideshow Fade-Out", () => {
  let slideshow;
  let mockScene;
  let mockAudioManager;

  beforeEach(() => {
    mockAudioManager = {
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
      playUi: vi.fn(),
    };
    mockScene = {
      scene: { start: vi.fn() },
      registry: {
        get: vi.fn().mockReturnValue(mockAudioManager),
      },
    };
    slideshow = new VictorySlideshow(mockScene);
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should apply fade-out transition to overlay on exit", async () => {
    slideshow.createOverlay();
    const overlay = document.querySelector(".victory-overlay");

    const exitPromise = slideshow.exit();

    expect(overlay.style.opacity).toBe("0");
    expect(overlay.style.transition).toContain("opacity");

    await exitPromise;
  });

  it("should sync music stop with fade-out duration", async () => {
    slideshow.createOverlay();

    await slideshow.exit();

    expect(mockAudioManager.stopMusic).toHaveBeenCalledWith(800);
  });
});
