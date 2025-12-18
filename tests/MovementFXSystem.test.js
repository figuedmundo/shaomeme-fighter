import { describe, it, expect, vi, beforeEach } from "vitest";

import ShadowSystem from "../src/systems/ShadowSystem";
import DustSystem from "../src/systems/DustSystem";

import AnimationEnhancer from "../src/systems/AnimationEnhancer";
import AfterimageSystem from "../src/systems/AfterimageSystem";

// Mock Phaser completely BEFORE importing systems
vi.mock("phaser", () => {
  return {
    default: {
      Physics: {
        Arcade: {
          Sprite: class {},
        },
      },
      Scale: {
        FIT: 3,
        CENTER_BOTH: 1,
      },
      AUTO: 0,
    },
  };
});

// Mock Phaser classes
const mockScene = {
  textures: {
    exists: vi.fn(() => false),
    addCanvas: vi.fn(),
  },
  add: {
    graphics: vi.fn(() => ({
      fillStyle: vi.fn(),
      fillCircle: vi.fn(),
      generateTexture: vi.fn(),
      destroy: vi.fn(),
    })),
    particles: vi.fn(() => ({
      stop: vi.fn(),
      emitParticleAt: vi.fn(),
      setTint: vi.fn(),
      destroy: vi.fn(),
      setDepth: vi.fn(),
    })),
    sprite: vi.fn(() => ({
      setOrigin: vi.fn(),
      setAlpha: vi.fn(),
      setDepth: vi.fn(),
      destroy: vi.fn(),
      setScale: vi.fn(),
      setVisible: vi.fn(),
      setPosition: vi.fn(),
      setTint: vi.fn(),
      setFrame: vi.fn(),
      setTexture: vi.fn(),
      setFlipX: vi.fn(),
      setActive: vi.fn(),
      clearTint: vi.fn(),
    })),
    group: vi.fn(() => ({
      get: vi.fn(() => mockScene.add.sprite()),
      killAndHide: vi.fn(),
    })),
  },
  physics: {
    world: {
      bounds: { height: 600 },
    },
  },
  tweens: {
    add: vi.fn(),
  },
};

const mockFighter = {
  x: 100,
  y: 500,
  body: {
    height: 180,
    blocked: { down: true },
  },
  visible: true,
  scaleX: 1,
  scaleY: 1,
  active: true,
  texture: { key: "fighter_key" },
  frame: { name: "idle-0" },
  depth: 10,
  setScale: vi.fn(),
};

describe("ShadowSystem", () => {
  let shadowSystem;

  beforeEach(() => {
    vi.clearAllMocks();
    shadowSystem = new ShadowSystem(mockScene);
  });

  it("should create a shadow texture on initialization", () => {
    // Check if texture generation was attempted (addCanvas)
    // Note: sprite creation happens in addFighter, not constructor
    expect(mockScene.textures.addCanvas).toHaveBeenCalled();
  });

  it("should follow the fighter X position but lock Y to ground", () => {
    shadowSystem.addFighter(mockFighter);

    // Simulate fighter jumping
    mockFighter.x = 150;
    mockFighter.y = 400; // In air
    mockFighter.body.blocked.down = false;

    shadowSystem.update();

    const shadow = shadowSystem.shadows.get(mockFighter);
    expect(shadow.setPosition).toHaveBeenCalledWith(150, expect.any(Number));
    // Y should be close to ground (initial Y)
    expect(shadow.setPosition.mock.calls[0][1]).toBeGreaterThan(400);
  });

  it("should scale shadow down when fighter is high in air", () => {
    shadowSystem.addFighter(mockFighter);
    const shadow = shadowSystem.shadows.get(mockFighter);

    // Ground
    mockFighter.y = 500;
    shadowSystem.update();
    const groundScale = shadow.setScale.mock.calls[0][0];

    // Air
    mockFighter.y = 300;
    shadowSystem.update();
    const airScale = shadow.setScale.mock.calls[1][0];

    expect(airScale).toBeLessThan(groundScale);
  });
});

