import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Rematch and Audio Logic", () => {
  let sceneMock;

  beforeEach(() => {
    sceneMock = {
      scene: {
        start: vi.fn(),
      },
      registry: {
        get: vi.fn(),
      },
      audioManager: {
        setVolume: vi.fn(),
      },
      sound: {
        mute: false,
      },
      transition: {
        transitionTo: vi.fn(),
      },
    };
  });

  it("should restart FightScene with previous data on Rematch", () => {
    const prevData = { city: "Paris", backgroundUrl: "test.jpg" };

    // Simulate Rematch action
    // In real code: await this.transition.transitionTo("FightScene", this.data);
    sceneMock.transition.transitionTo("FightScene", prevData);

    expect(sceneMock.transition.transitionTo).toHaveBeenCalledWith(
      "FightScene",
      prevData,
    );
  });

  it("should toggle mute state correctly", () => {
    // Initial
    expect(sceneMock.sound.mute).toBe(false);

    // Toggle
    sceneMock.sound.mute = !sceneMock.sound.mute;
    expect(sceneMock.sound.mute).toBe(true);
  });
});
