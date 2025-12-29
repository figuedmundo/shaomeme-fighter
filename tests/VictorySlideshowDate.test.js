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
      updateScene: vi.fn(),
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    });
    victorySlideshow = new VictorySlideshow(mockScene);
    // Mock enough state for unit test
    victorySlideshow.dateElement = document.createElement("div");
    victorySlideshow.polaroidFrame = document.createElement("div");
    victorySlideshow.buffers = [
      document.createElement("img"),
      document.createElement("img"),
    ];
    victorySlideshow.activeBufferIndex = 0;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("2.1.1 should display the photo date if available", async () => {
    const photo = { url: "test.jpg", date: "May 21, 2023" };
    victorySlideshow.photos = [photo];

    vi.useFakeTimers();
    const playPromise = victorySlideshow.showPhoto(0);

    // Trigger onload
    victorySlideshow.buffers[1].onload();
    await playPromise;

    vi.advanceTimersByTime(600); // Advance past date update timeout

    expect(victorySlideshow.dateElement.innerText).toBe("May 21, 2023");
    vi.useRealTimers();
  });

  it("2.1.2 should fallback to city name if date is missing/empty", async () => {
    const photo = { url: "test.jpg", date: "" };
    victorySlideshow.photos = [photo];
    victorySlideshow.currentCity = "Paris"; // We'll need to ensure we store currentCity

    vi.useFakeTimers();
    const playPromise = victorySlideshow.showPhoto(0);

    // Trigger onload
    victorySlideshow.buffers[1].onload();
    await playPromise;

    vi.advanceTimersByTime(600);

    expect(victorySlideshow.dateElement.innerText).toBe("Paris");
    vi.useRealTimers();
  });
});
