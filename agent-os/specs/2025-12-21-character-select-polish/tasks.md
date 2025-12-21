# Task Breakdown: Character Select Polish

## Overview

Total Tasks: 3 Groups, 12 Tasks

## Task List

### Scene Logic & State

#### Task Group 1: Opponent Reveal Sequence

**Dependencies:** None

- [x] 1.0 Implement Opponent Roll Logic
  - [x] 1.1 Write 2-4 focused tests for `CharacterSelectScene` reveal logic
    - Verify that opponent ID is chosen randomly (excluding P1)
    - Verify that state includes `opponentCharacter`
  - [x] 1.2 Update `CharacterSelectScene.js` to handle random opponent selection
    - Filter roster to exclude player selection
    - Store result in `this.opponentCharacter`
  - [x] 1.3 Implement "Slot Machine" icon cycling animation
    - Rapidly update opponent icon/portrait for 500ms
    - Sync with UI "tick" sound
  - [x] 1.4 Ensure reveal logic tests pass
    - Run ONLY the tests from 1.1

**Acceptance Criteria:**

- Tapping "SELECT" triggers a rapid visual cycle of icons on the opponent side.
- The cycle stops on a valid opponent ID that is not the player's character.

### Visual Polish

#### Task Group 2: VS Splash & UI Transitions

**Dependencies:** Task Group 1

- [x] 2.0 Implement Splash Animations
  - [x] 2.1 Write 2-4 focused tests for Portrait Animations
    - Verify that portraits scale up upon confirmation
    - Verify that grid alpha reaches 0
  - [x] 2.2 Implement Portrait Scaling & Splash
    - Scale P1 and Opponent portraits to 1.2x
    - Use `SceneTransition.flash(200)` for impact
  - [x] 2.3 Implement UI Fading
    - Fade out `gridItems`, `selectBtn`, and "BACK" text during splash
  - [x] 2.4 Ensure animation tests pass
    - Run ONLY the tests from 2.1

**Acceptance Criteria:**

- Confirmation leads to a dramatic screen flash and portrait pulse.
- Background UI (grid/buttons) disappears to focus on the "VS" matchup.

### Integration & Audio

#### Task Group 3: Audio Sync & Data Handoff

**Dependencies:** Task Group 2

- [x] 3.0 Finalize Flow and Audio
  - [x] 3.1 Write 2-4 focused tests for Data Persistence
    - Verify `ArenaSelectScene` receives both P1 and Opponent IDs
  - [x] 3.2 Synchronize Audio Events
    - Trigger P1 Announcer name on SELECT tap
    - Trigger Opponent Announcer name after roll completion
    - Sync roll ticks with visual swaps
  - [x] 3.3 Update Scene Transition Handoff
    - Ensure `this.transition.transitionTo` passes `{ playerCharacter, opponentCharacter }`
  - [x] 3.4 Ensure integration tests pass
    - Run ONLY the tests from 3.1

**Acceptance Criteria:**

- Announcer voice lines are timed correctly with character reveals.
- Both character choices are preserved when entering the Arena Select screen.

## Execution Order

1. Opponent Reveal Sequence (Task Group 1)
2. VS Splash & UI Transitions (Task Group 2)
3. Audio Sync & Data Handoff (Task Group 3)
