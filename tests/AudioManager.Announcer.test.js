import { describe, it, expect, vi, beforeEach } from "vitest";
import AudioManager from "../src/systems/AudioManager";

// Mock Phaser
vi.mock("phaser", () => ({
  default: {
    Math: {
      Between: vi.fn((min, max) => min), // Always return min for predictability
      Clamp: vi.fn((val, min, max) => Math.min(Math.max(val, min), max)),
    },
  },
}));

describe("AudioManager - Announcer System", () => {
  let audioManager;
  let mockScene;
  let mockSound;

  beforeEach(() => {
    mockSound = {
      play: vi.fn(),
      stopAll: vi.fn(),
      add: vi.fn().mockReturnValue({ play: vi.fn(), stop: vi.fn() }),
    };

    mockScene = {
      sound: mockSound,
      cache: {
        audio: {
          exists: vi.fn().mockReturnValue(true),
        },
      },
      registry: {
        get: vi.fn(),
        set: vi.fn(),
      },
    };

    audioManager = new AudioManager(mockScene);
    audioManager.init();
  });

  it("should play announcer audio when assets exist", () => {
    const mockAudioObj = { play: vi.fn(), stop: vi.fn(), isPlaying: false };
    mockSound.add.mockReturnValue(mockAudioObj);

    audioManager.playAnnouncer("round_1");
    expect(mockSound.add).toHaveBeenCalledWith(
      "round_1",
      expect.objectContaining({ volume: expect.any(Number) }),
    );
    expect(mockAudioObj.play).toHaveBeenCalled();
  });

  it("should not play announcer audio if asset is missing", () => {
    mockScene.cache.audio.exists.mockReturnValue(false);
    audioManager.playAnnouncer("missing_file");
    expect(mockSound.add).not.toHaveBeenCalled();
  });

  it("should allow announcer volume control independently", () => {
    const mockAudioObj = { play: vi.fn(), stop: vi.fn(), isPlaying: false };
    mockSound.add.mockReturnValue(mockAudioObj);

    audioManager.setVolume("announcer", 0.8);
    audioManager.playAnnouncer("round_1");
    expect(mockSound.add).toHaveBeenCalledWith(
      "round_1",
      expect.objectContaining({ volume: 0.8 }),
    );
  });

  it("should prioritize KO over other announcer sounds", () => {
    const sound1 = {
      play: vi.fn(),
      stop: vi.fn(),
      isPlaying: true,
      key: "combo_3",
    };
    const soundKO = {
      play: vi.fn(),
      stop: vi.fn(),
      isPlaying: false,
      key: "ko",
    };

    mockSound.add.mockReturnValueOnce(sound1).mockReturnValueOnce(soundKO);

    // Simulate playing a standard announcer line
    audioManager.playAnnouncer("combo_3");

    // Immediately play KO (should happen and stop previous)
    audioManager.playAnnouncer("ko");

    expect(mockSound.add).toHaveBeenCalledWith("combo_3", expect.anything());
    expect(sound1.stop).toHaveBeenCalled(); // KO should stop the combo
    expect(mockSound.add).toHaveBeenCalledWith("ko", expect.anything());
  });
});
