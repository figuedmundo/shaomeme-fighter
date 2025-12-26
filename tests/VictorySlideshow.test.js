import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

// Mock Fetch
global.fetch = vi.fn();

describe("VictorySlideshow Component", () => {
  let slideshow;
  let mockScene;

  beforeEach(() => {
    mockScene = {
      scene: { start: vi.fn(), resume: vi.fn() },
      sound: {
        play: vi.fn(),
        stopAll: vi.fn(),
        add: vi.fn().mockReturnValue({ play: vi.fn(), stop: vi.fn() }),
      },
      time: {
        delayedCall: vi.fn((delay, callback) => callback()),
      },
      registry: {
        get: vi.fn().mockImplementation((key) => {
          if (key === "audioManager") {
            return {
              playMusic: vi.fn(),
              stopMusic: vi.fn(),
            };
          }
          return null;
        }),
      },
    };
    // Mock Element.animate removed as WAAPI is no longer used

    slideshow = new VictorySlideshow(mockScene);
    document.body.innerHTML = ""; // Clear DOM
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create overlay elements when show() is called", async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ url: "test.jpg" }],
    });

    await slideshow.show("TestCity");

    const overlay = document.querySelector(".victory-overlay");
    expect(overlay).not.toBeNull();

    const smoke = document.querySelector(".smoke-border");
    expect(smoke).not.toBeNull();

    const img = document.querySelector(".victory-image-buffer");
    expect(img).not.toBeNull();
  });

  it("should use fallback if API returns no photos", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await slideshow.show("EmptyCity");

    const overlay = document.querySelector(".victory-overlay");
    expect(overlay).not.toBeNull();
    // Should verify fallback text is present
    const fallbackMsg = document.querySelector(".victory-fallback-msg");
    expect(fallbackMsg).not.toBeNull();
  });

  it("should remove overlay and navigate on exit", async () => {
    vi.useFakeTimers();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ url: "test.jpg" }],
    });

    await slideshow.show("TestCity");

    const exitBtn = document.querySelector(".victory-close");
    expect(exitBtn).not.toBeNull();

    // Trigger exit
    slideshow.exit();

    // 1. Advance enough to clear the first yields and start the fade
    vi.advanceTimersByTime(100);
    await vi.runOnlyPendingTimers();

    // Verify Curtain is present and black
    const overlay = document.querySelector(".victory-overlay");
    const curtain = overlay.lastElementChild;
    expect(curtain.style.backgroundColor).toBe("black");
    expect(curtain.style.opacity).toBe("1");

    // 2. Advance past the 800ms fade
    vi.advanceTimersByTime(800);
    await vi.runOnlyPendingTimers();

    // Verify navigation triggered
    expect(mockScene.scene.start).toHaveBeenCalledWith("MainMenuScene");

    // 3. Fast forward everything else to check cleanup
    // We use a large jump to clear the 2000ms timer
    vi.advanceTimersByTime(3000);

    // Use runAllTimersAsync to ensure the cleanup closure executes
    await vi.runAllTimersAsync();

    // Check overlay removal
    const overlayAfter = document.querySelector(".victory-overlay");
    expect(overlayAfter).toBeNull();

    vi.useRealTimers();
  });
});
