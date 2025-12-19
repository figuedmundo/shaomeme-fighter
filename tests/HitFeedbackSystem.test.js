import { describe, it, expect, beforeEach, vi } from "vitest";
import HitFeedbackSystem from "../src/systems/HitFeedbackSystem";
import { createMockScene } from "./setup";

describe("HitFeedbackSystem", () => {
  let scene;
  let hitFeedback;
  let mockAttacker;
  let mockDefender;

  beforeEach(() => {
    // Mock Phaser Scene
    scene = createMockScene();

    // Mock fighters
    mockAttacker = {
      x: 100,
      y: 300,
      texture: { key: "ryu" },
      setTint: vi.fn(),
      clearTint: vi.fn(),
    };

    mockDefender = {
      x: 300,
      y: 300,
      texture: { key: "ken" },
      setTint: vi.fn(),
      clearTint: vi.fn(),
    };

    hitFeedback = new HitFeedbackSystem(scene);
  });

  describe("Initialization", () => {
    it("should create hit spark emitter on initialization", () => {
      expect(scene.add.graphics).toHaveBeenCalled();
      expect(scene.add.particles).toHaveBeenCalled();
      expect(hitFeedback.hitSparkEmitter).toBeDefined();
    });

    it("should start with hit stop inactive", () => {
      expect(hitFeedback.isHitStopActive).toBe(false);
    });
  });

  describe("triggerHitFeedback", () => {
    it("should call all feedback methods for a normal hit", () => {
      const hitStopSpy = vi.spyOn(hitFeedback, "hitStop");
      const screenShakeSpy = vi.spyOn(hitFeedback, "screenShake");
      const sparksSpy = vi.spyOn(hitFeedback, "spawnHitSparks");
      const damageNumberSpy = vi.spyOn(hitFeedback, "spawnDamageNumber");
      const flashSpy = vi.spyOn(hitFeedback, "flashFighter");

      hitFeedback.triggerHitFeedback(mockAttacker, mockDefender, 10, false);

      expect(hitStopSpy).toHaveBeenCalledWith(60);
      expect(screenShakeSpy).toHaveBeenCalledWith(4, 150);
      expect(sparksSpy).toHaveBeenCalled();
      expect(damageNumberSpy).toHaveBeenCalled();
      expect(flashSpy).toHaveBeenCalledWith(mockDefender);
    });

    it("should use stronger effects for heavy hits", () => {
      const hitStopSpy = vi.spyOn(hitFeedback, "hitStop");
      const screenShakeSpy = vi.spyOn(hitFeedback, "screenShake");

      hitFeedback.triggerHitFeedback(mockAttacker, mockDefender, 20, true);

      expect(hitStopSpy).toHaveBeenCalledWith(100);
      expect(screenShakeSpy).toHaveBeenCalledWith(8, 200);
    });
  });

  describe("hitStop", () => {
    it("should pause physics and animations", () => {
      hitFeedback.hitStop(60);

      expect(scene.physics.pause).toHaveBeenCalled();
      expect(scene.anims.pauseAll).toHaveBeenCalled();
      expect(hitFeedback.isHitStopActive).toBe(true);
    });

    it("should resume physics and animations after duration", async () => {
      hitFeedback.hitStop(60);

      // Manually trigger delayed call callback
      const call = scene.time.delayedCall.mock.results[0].value;
      call.callback();

      expect(scene.physics.resume).toHaveBeenCalled();
      expect(scene.anims.resumeAll).toHaveBeenCalled();
      expect(hitFeedback.isHitStopActive).toBe(false);
    });

    it("should not trigger if already active", () => {
      hitFeedback.isHitStopActive = true;
      scene.physics.pause.mockClear();

      hitFeedback.hitStop(60);

      expect(scene.physics.pause).not.toHaveBeenCalled();
    });
  });

  describe("screenShake", () => {
    it("should shake camera with correct intensity and duration", () => {
      hitFeedback.screenShake(4, 150);

      expect(scene.cameras.main.shake).toHaveBeenCalledWith(150, 0.004);
    });

    it("should use stronger shake for heavy hits", () => {
      hitFeedback.screenShake(8, 200);

      expect(scene.cameras.main.shake).toHaveBeenCalledWith(200, 0.008);
    });
  });

  describe("spawnHitSparks", () => {
    it("should emit particles at impact point", () => {
      const x = 200;
      const y = 250;

      hitFeedback.spawnHitSparks(x, y, false);

      expect(hitFeedback.hitSparkEmitter.setParticleTint).toHaveBeenCalledWith(
        0xffffff,
      );
      expect(hitFeedback.hitSparkEmitter.emitParticleAt).toHaveBeenCalledWith(
        x,
        y,
        8,
      );
    });

    it("should emit more particles with different color for heavy hits", () => {
      const x = 200;
      const y = 250;

      hitFeedback.spawnHitSparks(x, y, true);

      expect(hitFeedback.hitSparkEmitter.setParticleTint).toHaveBeenCalledWith(
        0xffaa00,
      );
      expect(hitFeedback.hitSparkEmitter.emitParticleAt).toHaveBeenCalledWith(
        x,
        y,
        12,
      );
    });
  });

  describe("spawnDamageNumber", () => {
    it("should create text with correct damage value", () => {
      hitFeedback.spawnDamageNumber(200, 250, 15);

      expect(scene.add.text).toHaveBeenCalledWith(
        200,
        250,
        "15",
        expect.objectContaining({
          fontSize: "32px",
          fontFamily: '"Press Start 2P", cursive',
        }),
      );
    });

    it("should round damage to integer", () => {
      hitFeedback.spawnDamageNumber(200, 250, 15.7);

      expect(scene.add.text).toHaveBeenCalledWith(
        200,
        250,
        "16",
        expect.any(Object),
      );
    });

    it("should create tween animation for damage number", () => {
      hitFeedback.spawnDamageNumber(200, 250, 10);

      expect(scene.tweens.add).toHaveBeenCalledWith(
        expect.objectContaining({
          y: 170, // 250 - 80
          alpha: 0,
          scale: 1.5,
          duration: 800,
        }),
      );
    });
  });

  describe("flashFighter", () => {
    it("should set white tint on fighter", () => {
      hitFeedback.flashFighter(mockDefender);

      expect(mockDefender.setTint).toHaveBeenCalledWith(0xffffff);
    });

    it("should clear tint after 1 frame", () => {
      hitFeedback.flashFighter(mockDefender);

      // Manually trigger delayed call callback
      const call = scene.time.delayedCall.mock.results[0].value;
      call.callback();

      expect(mockDefender.clearTint).toHaveBeenCalled();
    });
  });

  describe("destroy", () => {
    it("should destroy particle emitter", () => {
      hitFeedback.destroy();

      expect(hitFeedback.hitSparkEmitter.destroy).toHaveBeenCalled();
    });
  });

  describe("Integration - Impact Point Calculation", () => {
    it("should calculate impact point between fighters", () => {
      const sparksSpy = vi.spyOn(hitFeedback, "spawnHitSparks");

      hitFeedback.triggerHitFeedback(mockAttacker, mockDefender, 10, false);

      const expectedX = (mockAttacker.x + mockDefender.x) / 2; // 200
      const expectedY = mockDefender.y - 90; // 210

      expect(sparksSpy).toHaveBeenCalledWith(expectedX, expectedY, false);
    });
  });
});
