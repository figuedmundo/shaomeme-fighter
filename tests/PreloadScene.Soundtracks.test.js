import { describe, it, expect, vi, beforeEach } from "vitest";
import PreloadScene from "../src/scenes/PreloadScene.js";

// Mock Phaser
const mockLoadJson = vi.fn();
const mockLoadAudio = vi.fn();
const mockLoadOn = vi.fn();
const mockRegistrySet = vi.fn();
const mockAddText = vi.fn().mockReturnValue({ setOrigin: vi.fn() });

class MockScene extends PreloadScene {
  constructor() {
    super();
    this.load = {
      json: mockLoadJson,
      audio: mockLoadAudio,
      on: mockLoadOn,
      image: vi.fn(),
    };
    this.registry = {
      set: mockRegistrySet,
    };
    this.add = {
      text: mockAddText,
    };
    this.scale = { width: 800, height: 600 };
  }
}

describe("PreloadScene Soundtracks Logic", () => {
  let scene;

  beforeEach(() => {
    vi.clearAllMocks();
    scene = new MockScene();
  });

  it("should queue loading of soundtracks JSON", () => {
    scene.preload();
    expect(mockLoadJson).toHaveBeenCalledWith(
      "soundtracks_list",
      "/api/soundtracks",
    );
  });

  it("should set registry and queue audio files when JSON loads", () => {
    scene.preload();

    // Find the filecomplete handler
    const { calls } = mockLoadOn.mock;
    const handlerCall = calls.find(
      (call) => call[0] === "filecomplete-json-soundtracks_list",
    );
    expect(handlerCall).toBeDefined();

    const handler = handlerCall[1];

    // Simulate callback with data
    const mockData = ["song1.mp3", "song2.wav"];
    handler("soundtracks_list", "json", mockData);

    // Verify audio loading
    expect(mockLoadAudio).toHaveBeenCalledWith(
      "victory_track_0",
      "/assets/audio/soundtracks/song1.mp3",
    );
    expect(mockLoadAudio).toHaveBeenCalledWith(
      "victory_track_1",
      "/assets/audio/soundtracks/song2.wav",
    );

    // Verify registry setting
    expect(mockRegistrySet).toHaveBeenCalledWith("soundtracks", [
      "victory_track_0",
      "victory_track_1",
    ]);
  });

  it("should handle empty JSON gracefully", () => {
    scene.preload();
    const handler = mockLoadOn.mock.calls.find(
      (c) => c[0] === "filecomplete-json-soundtracks_list",
    )[1];

    // Simulate empty data
    handler("soundtracks_list", "json", []);

    expect(mockLoadAudio).not.toHaveBeenCalledWith(
      expect.stringContaining("victory_track"),
      expect.any(String),
    );
    expect(mockRegistrySet).toHaveBeenCalledWith("soundtracks", []);
  });
});
