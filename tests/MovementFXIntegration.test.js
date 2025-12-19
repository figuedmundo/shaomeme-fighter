import { describe, it, expect, vi, beforeEach } from "vitest";

import FightScene from "../src/scenes/FightScene";

// Mock Phaser
vi.mock("phaser", () => {
  return {
    default: {
      Scene: class {
        constructor(key) {
          this.key = key;
        }

        add = {
          image: vi.fn(() => ({
            setDisplaySize: vi.fn().mockReturnThis(),
            setScrollFactor: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setTexture: vi.fn().mockReturnThis(),
            setFlipX: vi.fn().mockReturnThis(),
            setTint: vi.fn().mockReturnThis(),
            clearTint: vi.fn().mockReturnThis(),
            destroy: vi.fn(),
          })),
          rectangle: vi.fn(() => {
            const r = {};
            r.setStrokeStyle = vi.fn().mockReturnValue(r);
            r.setDepth = vi.fn().mockReturnValue(r);
            r.setVisible = vi.fn().mockReturnValue(r);
            r.setAlpha = vi.fn().mockReturnValue(r);
            r.setTint = vi.fn().mockReturnValue(r);
            r.clearTint = vi.fn().mockReturnValue(r);
            r.destroy = vi.fn();
            return r;
          }),
          circle: vi.fn(() => {
            const c = {};
            c.setVisible = vi.fn().mockReturnValue(c);
            c.setDepth = vi.fn().mockReturnValue(c);
            return c;
          }),
          group: vi.fn(() => ({
            get: vi.fn(),
            createCallback: vi.fn(),
            clear: vi.fn(),
            killAndHide: vi.fn(),
          })),
          graphics: vi.fn(() => ({
            fillStyle: vi.fn(),
            fillCircle: vi.fn(),
            fillRect: vi.fn(),
            lineStyle: vi.fn(),
            strokeRect: vi.fn(),
            clear: vi.fn(),
            generateTexture: vi.fn(),
            destroy: vi.fn(),
            setScrollFactor: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
          })),
          // FIX: Added destroy() to the particles mock
          particles: vi.fn(() => ({
            stop: vi.fn(),
            setDepth: vi.fn(),
            setTint: vi.fn(),
            emitParticleAt: vi.fn(),
            destroy: vi.fn(),
          })),
          sprite: vi.fn(() => {
            const s = {};
            s.setOrigin = vi.fn().mockReturnValue(s);
            s.setDepth = vi.fn().mockReturnValue(s);
            s.setAlpha = vi.fn().mockReturnValue(s);
            s.setScale = vi.fn().mockReturnValue(s);
            s.setPosition = vi.fn().mockReturnValue(s);
            s.setVisible = vi.fn().mockReturnValue(s);
            s.setFlipX = vi.fn().mockReturnValue(s);
            s.setTexture = vi.fn().mockReturnValue(s);
            s.setFrame = vi.fn().mockReturnValue(s);
            s.destroy = vi.fn();
            s.active = true;
            s.visible = true;
            s.x = 100;
            s.y = 100;
            s.depth = 1;
            s.texture = { key: "fighter" };
            s.frame = { name: "idle" };
            return s;
          }),
          text: vi.fn(() => {
            const t = {};
            t.setOrigin = vi.fn().mockReturnValue(t);
            t.setDepth = vi.fn().mockReturnValue(t);
            t.setAlpha = vi.fn().mockReturnValue(t);
            t.setVisible = vi.fn().mockReturnValue(t);
            t.setText = vi.fn().mockReturnValue(t);
            t.setScale = vi.fn().mockReturnValue(t);
            t.setScrollFactor = vi.fn().mockReturnValue(t);
            t.destroy = vi.fn();
            return t;
          }),
          container: vi.fn(() => ({
            add: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setPosition: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            destroy: vi.fn(),
          })),
          existing: vi.fn(),
        };

        physics = {
          add: {
            staticGroup: vi.fn(() => ({ add: vi.fn() })),
            existing: vi.fn(),
            collider: vi.fn(),
          },
          world: {
            setBounds: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
          },
          pause: vi.fn(),
          resume: vi.fn(),
        };

        scale = { width: 800, height: 600 };

        registry = {
          get: vi.fn().mockReturnValue({
            playMusic: vi.fn(),
            playUi: vi.fn(),
            playAnnouncer: vi.fn(),
            playStageMusic: vi.fn(),
            stopMusic: vi.fn(),
            setMusicRate: vi.fn(),
            playKO: vi.fn(),
            playImpact: vi.fn(),
            playHitReaction: vi.fn(),
          }),
        };

        input = {
          keyboard: {
            createCursorKeys: vi.fn(),
            addKeys: vi.fn(),
            addKey: vi.fn(),
          },
          addPointer: vi.fn(),
          on: vi.fn(),
        };

        textures = {
          exists: vi.fn(() => true),
          addCanvas: vi.fn(),
        };

        anims = {
          create: vi.fn(),
          generateFrameNumbers: vi.fn(),
          exists: vi.fn(),
          pauseAll: vi.fn(),
          resumeAll: vi.fn(),
        };

        time = {
          delayedCall: vi.fn((d, cb) => cb && cb()),
          addEvent: vi.fn(() => ({ remove: vi.fn() })),
        };

        tweens = {
          add: vi.fn(),
        };

        cameras = {
          main: {
            shake: vi.fn(),
            zoomTo: vi.fn(),
            pan: vi.fn(),
            setZoom: vi.fn(),
          },
        };
      },
      Physics: {
        Arcade: {
          Sprite: class {
            constructor() {
              this.body = { setSize: vi.fn(), setOffset: vi.fn(), blocked: {} };
              this.setCollideWorldBounds = vi.fn();
              this.setOrigin = vi.fn();
              this.play = vi.fn();
              this.on = vi.fn();
              this.once = vi.fn();
              this.texture = { key: "fighter" };
              this.setFlipX = vi.fn();
              this.anims = {
                currentFrame: { index: 0 },
                isPlaying: false,
              };
              this.active = true;
              this.visible = true;
              this.x = 0;
              this.y = 0;
              this.depth = 10;
              this.scaleX = 1;
              this.scaleY = 1;
              this.flipX = false;
              this.frame = { name: "frame" };
            }

            setDepth() {}

            setControls() {}

            update() {}

            setFXManager() {}

            setScale() {}

            setVelocityX() {}

            setVelocityY() {}

            setPosition() {}

            setInputEnabled() {}
          },
        },
      },
      Input: {
        Keyboard: {
          KeyCodes: { SPACE: 32, W: 87, A: 65, S: 83, D: 68 },
        },
      },
      Math: {
        Distance: { Between: vi.fn() },
        Clamp: vi.fn((v, min, max) => Math.min(Math.max(v, min), max)),
        Linear: vi.fn((a, b, t) => a + (b - a) * t),
      },
    },
  };
});

