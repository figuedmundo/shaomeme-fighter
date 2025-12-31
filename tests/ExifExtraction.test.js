import { describe, it, expect, vi, beforeEach } from "vitest";
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { getPhotoDate, formatDate } from "../server/ImageProcessor.js";

// Mock sharp
vi.mock("sharp");

// Mock fs/promises
vi.mock("node:fs/promises", () => {
  const mockStat = vi.fn();
  const mockOthers = vi.fn();
  return {
    stat: mockStat,
    access: mockOthers,
    mkdir: mockOthers,
    readFile: mockOthers,
    default: {
      stat: mockStat,
      access: mockOthers,
      mkdir: mockOthers,
      readFile: mockOthers,
    },
  };
});

// Mock exif-reader since we haven't installed it yet,
// BUT for the unit test of 'getPhotoDate' we want to mock the 'metadata' call of sharp.
// sharp returns an object with an 'exif' buffer.
// The 'getPhotoDate' function will then use exif-reader to parse it.
// We should mock exif-reader as well to control what it returns.

vi.mock("exif-reader", () => {
  return {
    default: vi.fn((buffer) => {
      if (buffer.toString() === "valid_exif") {
        return {
          Photo: {
            DateTimeOriginal: new Date("2023-05-21T14:30:00"),
          },
        };
      }
      if (buffer.toString() === "no_date_exif") {
        return { Photo: {} };
      }
      throw new Error("Invalid EXIF");
    }),
  };
});

describe("ImageProcessor Date Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const dummyBuffer = Buffer.from("test");

  describe("getPhotoDate", () => {
    it("should extract DateTimeOriginal when available in EXIF", async () => {
      // Setup sharp mock
      const mockMetadata = {
        exif: Buffer.from("valid_exif"),
      };
      sharp.mockReturnValue({
        metadata: vi.fn().mockResolvedValue(mockMetadata),
      });

      const date = await getPhotoDate(dummyBuffer, "some/path.jpg");
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(
        new Date("2023-05-21T14:30:00").toISOString(),
      );
    });

    it("should fallback to birthtime when EXIF is missing", async () => {
      // Setup sharp mock to return no exif
      sharp.mockReturnValue({
        metadata: vi.fn().mockResolvedValue({}),
      });

      // Setup fs.stat for birthtime fallback
      stat.mockResolvedValue({
        birthtime: new Date("2023-12-25T10:00:00"),
      });

      const date = await getPhotoDate(dummyBuffer, "some/path.jpg");
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(
        new Date("2023-12-25T10:00:00").toISOString(),
      );
    });

    it("should fallback to birthtime when EXIF exists but has no date", async () => {
      // Setup sharp mock
      const mockMetadata = {
        exif: Buffer.from("no_date_exif"),
      };
      sharp.mockReturnValue({
        metadata: vi.fn().mockResolvedValue(mockMetadata),
      });

      // Setup fs.stat for birthtime fallback
      stat.mockResolvedValue({
        birthtime: new Date("2023-11-01T10:00:00"),
      });

      const date = await getPhotoDate(dummyBuffer, "some/path.jpg");
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(
        new Date("2023-11-01T10:00:00").toISOString(),
      );
    });
  });

  describe("formatDate", () => {
    it("should format date object to Month Day, Year", () => {
      const d = new Date("2023-05-21");
      expect(formatDate(d)).toBe("May 21, 2023");
    });
  });
});
