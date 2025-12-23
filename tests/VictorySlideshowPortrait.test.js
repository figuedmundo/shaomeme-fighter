import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

// Mock dependencies
const mockScene = {
  registry: {
    get: vi.fn(),
  },
  scene: {
    start: vi.fn(),
  },
};

const mockAudioManager = {
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
};

describe("VictorySlideshow Portrait Logic", () => {
  let slideshow;
  let mockImgElement;
  let mockBgElement;

  beforeEach(() => {
    mockScene.registry.get.mockReturnValue(mockAudioManager);
    slideshow = new VictorySlideshow(mockScene);

    // Mock DOM elements
    mockImgElement = {
      src: "",
      style: {},
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
      offsetWidth: 100,
      naturalWidth: 0,
      naturalHeight: 0,
      // Simulate event listener logic
      onload: null,
      addEventListener: vi.fn((event, handler) => {
        if (event === "load") {
          mockImgElement.onload = handler;
        }
      }),
    };

    mockBgElement = {
      src: "",
      style: {},
    };

    slideshow.imgElement = mockImgElement;
    slideshow.bgElement = mockBgElement;
    slideshow.photos = [
      { url: "portrait.jpg", isBackground: false },
      { url: "landscape.jpg", isBackground: false },
    ];

    // Mock window methods
    vi.stubGlobal(
      "setTimeout",
      vi.fn((fn) => fn && fn()),
    ); // Immediate execution for fades
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should detect portrait orientation when height > width", () => {
    // Setup portrait dimensions
    mockImgElement.naturalWidth = 500;
    mockImgElement.naturalHeight = 1000;

    const isPortrait = slideshow.isPortrait(mockImgElement);
    expect(isPortrait).toBe(true);
  });

  it("should detect landscape orientation when width >= height", () => {
    // Setup landscape dimensions
    mockImgElement.naturalWidth = 1000;
    mockImgElement.naturalHeight = 500;

    const isPortrait = slideshow.isPortrait(mockImgElement);
    expect(isPortrait).toBe(false);
  });
});
