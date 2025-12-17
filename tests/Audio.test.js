import { describe, it, expect, vi, beforeEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

describe("Audio Logic", () => {
  let slideshow;
  let mockScene;

  beforeEach(() => {
    mockScene = {
      scene: { start: vi.fn() },
      sound: {
        play: vi.fn(),
        stopAll: vi.fn(),
        add: vi.fn(() => ({ play: vi.fn(), stop: vi.fn() })),
      },
      cache: { audio: { exists: vi.fn() } },
    };
    slideshow = new VictorySlideshow(mockScene);
    // Mock global document
    document.body.innerHTML = "";
  });

  it("should play soundtrack if available", () => {
    mockScene.cache.audio.exists.mockReturnValue(true);
    // We need to trigger handleAudio. show() does it after delay.
    // Let's mock timers or call handleAudio directly if exposed (it is).

    slideshow.handleAudio("Paris");

    // We expect it to try loading 'soundtrack' if my code is updated to check it
    // Or just play it.
    // The test expects the NEW logic: play 'soundtrack' specifically.

    // Wait for timeout (mocked or check setTimeout usage)
    // Actually, in the previous implementation it used setTimeout 1500.
    // We should probably check if sound.add was called with 'soundtrack'.

    vi.useFakeTimers();
    slideshow.handleAudio("Paris");
    vi.advanceTimersByTime(2000);

    expect(mockScene.sound.add).toHaveBeenCalledWith(
      "soundtrack",
      expect.anything(),
    );
  });
});
