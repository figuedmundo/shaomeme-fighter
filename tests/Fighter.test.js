import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fighter, { FighterState } from '../src/components/Fighter';

// Mock Phaser
const mockScene = {
  add: {
    existing: vi.fn(),
  },
  physics: {
    add: {
      existing: vi.fn(),
    },
  },
  anims: {
    create: vi.fn(),
    generateFrameNumbers: vi.fn(),
  },
  input: {
    keyboard: {
      checkDown: vi.fn(),
    },
  },
};

// Mock Sprite
vi.mock('phaser', () => {
  return {
    default: {
      Physics: {
        Arcade: {
          Sprite: class {
            constructor() {
              this.body = {
                setSize: vi.fn(),
                setOffset: vi.fn(),
                blocked: { down: true },
              };
              this.setCollideWorldBounds = vi.fn();
              this.setOrigin = vi.fn();
              this.setVelocityX = vi.fn();
              this.setVelocityY = vi.fn();
              this.setFlipX = vi.fn();
              this.play = vi.fn();
              this.on = vi.fn();
              this.anims = {
                isPlaying: false,
                currentAnim: { key: '' },
              };
              this.texture = { key: 'ryu' };
            }
          },
        },
      },
    },
  };
});

describe('Fighter', () => {
  let fighter;

  beforeEach(() => {
    fighter = new Fighter(mockScene, 0, 0, 'ryu');
  });

  it('should initialize with IDLE state', () => {
    expect(fighter.currentState).toBe(FighterState.IDLE);
  });

  it('should transition to WALK state when moving left/right', () => {
    // Mock controls
    fighter.setControls(
      {
        left: { isDown: true },
        right: { isDown: false },
        up: { isDown: false },
        down: { isDown: false },
      },
      { attack: { isDown: false } }
    );

    fighter.update();
    expect(fighter.currentState).toBe(FighterState.WALK);
    expect(fighter.setVelocityX).toHaveBeenCalled();
  });

  it('should transition to JUMP state when moving up', () => {
    fighter.setControls(
      {
        left: { isDown: false },
        right: { isDown: false },
        up: { isDown: true },
        down: { isDown: false },
      },
      { attack: { isDown: false } }
    );

    fighter.update();
    expect(fighter.currentState).toBe(FighterState.JUMP);
  });
});
