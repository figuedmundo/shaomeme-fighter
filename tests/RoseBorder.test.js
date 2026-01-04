import { describe, it, expect, vi, beforeEach } from "vitest";
import Phaser from "phaser";
import RoseBorder from "../src/components/RoseBorder";

// Mock Phaser Curves and Math
Phaser.Curves = {
  Spline: class {
    constructor(points) {
      this.points = points;
    }

    getPoint() {
      return { x: 100, y: 100 };
    }

    getTangent() {
      return { angle: () => 0 };
    }

    getPoints(quantity) {
      return Array(quantity).fill({ x: 0, y: 0 });
    }
  },
};
Phaser.Math = {
  Interpolation: {
    SmoothStep: vi.fn((t, min, max) => min + (max - min) * t),
  },
};

describe("RoseBorder Component", () => {
  let mockScene;

  beforeEach(() => {
    mockScene = {
      add: {
        graphics: vi.fn().mockReturnValue({
          clear: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          fillStyle: vi.fn().mockReturnThis(),
          beginPath: vi.fn().mockReturnThis(),
          moveTo: vi.fn().mockReturnThis(),
          lineTo: vi.fn().mockReturnThis(),
          strokePath: vi.fn().mockReturnThis(),
          quadraticBezierTo: vi.fn().mockReturnThis(),
          fillCircle: vi.fn().mockReturnThis(),
          fillEllipse: vi.fn().mockReturnThis(),
          fill: vi.fn().mockReturnThis(),
          closePath: vi.fn().mockReturnThis(),
          save: vi.fn().mockReturnThis(),
          restore: vi.fn().mockReturnThis(),
          translate: vi.fn().mockReturnThis(),
          rotate: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          setAlpha: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
        container: vi.fn().mockReturnValue({
          add: vi.fn(),
          setDepth: vi.fn().mockReturnThis(),
          setAlpha: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
      },
      tweens: {
        add: vi.fn().mockReturnValue({
          stop: vi.fn(),
          destroy: vi.fn(),
          duration: 4000,
        }),
      },
      time: {
        delayedCall: vi.fn(),
      },
      scale: {
        width: 1280,
        height: 720,
      },
    };
  });

  it("should be instantiable", () => {
    const roseBorder = new RoseBorder(mockScene);
    expect(roseBorder).toBeDefined();
    expect(mockScene.add.container).toHaveBeenCalled();
  });

  it("should start animations when start() is called", () => {
    const roseBorder = new RoseBorder(mockScene);
    roseBorder.start();
    // Should create initial vines for left and right
    expect(mockScene.add.graphics).toHaveBeenCalled();
    expect(mockScene.tweens.add).toHaveBeenCalled();

    // Should schedule delayed calls for offset vines
    expect(mockScene.time.delayedCall).toHaveBeenCalled();
  });

  it("should clean up resources on destroy()", () => {
    const roseBorder = new RoseBorder(mockScene);
    roseBorder.start(); // Start to create some vines
    roseBorder.destroy();

    expect(roseBorder.isActive).toBe(false);
    expect(roseBorder.container.destroy).toHaveBeenCalled();
  });

  it("should generate path", () => {
    const roseBorder = new RoseBorder(mockScene);
    const points = roseBorder.generatePath("left", 0);
    expect(points.length).toBeGreaterThan(5);
    // Start below screen
    expect(points[0].y).toBeGreaterThan(mockScene.scale.height);
  });
});
