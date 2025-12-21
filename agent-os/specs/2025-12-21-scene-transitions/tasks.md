# Task Breakdown: Scene Transitions

## Overview

Total Tasks: 4 Groups, 16 Tasks

## Task List

### Core System

#### Task Group 1: Loading Scene & Boot Flow

**Dependencies:** None

- [x] 1.0 Implement Loading Scene
  - [x] 1.1 Write 2-4 focused tests for `LoadingScene`
    - Verify scene creation and text rendering
    - Verify minimum display time logic
  - [x] 1.2 Create `src/scenes/LoadingScene.js`
    - Display "LOADING..." in `Press Start 2P` font
    - Add pulsing animation tween
    - Implement `startLoading(targetScene, data)` method
  - [x] 1.3 Update `BootScene.js`
    - Register `LoadingScene`
    - Transition to `LoadingScene` before `PreloadScene` (or as part of the flow)
  - [x] 1.4 Ensure Loading Scene tests pass
    - Run ONLY the tests from 1.1

**Acceptance Criteria:**

- `LoadingScene` displays correctly with animated text
- `BootScene` transitions smoothly to the loading state

### Application Flow

#### Task Group 2: System-Wide Transition Integration

**Dependencies:** Task Group 1

- [x] 2.0 Integrate SceneTransition Utility
  - [x] 2.1 Write 2-4 focused tests for Transition Presets
    - Verify correct preset values are returned
    - Verify `transitionTo` calls the underlying transition method
  - [x] 2.2 Update `MainMenuScene.js` transitions
    - Use `WIPE_RADIAL` (preset: `MENU_TO_SELECT`) to go to `CharacterSelectScene`
  - [x] 2.3 Update `CharacterSelectScene.js` transitions
    - Use `WIPE_HORIZONTAL` (preset: `SELECT_TO_ARENA`) to go to `ArenaSelectScene`
    - Use `FADE` (preset: `BACK_TO_MENU`) to go back
  - [x] 2.4 Update `ArenaSelectScene.js` transitions
    - Use `CURTAIN` (preset: `ARENA_TO_FIGHT`) to go to `FightScene`
  - [x] 2.5 Ensure Transition tests pass
    - Run ONLY the tests from 2.1

**Acceptance Criteria:**

- Navigating between menus uses the specified stylish transitions
- No visual glitches or stuck overlays during transitions

### Intermediate Scenes

#### Task Group 3: Victory & Continue Scenes

**Dependencies:** Task Group 2

- [x] 3.0 Implement Post-Match Screens
  - [x] 3.1 Write 2-4 focused tests for Victory/Continue Logic
    - Verify data passing (winner stats) to `VictoryScene`
    - Verify countdown timer logic in `ContinueScene`
  - [x] 3.2 Create `src/scenes/VictoryScene.js`
    - Receive fight data (winner, health, combo, time)
    - Render Arcade-style "PLAYER X WINS" text
    - Render stats block
    - Add "CLAIM REWARD" and "MAIN MENU" interactive text/buttons
  - [x] 3.3 Create `src/scenes/ContinueScene.js`
    - Receive restart data (chars, arena)
    - Render large 10-second countdown
    - Implement "Tap to Continue" -> Restart Fight
    - Implement Timeout -> Game Over -> Main Menu
  - [x] 3.4 Ensure Scene logic tests pass
    - Run ONLY the tests from 3.1

**Acceptance Criteria:**

- `VictoryScene` displays correct match stats
- `ContinueScene` counts down and routes correctly based on input/timeout

### Combat Integration

#### Task Group 4: Fight Flow Refactor

**Dependencies:** Task Group 3

- [x] 4.0 Refactor Fight End Sequence
  - [x] 4.1 Write 2-4 focused tests for Fight End Routing
    - Verify routing to `VictoryScene` on win
    - Verify routing to `ContinueScene` on loss (vs AI)
  - [x] 4.2 Update `FightScene.js` End Logic
    - Remove direct `VictorySlideshow` trigger
    - Implement conditional routing:
      - If P1 Wins: Transition to `VictoryScene` (preset: `FIGHT_TO_VICTORY`)
      - If P1 Loses (AI Mode): Transition to `ContinueScene` (preset: `QUICK`)
  - [x] 4.3 Refactor `VictorySlideshow.js`
    - Modify to be triggered explicitly by `VictoryScene` "CLAIM REWARD"
    - Ensure it exits to `ArenaSelectScene` (or `MainMenu`) after completion
  - [x] 4.4 Run Fight Flow tests
    - Run ONLY the tests from 4.1

**Acceptance Criteria:**

- Winning a fight leads to Stats -> Slideshow -> Menu
- Losing a fight (vs AI) leads to Continue -> Restart/Menu

## Execution Order

1. Loading Scene & Boot Flow (Task Group 1)
2. System-Wide Transition Integration (Task Group 2)
3. Victory & Continue Scenes (Task Group 3)
4. Fight Flow Refactor (Task Group 4)
