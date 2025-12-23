import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { JSDOM } from "jsdom";
import VictorySlideshow from "../src/components/VictorySlideshow";

// Setup JSDOM
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;

// Mock Scene
const mockScene = {
  registry: {
    get: vi.fn().mockReturnValue({ playMusic: vi.fn(), stopMusic: vi.fn() }),
  },
};

// Mock ConfigManager
vi.mock("../src/config/ConfigManager", () => ({
  default: {
    getVictoryMusicForCity: vi.fn().mockReturnValue("mock_track"),
  },
}));

describe("VictorySlideshow Logic", () => {
  let slideshow;

  beforeEach(() => {
    document.body.innerHTML = "";
    slideshow = new VictorySlideshow(mockScene);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create overlay with background, foreground, cinematic, and heart containers", () => {
    slideshow.createOverlay();

    const overlay = document.querySelector(".victory-overlay");
    expect(overlay).not.toBeNull();

    // Check for new elements
    expect(overlay.querySelector(".blurred-background")).not.toBeNull();
    expect(overlay.querySelector(".polaroid-frame")).not.toBeNull();
    expect(overlay.querySelector(".cinematic-overlay")).not.toBeNull();
    expect(overlay.querySelector(".heart-container")).not.toBeNull();
  });

  it("should spawn a heart when spawnHeart is called", () => {
    slideshow.createOverlay();
    slideshow.spawnHeart(100, 100);

    const hearts = document.querySelectorAll(".floating-heart");
    expect(hearts.length).toBe(1);
    const heart = hearts[0];
    expect(heart.style.left).toBe("100px");
    expect(heart.style.top).toBe("100px");
  });

  it("should spawn heart on click", () => {
    slideshow.createOverlay();
    const overlay = document.querySelector(".victory-overlay");

    // Simulate click
    const event = new dom.window.MouseEvent("click", {
      clientX: 50,
      clientY: 50,
      bubbles: true,
    });
    overlay.dispatchEvent(event);

    const hearts = document.querySelectorAll(".floating-heart");
    expect(hearts.length).toBe(1);
  });
});
