import { describe, it, expect, vi, beforeEach } from "vitest";
import TouchInputController from "../src/systems/TouchInputController";

// Mock Phaser Scene and Input
const mockScene = {
  input: {
    addPointer: vi.fn(),
    on: vi.fn(),
  },
  scale: {
    width: 800,
  },
  events: {
    emit: vi.fn(),
  },
  time: {
    delayedCall: vi.fn(),
  },
};

describe("TouchInputController", () => {
  let controller;

  beforeEach(() => {
    controller = new TouchInputController(mockScene);
  });

  it("should initialize with default state", () => {
    const keys = controller.getCursorKeys();
    expect(keys.left.isDown).toBe(false);
    expect(keys.right.isDown).toBe(false);
    expect(keys.up.isDown).toBe(false);
    expect(keys.down.isDown).toBe(false);
  });

  it("should handle left zone touch as Joystick Start", () => {
    const pointer = { id: 1, x: 100, y: 100 }; // Left zone
    controller.handlePointerDown(pointer);

    expect(controller.joystick.active).toBe(true);
    expect(controller.joystick.originX).toBe(100);
    expect(mockScene.events.emit).toHaveBeenCalledWith(
      "joystick-start",
      expect.anything(),
    );
  });

  it("should handle right zone touch as Attack", () => {
    const pointer = { id: 1, x: 600, y: 100 }; // Right zone (width is 800)
    controller.handlePointerDown(pointer);

    expect(controller.attackKey.isDown).toBe(true);
    expect(mockScene.events.emit).toHaveBeenCalledWith(
      "touch-combat",
      expect.anything(),
    );
  });

  it("should update cursor keys on joystick drag", () => {
    // Start Joystick
    controller.handlePointerDown({ id: 1, x: 100, y: 100 });

    // Move Right > Threshold (20)
    controller.handlePointerMove({ id: 1, x: 150, y: 100 });

    const keys = controller.getCursorKeys();
    expect(keys.right.isDown).toBe(true);
    expect(keys.left.isDown).toBe(false);
  });
});
