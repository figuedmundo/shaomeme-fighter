import { describe, it, expect } from "vitest";
import sharp from "sharp";
import path from "path";
import fs from "fs";

describe("Fighter Spritesheet Integrity", () => {
  const fightersDir = path.join(__dirname, "../public/assets/fighters");
  const characterIds = [
    "ann",
    "mom",
    "dad",
    "brother",
    "fat",
    "fresway_worker",
  ];

  characterIds.forEach((id) => {
    it(`should have an 8x4 grid (1600x1600) spritesheet for ${id}`, async () => {
      const filePath = path.join(fightersDir, id, `${id}.png`);

      // First check if file exists
      expect(fs.existsSync(filePath), `File not found: ${filePath}`).toBe(true);

      // Check dimensions using sharp
      const metadata = await sharp(filePath).metadata();

      // High Quality Grid: 8 columns * 200px = 1600px, 4 rows * 400px = 1600px
      expect(metadata.width).toBe(1600);
      expect(metadata.height).toBe(1600);
    });
  });
});
