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

  it("should apply fade-out transition via black curtain on exit", async () => {
    slideshow.createOverlay();
    const overlay = document.querySelector(".victory-overlay");

    vi.useFakeTimers();
    const exitPromise = slideshow.exit();

    // Advance 100ms to allow curtain to be created and initial timeout to pass
    await vi.advanceTimersByTimeAsync(100);

    const curtain = overlay.lastElementChild;
    expect(curtain.style.backgroundColor).toBe("black");
    expect(curtain.style.opacity).toBe("1");
    expect(curtain.style.transition).toContain("opacity");

    // Advance 800ms to finish fade
    await vi.advanceTimersByTimeAsync(800);

    // Advance 2000ms to finish deferred cleanup
    await vi.advanceTimersByTimeAsync(2000);

    await exitPromise;
    vi.useRealTimers();
  });

  it("should sync music stop with fade-out duration", async () => {
    slideshow.createOverlay();

    await slideshow.exit();

    expect(mockAudioManager.stopMusic).toHaveBeenCalledWith(800);
  });
});
