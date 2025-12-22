# Task Breakdown: Auto Reward Flow

## Overview

Total Tasks: 6

## Task List

### Core Logic

#### Task Group 1: Routing & Transitions

**Dependencies:** None

- [x] 1.0 Implement automated win routing
  - [x] 1.1 Write 2 focused tests in `tests/FightFlow.test.js` (or similar)
    - Verify that `VictorySlideshow.show` is called on win.
    - Verify that `VictoryScene` is no longer used in the transition.
  - [x] 1.2 Update `FightScene.js`'s `checkWinCondition` to trigger a fade-out and then the slideshow.
  - [x] 1.3 Ensure `ContinueScene` is still triggered correctly on loss.

**Acceptance Criteria:**

- Winning a fight triggers the slideshow automatically.
- Losing a fight still triggers the continue screen.

### UI Components

#### Task Group 2: Slideshow Polish

**Dependencies:** Task Group 1

- [x] 2.0 Update Slideshow Exit Logic
  - [x] 2.1 Update `VictorySlideshow.js` to transition to `MainMenuScene` on exit.
  - [x] 2.2 Verify that the "EXIT" button cleans up resources properly.

**Acceptance Criteria:**

- Exiting the slideshow returns the player to the Main Menu.

### Cleanup

#### Task Group 3: Cleanup

**Dependencies:** Task Group 1-2

- [x] 3.0 Final verification and dead code check
  - [x] 3.1 Run all tests to ensure no regressions.
  - [x] 3.2 (Optional) Remove or comment out `VictoryScene.js` imports to ensure it's truly bypassed.

**Acceptance Criteria:**

- Entire flow works smoothly without errors.

## Execution Order

Recommended implementation sequence:

1. Routing & Transitions (Task Group 1) - The core functional change.
2. Slideshow Polish (Task Group 2) - Ensuring the exit flow is correct.
3. Cleanup (Task Group 3) - Verification.
