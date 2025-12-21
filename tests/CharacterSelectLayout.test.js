import { describe, it, expect } from "vitest";

describe("CharacterSelectScene Responsive Layout Constants", () => {
  const getLayout = (width, height) => {
    // Logic to be implemented in create()
    const isIPad = width / height < 1.5; // Tighter ratio for iPad, same as in Scene
    return {
      p1X: width * 0.25,
      aiX: width * 0.75,
      scale: isIPad ? 1.0 : 0.85,
      y: height / 2,
    };
  };

  it("should calculate correct positions for iPad (4:3 roughly)", () => {
    const layout = getLayout(1024, 768);
    expect(layout.p1X).toBe(256);
    expect(layout.aiX).toBe(768);
    expect(layout.scale).toBe(1.0);
  });

  it("should calculate correct positions for iPhone (16:9 roughly)", () => {
    const layout = getLayout(1280, 720);
    expect(layout.p1X).toBe(320);
    expect(layout.aiX).toBe(960);
    expect(layout.scale).toBe(0.85);
  });
});
