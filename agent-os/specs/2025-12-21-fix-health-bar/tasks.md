# Task Breakdown: Smooth Health Bar Fix

## Overview

Total Tasks: 11

## Task List

### Core Systems Integration

#### Task Group 1: Scene Integration

**Dependencies:** None

- [x] 1.0 Integrate UI update loop
  - [x] 1.1 Write 3 focused tests in `tests/UIManager.test.js` or a new integration test
    - Verify `uiManager.update` is called during scene update (mocked)
    - Verify `uiManager.updateHealth` is called when fighter takes damage
    - Verify health values are passed correctly to `uiManager`
  - [x] 1.2 Add `this.uiManager.update()` to `src/scenes/FightScene.js` update loop
  - [x] 1.3 Verify that `this.uiManager.updateHealth(playerNum, this.health)` in `Fighter.js` is reaching the `UIManager` correctly
  - [x] 1.4 Ensure integration tests pass

**Acceptance Criteria:**

- `UIManager.update()` is called every frame in `FightScene`.
- Health changes are immediately propagated to the `UIManager`.

### UI Component Logic

#### Task Group 2: Health Bar Animation

**Dependencies:** Task Group 1

- [x] 2.0 Refine smooth depletion logic
  - [x] 2.1 Write 4 focused tests in `tests/UIManager.test.js`
    - Test that `updateHealth` triggers an immediate call to `drawHealthBars`
    - Test that `p1GhostHealth` remains at the old value immediately after `updateHealth`
    - Test that `p1GhostHealth` lerps toward `p1Health` after multiple calls to `update()`
    - Test that `drawHealthBars` is called when ghost health is lerping
  - [x] 2.2 Update `UIManager.updateHealth()` in `src/systems/UIManager.js` to call `this.drawHealthBars()` immediately for instant feedback
  - [x] 2.3 Verify and refine the lerp logic in `UIManager.update()` to ensure the ghost bar follows smoothly without snapping too early
  - [x] 2.4 Ensure UIManager unit tests pass

**Acceptance Criteria:**

- Colored health bar updates instantly on hit.
- White ghost bar smoothly follows the colored bar.
- Animation is fluid at 60 FPS.

### Testing & Quality

#### Task Group 3: Test Review & Final Verification

**Dependencies:** Task Groups 1-2

- [x] 3.0 Final verification
  - [x] 3.1 Review and run all feature-specific tests (approx 7-10 tests)
  - [x] 3.2 Perform manual check (or simulated animation check) to verify "smoothness" feel
  - [x] 3.3 Verify no regression in `CriticalMomentsManager` health pulse logic (HP < 20%)

**Acceptance Criteria:**

- All feature-specific tests pass.
- Health bar depletion feels "smooth" and responsive as per user request.

## Execution Order

Recommended implementation sequence:

1. Scene Integration (Task Group 1) - Fixes the "not decreasing" bug.
2. Health Bar Animation (Task Group 2) - Fixes the "smoothness" requirement.
3. Final Verification (Task Group 3) - Ensures quality and consistency.
