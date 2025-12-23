import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VictorySlideshow from "../src/components/VictorySlideshow";

// Mock ConfigManager and Scene
const mockRegistry = {
  get: vi.fn(),
};

const mockScene = {
  registry: mockRegistry,
  scene: {
    start: vi.fn(),
  },
};

describe("VictorySlideshow Date Logic", () => {
  let victorySlideshow;

  beforeEach(() => {
    mockRegistry.get.mockReturnValue({
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    });
    victorySlideshow = new VictorySlideshow(mockScene);
    // Mock createOverlay partially just to set elements
    victorySlideshow.imgElement = document.createElement("img");
    victorySlideshow.dateElement = document.createElement("div");
    victorySlideshow.polaroidFrame = document.createElement("div");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("2.1.1 should display the photo date if available", () => {
    const photo = { url: "test.jpg", date: "May 21, 2023" };
    victorySlideshow.photos = [photo];

    // We need to bypass the timeout/animation for unit testing logic
    // We can spy on showPhoto or just call logic that sets innerText if we extract it.
    // However, showPhoto is what we want to test.

    vi.useFakeTimers();
    victorySlideshow.showPhoto(0);
    vi.advanceTimersByTime(250); // Advance past fade out timeout

    expect(victorySlideshow.dateElement.innerText).toBe("May 21, 2023");
    vi.useRealTimers();
  });

  it("2.1.2 should fallback to city name if date is missing/empty", () => {
    const photo = { url: "test.jpg", date: "" };
    victorySlideshow.photos = [photo];
    victorySlideshow.currentCity = "Paris"; // We'll need to ensure we store currentCity

    vi.useFakeTimers();
    victorySlideshow.showPhoto(0);
    vi.advanceTimersByTime(250);

    expect(victorySlideshow.dateElement.innerText).toBe("Paris");
    vi.useRealTimers();
  });
});
