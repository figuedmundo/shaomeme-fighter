import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Asset Availability", () => {
  const assetsDir = path.join(__dirname, "../public/assets");

  it("should have the shaomeme_fighter.png logo", () => {
    const filePath = path.join(assetsDir, "images/ui/shaomeme_fighter.png");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have the soundtrack_walking_on_cars.mp3", () => {
    const filePath = path.join(
      assetsDir,
      "audio/music/soundtrack_walking_on_cars.mp3",
    );
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
