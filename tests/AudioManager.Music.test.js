import { describe, it, expect, vi, beforeEach } from "vitest";
import AudioManager from "../src/systems/AudioManager";

// Mock Phaser
vi.mock("phaser", () => ({
  default: {
    Math: {
      Between: vi.fn((min, max) => min),
      Clamp: vi.fn((val, min, max) => Math.min(Math.max(val, min), max)),
    },
  },
}));

describe("AudioManager - Music and UI System", () => {
  let audioManager;
  let mockScene;
  let mockSound;

  beforeEach(() => {
    mockSound = {
      play: vi.fn(),
      stopAll: vi.fn(),
      add: vi.fn().mockReturnValue({
        play: vi.fn(),
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        setRate: vi.fn(),
        setVolume: vi.fn(),
      }),
    };

    mockScene = {
      sound: mockSound,
      cache: {
        audio: {
          exists: vi.fn().mockReturnValue(true),
        },
      },
      tweens: {
        add: vi.fn(),
      },
    };

    audioManager = new AudioManager(mockScene);
    audioManager.init();
  });

  it("should play music when requested", () => {
    const mockMusic = {
      play: vi.fn(),
      stop: vi.fn(),
      setLoop: vi.fn(),
      key: "music1",
    };
    mockSound.add.mockReturnValue(mockMusic);

    audioManager.playMusic("music1");
    expect(mockSound.add).toHaveBeenCalledWith("music1", expect.any(Object));
    expect(mockMusic.play).toHaveBeenCalled();
  });

  it("should stop current music with optional fade", () => {
    const mockMusic = {
      play: vi.fn(),
      stop: vi.fn(),
      setLoop: vi.fn(),
      volume: 0.3,
      key: "music1",
      isPlaying: true,
    };
    mockSound.add.mockReturnValue(mockMusic);
    audioManager.playMusic("music1");

    // Test simple stop
    audioManager.stopMusic(0);
    expect(mockMusic.stop).toHaveBeenCalled();
  });

  it("should play UI sounds", () => {
    audioManager.playUi("ui_select");
    expect(mockSound.play).toHaveBeenCalledWith(
      "ui_select",
      expect.objectContaining({ volume: expect.any(Number) }),
    );
  });

  it("should adjust music rate dynamically", () => {
    const mockMusic = {
      play: vi.fn(),
      stop: vi.fn(),
      setLoop: vi.fn(),
      setRate: vi.fn(),
      key: "music1",
    };
    mockSound.add.mockReturnValue(mockMusic);
    audioManager.playMusic("music1");

    audioManager.setMusicRate(1.2);
    expect(mockMusic.setRate).toHaveBeenCalledWith(1.2);
  });

  it("should handle stage-specific music with fallback", () => {
    // Scene has city 'Paris'
    mockScene.cache.audio.exists.mockImplementation((key) => {
      if (key === "music_paris") return false;
      if (key === "arena") return true;
      return true;
    });

    audioManager.playStageMusic("paris");
    // Should fallback to 'arena' because 'music_paris' doesn't exist
    expect(mockSound.add).toHaveBeenCalledWith("arena", expect.any(Object));
  });
});
