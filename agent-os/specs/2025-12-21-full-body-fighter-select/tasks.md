# Task Breakdown: Full-Body Fighter Select Visuals

## Overview

Total Tasks: 3 Groups, 12 Tasks

## Task List

### Data & Configuration

#### Task Group 1: Roster Data Extension

**Dependencies:** None

- [x] 1.0 Update Roster Schema
  - [x] 1.1 Write 2 focused tests for `ConfigManager` roster data
    - Verify `fullBodyPath` is present for all characters
    - Verify `getCharacter` returns the new property
  - [x] 1.2 Update `src/config/gameData.json`
    - Add `fullBodyPath` to every character entry
    - Use placeholder paths (e.g., `assets/fighters/[id]/full-pose.png`)
  - [x] 1.3 Update `src/scenes/CharacterSelectScene.js` preloading
    - Ensure all `fullBodyPath` assets are loaded into the texture manager
  - [x] 1.4 Ensure data tests pass
    - Run ONLY the tests from 1.1

**Acceptance Criteria:**

- All characters have a valid `fullBodyPath` in the config.
- The selection scene successfully loads high-res textures for these paths.

### Layout & UI Design

#### Task Group 2: Split-Screen Layout Overhaul

**Dependencies:** Task Group 1

- [x] 2.0 Implement High-Res Fighter Presence
  - [x] 2.1 Write 2-4 focused tests for responsive layout constants
    - Verify P1 position relative to screen width (e.g., 25% for iPad)
    - Verify AI position relative to screen width (e.g., 75% for iPad)
  - [x] 2.2 Redesign `CharacterSelectScene.js` `create()`
    - Replace central portraits with large, anchored full-body sprites
    - Implement responsive positioning logic for iPad vs iPhone
  - [x] 2.3 Add "Spotlight" and Gradient effects
    - Create a pulsing radial gradient behind the active selection
    - Dim the background when AI reveal is in progress
  - [x] 2.4 Ensure layout tests pass
    - Run ONLY the tests from 2.1

**Acceptance Criteria:**

- Split-screen layout utilizes the full iPad height (1024px target).
- Poses are anchored correctly and look sharp on mobile displays.

### Animation & Logic

#### Task Group 3: Dramatic Reveal & Polish

**Dependencies:** Task Group 2

- [x] 3.0 Implement Reveal Sequence
  - [x] 3.1 Write 2-4 focused tests for Reveal state transitions
    - Verify `opponentCharacter` is assigned after P1 confirmation
    - Verify reveal animation triggers at the correct time
  - [x] 3.2 Implement AI Silhouette Cycling
    - Show a darkened/glitchy silhouette cycling on the right side
    - Synchronize with UI "tick" sounds
  - [x] 3.3 Final Reveal Polish
    - Trigger `SceneTransition.flash(200)` on final selection
    - Scale pulse the revealed AI sprite (1.2x)
  - [x] 3.4 Ensure reveal animation tests pass
    - Run ONLY the tests from 3.1

**Acceptance Criteria:**

- Confirmation leads to a professional, high-impact reveal animation.
- Audio and visual cues are perfectly synchronized.

## Execution Order

1. Roster Data Extension (Task Group 1)
2. Split-Screen Layout Overhaul (Task Group 2)
3. Dramatic Reveal & Polish (Task Group 3)
