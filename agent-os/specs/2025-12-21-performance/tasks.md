# Task Breakdown: Performance Optimization

## Overview

Total Tasks: 4

## Task List

### Frontend Optimization

#### Task Group 1: Lazy Loading Implementation

**Dependencies:** None

- [x] 1.0 Implement JIT Loading in LoadingScene
  - [x] 1.1 Write 2-8 focused tests for LoadingScene
    - Test `startLoading` with asset queueing
    - Test successful transition after assets load
    - Test duplicate asset check (don't load if already exists)
  - [x] 1.2 Update `LoadingScene.js` to handle JIT loading
    - Accept `player1`, `player2`, `arena` in `targetData`
    - Check `this.textures.exists(key)`
    - Use `this.load.spritesheet` and `this.load.image` dynamically
    - Listen for `complete` event to trigger transition
  - [x] 1.3 Refactor `PreloadScene.js`
    - Remove the loop loading all fighter spritesheets
    - Keep only UI and Audio assets
  - [x] 1.4 Ensure LoadingScene tests pass
    - Run ONLY the tests written in 1.1

**Acceptance Criteria:**

- `PreloadScene` no longer loads fighter sprites (verify console logs or network tab manually if needed, but tests cover code removal).
- `LoadingScene` successfully loads requested assets and starts target scene.
- Game boots faster.

### Memory Management

#### Task Group 2: Resource Cleanup

**Dependencies:** Task Group 1

- [x] 2.0 Implement Asset Cleanup
  - [x] 2.1 Write 2-8 focused tests for FightScene cleanup
    - Test `shutdown` method calls `textures.remove`
    - Test `anims.remove` for fighter animations
  - [x] 2.2 Update `FightScene.js` shutdown logic
    - Implement `shutdown()` method (Phaser scene lifecycle)
    - Track assets used in the fight
    - Remove specific textures and animations on exit
  - [x] 2.3 Verify `ArenaSelectScene` cleanup (optional)
    - Ensure large preview images are handled or reused effectively
  - [x] 2.4 Ensure Cleanup tests pass
    - Run ONLY the tests written in 2.1

**Acceptance Criteria:**

- `FightScene` frees fighter and arena textures upon returning to menu or scene switch.
- Memory usage does not grow unbounded with repeated fights.

### Dev Tools

#### Task Group 3: Asset Optimization Scripts

**Dependencies:** None

- [x] 3.0 Create Optimization Scripts
  - [x] 3.1 Create `scripts/optimize-assets.js`
    - Use `sharp` (if available) or standard Node fs to scan `public/assets`
    - Log which files would be optimized (dry run or actual if safe)
    - Focus on finding large PNGs (>1MB) and warning about them
  - [x] 3.2 Add `npm run optimize` command
    - Update `package.json`
  - [x] 3.3 Verify script runs
    - Run `npm run optimize` and check output

**Acceptance Criteria:**

- Script runs without error and identifies optimization targets.

### Testing

#### Task Group 4: Test Review & Gap Analysis

**Dependencies:** Task Groups 1-3

- [ ] 4.0 Review existing tests and fill critical gaps only
  - [ ] 4.1 Review tests from Task Groups 1-2
    - Review the tests written in 1.1 and 2.1
  - [ ] 4.2 Analyze test coverage gaps for Performance logic
    - Check if fallback loading (missing asset) logic is tested
  - [ ] 4.3 Write up to 10 additional strategic tests maximum
    - Add test for `PreloadScene` fast-path (ensure it still loads UI)
  - [ ] 4.4 Run feature-specific tests only
    - Run ONLY tests related to Loading and Performance

**Acceptance Criteria:**

- All performance-related tests pass.
- Game flow (Preload -> Menu -> Fight) works with new lazy loading.

## Execution Order

Recommended implementation sequence:

1. Lazy Loading Implementation (Task Group 1)
2. Resource Cleanup (Task Group 2)
3. Asset Optimization Scripts (Task Group 3)
4. Test Review & Gap Analysis (Task Group 4)
