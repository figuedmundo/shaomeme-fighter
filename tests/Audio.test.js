import { describe, it, expect, vi, beforeEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";
import ConfigManager from "../src/config/ConfigManager";

describe("Audio Logic", () => {
  let slideshow;
  let mockScene;
  let mockAudioManager;

  beforeEach(() => {
    mockAudioManager = {
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    };

    mockScene = {
      scene: { start: vi.fn() },
      sound: {
        play: vi.fn(),
        stopAll: vi.fn(),
        add: vi.fn(() => ({ play: vi.fn(), stop: vi.fn() })),
      },
      cache: { audio: { exists: vi.fn() } },
      time: {
        delayedCall: vi.fn((delay, callback) => {
          callback();
        }),
      },
      registry: {
        get: vi.fn().mockImplementation((key) => {
          if (key === "audioManager") {
            return mockAudioManager;
          }
          return null;
        }),
      },
    };
    slideshow = new VictorySlideshow(mockScene);
    // Mock global document
    document.body.innerHTML = "";
  });

  it("should play soundtrack if available", () => {
    // Manually override the method on the singleton instance
    const originalMethod = ConfigManager.getVictoryMusicForCity;
    ConfigManager.getVictoryMusicForCity = vi
      .fn()
      .mockReturnValue("soundtrack_walking_on_cars");

    try {
      slideshow.handleAudio("paris");

      // Now it uses ConfigManager to get music, which defaults to victory_reward_music for Paris
      expect(mockAudioManager.playMusic).toHaveBeenCalledWith(
        "soundtrack_walking_on_cars",
        expect.anything(),
      );
    } finally {
      // Restore original method
      ConfigManager.getVictoryMusicForCity = originalMethod;
    }
  });
});
