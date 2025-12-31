import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Asset Availability", () => {
  const assetsDir = path.join(__dirname, "../public/assets");

  it("should have the shaomeme_fighter.png logo", () => {
    const filePath = path.join(assetsDir, "images/ui/shaomeme_fighter.png");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have the soundtrack_walking_on_cars.m4a", () => {
    const filePath = path.join(
      __dirname,
      "../public/assets",
      "audio/soundtracks/soundtrack_walking_on_cars.m4a",
    );
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
