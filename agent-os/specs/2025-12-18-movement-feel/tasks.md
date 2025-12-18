# Task Breakdown: Movement Feel

## Overview

Total Tasks: 4 Task Groups

## Task List

### Core Logic

#### Task Group 1: Shadow & Dust Systems

**Dependencies:** None

- [x] 1.0 Implement Shadow and Dust Systems
  - [x] 1.1 Write 2-8 focused tests for Shadow and Dust logic
    - Test `ShadowSystem` positioning logic (ground clamping, scaling with height)
    - Test `DustSystem` emitter creation and trigger methods
    - Skip testing actual Phaser rendering (use mocks)
  - [x] 1.2 Implement `ShadowSystem` class
    - Create procedural "soft blob" texture
    - Implement `update(fighter)` method to track X and ground Y
    - Implement scaling logic based on jump height
  - [x] 1.3 Implement `DustSystem` class
    - Create procedural "dust cloud" texture (reusing HitFeedback pattern)
    - Setup particle emitter configuration (lifespan, alpha, scale)
    - Implement triggers: `triggerLand()`, `triggerDash()`, `triggerTurn()`
  - [x] 1.4 Ensure Core Logic tests pass
    - Run ONLY the tests written in 1.1
    - Verify shadow positioning and dust trigger logic

**Acceptance Criteria:**

- Tests pass for shadow positioning calculations
- Shadow sprite follows fighter X but stays at ground Y
- Dust emitter is configured correctly and triggers fire without errors

### Animation Logic

#### Task Group 2: Squash/Stretch & Afterimages

**Dependencies:** Task Group 1

- [x] 2.0 Implement Animation Enhancements
  - [x] 2.1 Write 2-8 focused tests for Animation Enhancer
    - Test squash/stretch tween configuration (values, duration)
    - Test afterimage spawning logic (cooldowns, pool management)
  - [x] 2.2 Implement `AnimationEnhancer` class (or methods in Fighter)
    - Add `squashAndStretch(scaleX, scaleY, duration)` method
    - Use Phaser Tweens to animate scale and restore to 1.0
  - [x] 2.3 Implement `AfterimageSystem`
    - Create object pool for sprite clones
    - Implement `spawnAfterimage(fighter)` method (clone frame, set alpha, fade tween)
    - Implement update loop for managing active afterimages
  - [x] 2.4 Ensure Animation Logic tests pass
    - Run ONLY the tests written in 2.1
    - Verify tween configs and pool logic

**Acceptance Criteria:**

- Tests pass for animation logic
- Squash/Stretch tweens are created with correct parameters
- Afterimages are spawned and recycled correctly (no memory leaks)

### Integration

#### Task Group 3: Fighter Integration

**Dependencies:** Task Group 2

- [x] 3.0 Integrate Effects with Fighter
  - [x] 3.1 Write 2-8 focused tests for Integration hooks
    - Test `Fighter.setState` triggers for Jump/Land events
    - Test `Fighter.update` hooks for detecting landing (blocked.down)
  - [x] 3.2 Update `Fighter.js` to use `ShadowSystem`
    - Instantiate `ShadowSystem` in constructor
    - Call `shadowSystem.update()` in `preUpdate` or `update`
  - [x] 3.3 Update `Fighter.js` with `DustSystem` hooks
    - Trigger `triggerLand` when `body.blocked.down` becomes true
    - Trigger `triggerDash` on dash state entry
  - [x] 3.4 Hook up Squash & Stretch
    - Call `squashAndStretch` on Jump Takeoff and Landing
  - [x] 3.5 Hook up Afterimages
    - Call `spawnAfterimage` during high-velocity states (Dash, Special)
  - [x] 3.6 Ensure Integration tests pass
    - Run ONLY the tests written in 3.1
    - Verify Fighter events trigger the correct system methods

**Acceptance Criteria:**

- Tests pass for event hooks
- Shadow appears and moves with fighter
- Dust appears on landing
- Character deforms on jump/land
- Afterimages appear during dashes

### Testing

#### Task Group 4: Visual Verification & Polish

**Dependencies:** Task Groups 1-3

- [x] 4.0 Verify and Polish Effects
  - [x] 4.1 Manual Visual Verification
    - Run the game and test all 4 effects on desktop
    - Test on mobile (if possible) or simulate touch
  - [x] 4.2 Tune "Juice" Values
    - Adjust shadow opacity/scale factors
    - Tweak dust particle lifespan and count
    - Refine squash/stretch ratios (ensure 5-10% limit)
    - Adjust afterimage fade duration
  - [x] 4.3 Write 2-4 Integration Tests for System Coordination
    - Ensure all systems work together without errors
    - Verify cleanup on scene shutdown
  - [x] 4.4 Run Integration tests
    - Run ONLY the tests written in 4.3

**Acceptance Criteria:**

- Visuals match the "Movement Feel" requirements (subtle, grounded, arcade-like)
- No significant frame drops on mobile simulation
- All systems clean up correctly on restart/scene change

## Execution Order

Recommended implementation sequence:

1. Core Logic (Shadows & Dust)
2. Animation Logic (Squash/Stretch & Afterimages)
3. Integration (Fighter hooks)
4. Visual Verification & Polish
