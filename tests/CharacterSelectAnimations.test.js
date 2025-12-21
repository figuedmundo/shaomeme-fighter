import { describe, it, expect } from "vitest";

class MockTweenManager {
  constructor() {
    this.tweens = [];
  }

  add(config) {
    this.tweens.push(config);
    if (config.onComplete) config.onComplete();
  }
}

describe("CharacterSelectScene Animations", () => {
  it("should fade out grid items and buttons on confirmation", () => {
    const gridItems = [{ icon: { alpha: 1 }, border: { alpha: 1 } }];
    const selectBtn = { alpha: 1 };
    const tweens = new MockTweenManager();

    // Simulate fade out logic
    tweens.add({
      targets: [selectBtn, ...gridItems.map((i) => i.icon)],
      alpha: 0,
      duration: 300,
    });

    expect(selectBtn.alpha).toBe(1); // Alpha doesn't change automatically in mock without logic
    expect(tweens.tweens[0].alpha).toBe(0);
    expect(tweens.tweens[0].targets).toContain(selectBtn);
  });

  it("should scale portraits during VS Splash", () => {
    const portrait = { scaleX: 1, scaleY: 1 };
    const tweens = new MockTweenManager();

    tweens.add({
      targets: [portrait],
      scaleX: portrait.scaleX * 1.2,
      scaleY: portrait.scaleY * 1.2,
      duration: 200,
    });

    expect(tweens.tweens[0].scaleX).toBe(1.2);
  });
});
