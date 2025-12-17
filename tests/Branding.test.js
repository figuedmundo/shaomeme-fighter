import { describe, it, expect, vi, beforeEach } from "vitest";
import MainMenuScene from "../src/scenes/MainMenuScene";

// Mock Phaser
vi.mock("phaser", () => {
  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
        }

        add = {
          image: vi.fn(() => ({
            width: 100,
            height: 100,
            setDisplaySize: vi.fn(),
          })),
          text: vi.fn(() => ({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn(),
            setStyle: vi.fn(),
          })),
        };

        load = { image: vi.fn(), audio: vi.fn() };

        scale = { width: 800, height: 600 };
      },
    },
  };
});

describe("Branding Integration", () => {
  let scene;

  beforeEach(() => {
    scene = new MainMenuScene();
  });

  it("should preload the logo", () => {
    scene.preload();
    expect(scene.load.image).toHaveBeenCalledWith(
      "logo",
      "resources/shaomeme_fighter.png",
    );
  });

  it("should create the logo image in create()", () => {
    scene.create();
    expect(scene.add.image).toHaveBeenCalled();
    // Check if called with logo key
    const { calls } = scene.add.image.mock;
    const logoCall = calls.find((call) => call[2] === "logo"); // x, y, key
    expect(logoCall).toBeDefined();
  });

  it("should add the footer text", () => {
    scene.create();
    const { calls } = scene.add.text.mock;
    const footerCall = calls.find((call) => call[2].includes("Created by"));
    expect(footerCall).toBeDefined();
  });
});