describe("Movement FX Integration", () => {
  let scene;

  beforeEach(() => {
    vi.clearAllMocks();
    scene = new FightScene();
    scene.events = { emit: vi.fn(), on: vi.fn(), off: vi.fn() };
  });

  describe("Lifecycle", () => {
    it("should initialize MovementFXManager in create()", () => {
      scene.create();
      expect(scene.movementFX).toBeDefined();
      expect(scene.player1).toBeDefined();
      expect(scene.player2).toBeDefined();
    });

    it("should update MovementFXManager in update()", () => {
      scene.create();
      scene.movementFX.update = vi.fn();
      scene.update();
      expect(scene.movementFX.update).toHaveBeenCalled();
    });

    it("should destroy MovementFXManager in shutdown()", () => {
      scene.create();
      scene.movementFX.destroy = vi.fn();
      scene.hitFeedback.destroy = vi.fn(); // Also mock hitFeedback destroy to prevent error if mock is partial

      scene.shutdown();

      expect(scene.movementFX.destroy).toHaveBeenCalled();
      expect(scene.hitFeedback.destroy).toHaveBeenCalled();
    });
  });

  describe("System Coordination (Task 4.3)", () => {
    beforeEach(() => {
      scene.create();
    });

    it("should coordinate landing effects (Dust + Squash)", () => {
      // Spy on subsystems
      const dustSpy = vi.spyOn(scene.movementFX.dustSystem, "triggerLand");
      const animSpy = vi.spyOn(
        scene.movementFX.animationEnhancer,
        "squashAndStretch",
      );

      // Simulate landing
      const fighter = scene.player1;
      fighter.x = 150;
      fighter.y = 500;
      scene.movementFX.onLand(fighter);

      expect(dustSpy).toHaveBeenCalledWith(150, 500);
      expect(animSpy).toHaveBeenCalledWith(fighter, 1.1, 0.9, 100);
    });

    it("should coordinate jump effects (Squash/Stretch)", () => {
      const animSpy = vi.spyOn(
        scene.movementFX.animationEnhancer,
        "squashAndStretch",
      );

      const fighter = scene.player1;
      scene.movementFX.onJump(fighter);

      // Jump should stretch Y (1.05) and squash X (0.95)
      expect(animSpy).toHaveBeenCalledWith(fighter, 0.95, 1.05, 100);
    });

    it("should coordinate dash effects (Dust + Afterimage)", () => {
      const dustSpy = vi.spyOn(scene.movementFX.dustSystem, "triggerDash");
      const afterimageSpy = vi.spyOn(
        scene.movementFX.afterimageSystem,
        "spawnAfterimage",
      );

      const fighter = scene.player1;
      fighter.x = 200;
      fighter.y = 500;
      scene.movementFX.onDash(fighter, "right");

      expect(dustSpy).toHaveBeenCalledWith(200, 500, "right");
      expect(afterimageSpy).toHaveBeenCalledWith(fighter, 300, 0.5, 0x0088ff);
    });

    it("should coordinate heavy step effects (Dust)", () => {
      const dustSpy = vi.spyOn(scene.movementFX.dustSystem, "triggerTurn");

      const fighter = scene.player1;
      fighter.x = 300;
      fighter.y = 500;
      scene.movementFX.onStep(fighter);

      expect(dustSpy).toHaveBeenCalledWith(300, 500);
    });

    it("should clean up all subsystems on manager destroy", () => {
      const shadowDestroy = vi.spyOn(scene.movementFX.shadowSystem, "destroy");
      const dustDestroy = vi.spyOn(scene.movementFX.dustSystem, "destroy");
      const animDestroy = vi.spyOn(
        scene.movementFX.animationEnhancer,
        "destroy",
      );
      const afterimageDestroy = vi.spyOn(
        scene.movementFX.afterimageSystem,
        "destroy",
      );

      scene.movementFX.destroy();

      expect(shadowDestroy).toHaveBeenCalled();
      expect(dustDestroy).toHaveBeenCalled();
      expect(animDestroy).toHaveBeenCalled();
      expect(afterimageDestroy).toHaveBeenCalled();
    });
  });
});
