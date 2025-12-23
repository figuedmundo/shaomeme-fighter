import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("VictorySlideshow CSS", () => {
  const cssPath = path.resolve(__dirname, "../src/styles/victory.css");
  let cssContent;

  try {
    cssContent = fs.readFileSync(cssPath, "utf-8");
  } catch (e) {
    cssContent = "";
  }

  it("should define .polaroid-frame class", () => {
    expect(cssContent).toContain(".polaroid-frame");
  });

  it("should define .blurred-background class", () => {
    expect(cssContent).toContain(".blurred-background");
  });

  it("should define .cinematic-overlay class", () => {
    expect(cssContent).toContain(".cinematic-overlay");
  });

  it("should define .floating-heart class", () => {
    expect(cssContent).toContain(".floating-heart");
  });

  it("should define Ken Burns keyframes", () => {
    expect(cssContent).toContain("@keyframes ken-burns");
  });
});
