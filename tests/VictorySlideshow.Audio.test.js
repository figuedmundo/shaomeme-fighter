import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { JSDOM } from "jsdom";
import VictorySlideshow from "../src/components/VictorySlideshow.js";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Phaser
vi.mock("phaser", () => ({
  default: {
    Math: {
      RND: {
        pick: vi.fn((arr) => arr[0]), // Always pick the first one
      },
    },
  },
}));

// Setup JSDOM
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;

// Mock Scene and AudioManager
const mockPlayMusic = vi.fn();
const mockStopMusic = vi.fn();

const mockScene = {
  registry: {
    get: vi.fn().mockReturnValue({
      playMusic: mockPlayMusic,
      stopMusic: mockStopMusic,
    }),
  },
  // Mock registry data for soundtracks
  registryData: {
    soundtracks: ["track1", "track2", "track3"],
  },
};
mockScene.registry.get.mockImplementation((key) => {
  if (key === "audioManager")
    return { playMusic: mockPlayMusic, stopMusic: mockStopMusic };
  if (key === "soundtracks") return mockScene.registryData.soundtracks;
  return null;
});

describe("VictorySlideshow Audio Randomization", () => {
  let slideshow;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    slideshow = new VictorySlideshow(mockScene);
    // Mock ConfigManager if needed (though we plan to remove its usage)
    vi.mock("../src/config/ConfigManager", () => ({
      default: {
        getVictoryMusicForCity: vi.fn(), // Should not be called after refactor
      },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should play a random soundtrack from the registry list", () => {
    // Spy on Math.random or just check if playMusic is called with one of the tracks
    slideshow.handleAudio("paris");

    expect(mockStopMusic).toHaveBeenCalled(); // Should stop previous music
    expect(mockPlayMusic).toHaveBeenCalled();

    const playedTrack = mockPlayMusic.mock.calls[0][0];
    const allowedTracks = ["track1", "track2", "track3"];
    expect(allowedTracks).toContain(playedTrack);
  });

  it("should handle empty soundtrack list gracefully (no music)", () => {
    mockScene.registryData.soundtracks = []; // Empty
    slideshow.handleAudio("paris");

    expect(mockPlayMusic).not.toHaveBeenCalled();

    // Restore
    mockScene.registryData.soundtracks = ["track1", "track2"];
  });
});