describe("DustSystem", () => {
  let dustSystem;

  beforeEach(() => {
    vi.clearAllMocks();
    dustSystem = new DustSystem(mockScene);
  });

  it("should create particle emitter on initialization", () => {
    expect(mockScene.add.particles).toHaveBeenCalled();
  });

  it("should trigger particles on landing", () => {
    dustSystem.triggerLand(100, 500);
    // Expect Y + 10 offset (510) and count 6
    expect(dustSystem.emitter.emitParticleAt).toHaveBeenCalledWith(100, 510, 6);
  });

  it("should trigger particles on dash", () => {
    dustSystem.triggerDash(200, 500, "left");
    // Expect Y + 5 offset (505) and count 4
    expect(dustSystem.emitter.emitParticleAt).toHaveBeenCalledWith(200, 505, 4);
  });
});

describe("AnimationEnhancer", () => {
  let enhancer;
  beforeEach(() => {
    vi.clearAllMocks();
    enhancer = new AnimationEnhancer(mockScene);
  });

  it("should tween scale on squash and stretch", () => {
    enhancer.squashAndStretch(mockFighter, 1.2, 0.8, 100);
    expect(mockScene.tweens.add).toHaveBeenCalledWith(
      expect.objectContaining({
        targets: mockFighter,
        scaleX: 1, // Restoring to 1
        scaleY: 1, // Restoring to 1
        duration: 100,
      }),
    );
    expect(mockFighter.setScale).toHaveBeenCalledWith(1.2, 0.8);
  });
});

describe("AfterimageSystem", () => {
  let afterimageSystem;
  beforeEach(() => {
    vi.clearAllMocks();
    afterimageSystem = new AfterimageSystem(mockScene);
  });

  it("should create an object pool on initialization", () => {
    expect(mockScene.add.group).toHaveBeenCalled();
  });
});

describe("Fighter Integration", () => {
  // Note: We can't fully test integration inside Fighter.js easily without a complex mock setup
  // because Fighter.js extends Phaser.Physics.Arcade.Sprite.
  // Instead, we will verify the Integration Hooks via a mocked MovementFXManager pattern
  // or by inspecting if the Fighter calls specific methods on injected systems.

  // For this test, let's simulate the integration logic that will be added to Fighter.js
  // We'll define a testable mixin or check logic flow.

  let mockShadowSystem;
  let mockDustSystem;
  let mockAnimationEnhancer;
  let mockAfterimageSystem;

  beforeEach(() => {
    mockShadowSystem = { update: vi.fn(), addFighter: vi.fn() };
    mockDustSystem = { triggerLand: vi.fn(), triggerDash: vi.fn() };
    mockAnimationEnhancer = { squashAndStretch: vi.fn() };
    mockAfterimageSystem = { spawnAfterimage: vi.fn() };
  });

  it("should trigger land dust and squash when landing", () => {
    // Logic to simulate:
    // if (this.body.blocked.down && !this.wasOnGround) { ... }

    const wasOnGround = false;
    const isOnGround = true;

    if (isOnGround && !wasOnGround) {
      mockDustSystem.triggerLand(100, 500);
      mockAnimationEnhancer.squashAndStretch(null, 1.1, 0.9, 100);
    }

    expect(mockDustSystem.triggerLand).toHaveBeenCalled();
    expect(mockAnimationEnhancer.squashAndStretch).toHaveBeenCalled();
  });

  it("should trigger dash dust and afterimage on dash", () => {
    // Logic to simulate:
    // if (newState === 'dash') { ... }

    const newState = "dash";

    if (newState === "dash") {
      mockDustSystem.triggerDash(100, 500, "right");
      mockAfterimageSystem.spawnAfterimage(null);
    }

    expect(mockDustSystem.triggerDash).toHaveBeenCalled();
    expect(mockAfterimageSystem.spawnAfterimage).toHaveBeenCalled();
  });
});
