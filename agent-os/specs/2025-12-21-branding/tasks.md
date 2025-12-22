# Task Breakdown: Branding

## Overview

Total Tasks: 4

## Task List

### Frontend Scenes

#### Task Group 1: Branding Scenes Implementation

**Dependencies:** None

- [x] 1.0 Implement Branding Scenes
  - [x] 1.1 Write 2-8 focused tests for Splash and Credits scenes
    - Test `SplashScene` initialization and transition logic (mocking timer/tween)
    - Test `CreditsScene` rendering and "Back" button interaction
    - Test Easter Egg counter logic in `CreditsScene`
  - [x] 1.2 Create `SplashScene.js`
    - Display centered Logo
    - Implement FadeIn -> Hold -> FadeOut animation sequence
    - Add "Tap to Skip" handler
    - Auto-transition to `MainMenuScene` on complete
  - [x] 1.3 Create `CreditsScene.js`
    - Display static credits text ("Created by...", "Made with love...")
    - Implement "Back" button to return to `MainMenuScene`
    - Use `SceneTransition` for entry/exit
  - [x] 1.4 Implement Easter Egg Logic
    - Add interactive element (e.g., Heart icon or specific text) in `CreditsScene`
    - Track clicks; trigger sound/effect on 5th click
  - [x] 1.5 Ensure Branding Scenes tests pass
    - Run ONLY the tests written in 1.1

**Acceptance Criteria:**

- `SplashScene` plays on boot and transitions to Main Menu.
- `CreditsScene` displays correct text and allows navigation back.
- Tapping the Easter Egg trigger produces a distinct result.

### Integration

#### Task Group 2: Game Flow Integration

**Dependencies:** Task Group 1

- [x] 2.0 Integrate Branding into Game Flow
  - [x] 2.1 Write 2-8 focused tests for Integration
    - Test `PreloadScene` transitions to `SplashScene`
    - Test `MainMenuScene` transitions to `CreditsScene`
  - [x] 2.2 Update `PreloadScene.js`
    - Change transition target from `MainMenuScene` to `SplashScene`
  - [x] 2.3 Update `MainMenuScene.js`
    - Add "Credits" button (text/icon)
    - Implement transition to `CreditsScene`
  - [x] 2.4 Register New Scenes
    - Add `SplashScene` and `CreditsScene` to the Game Config / Main Entry point
  - [x] 2.5 Ensure Integration tests pass
    - Run ONLY the tests written in 2.1

**Acceptance Criteria:**

- Game boots sequence: Preload -> Splash -> Main Menu.
- Main Menu has a working "Credits" button.
- Transitions are smooth and consistent.

### Testing

#### Task Group 3: Test Review & Gap Analysis

**Dependencies:** Task Groups 1-2

- [x] 3.0 Review existing tests and fill critical gaps only
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review the tests written in 1.1 and 2.1
  - [x] 3.2 Analyze test coverage gaps for Branding only
    - Check if "Tap to Skip" on Splash is adequately tested
    - Check if Easter Egg trigger reset works (if user leaves and comes back)
  - [x] 3.3 Write up to 10 additional strategic tests maximum
    - Add tests for edge cases (e.g., spamming credits button)
  - [x] 3.4 Run feature-specific tests only
    - Run ONLY tests related to Branding scenes
    - Verify smooth user flow

**Acceptance Criteria:**

- All Branding-related tests pass.
- User flow is verified stable.

## Execution Order

Recommended implementation sequence:

1. Branding Scenes Implementation (Task Group 1)
2. Game Flow Integration (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)
