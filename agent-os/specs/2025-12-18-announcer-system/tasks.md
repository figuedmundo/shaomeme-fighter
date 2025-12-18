# Task Breakdown: Announcer/System (Task 2.2)

## Overview

Total Tasks: 4

## Task List

### Audio Infrastructure

#### Task Group 1: Announcer Audio System

**Dependencies:** None

- [x] 1.0 Extend AudioManager for Announcer Support
  - [x] 1.1 Write 2-8 focused tests for `AudioManager.js`
    - Test new `playAnnouncer` method
    - Test priority/queueing logic (e.g., KO interrupting Combo)
    - Test volume control for new channel
  - [x] 1.2 Update `PreloadScene.js`
    - Load Announcer audio assets (placeholders if needed)
    - Path: `resources/audio/announcer/`
    - Assets: rounds (1-3, final), results (win, lose, perfect, ko), combo (3, 5, ultra), fight
  - [x] 1.3 Update `AudioManager.js` implementation
    - Add `playAnnouncer(key)` method
    - Implement simple priority/interrupt logic
    - Add `announcer` volume channel (default 1.0)
  - [x] 1.4 Ensure Audio tests pass
    - Run ONLY the tests written in 1.1
    - Verify `playAnnouncer` works as expected

**Acceptance Criteria:**

- `AudioManager.playAnnouncer('fight')` plays the sound
- Announcer channel volume can be controlled independently
- KO sound interrupts previous announcer lines if necessary

### Visual & HUD Components

#### Task Group 2: Announcer Overlays & Fonts

**Dependencies:** None

- [x] 2.0 Implement Visual Overlays
  - [x] 2.1 Write 2-8 focused tests for `AnnouncerOverlay` component
    - Test visibility states (Round 1, Fight, KO)
    - Test text content updates
    - Test MK font loading/fallback
  - [x] 2.2 Setup Mortal Kombat Font
    - Copy `MK4.woff` from `refs/` to `public/fonts/`
    - Add `@font-face` to `src/styles/overlays.css` (create if needed)
  - [x] 2.3 Create `src/components/AnnouncerOverlay.js`
    - Methods: `showRound(num)`, `showFight()`, `showKO()`, `showWin(name)`
    - Style: Center screen, MK font, gradient fill, drop shadow
  - [x] 2.4 Create `src/components/ComboOverlay.js`
    - Methods: `updateCombo(count)`, `showMilestone(text)`
    - Style: Side placement, scale animation on hit
  - [x] 2.5 Ensure Visual tests pass
    - Run ONLY the tests written in 2.1
    - Verify text renders with correct styles

**Acceptance Criteria:**

- MK Font loads and renders
- "Round 1", "FIGHT!", "KO" overlays appear centered and styled
- Combo counter appears on side and updates

### Gameplay Integration

#### Task Group 3: Scene Integration

**Dependencies:** Task Groups 1 & 2

- [x] 3.0 Integrate Announcer into Scenes
  - [x] 3.1 Write 2-8 focused tests for `FightScene` integration
    - Test Round Start sequence timing (Input freeze -> Round -> Fight -> Input unlock)
    - Test Combo counter increment logic
    - Test Victory sequence triggering
  - [x] 3.2 Update `FightScene.js` (Round Start)
    - Block input on start
    - Sequence: Round Audio/Text -> 1s delay -> Fight Audio/Text -> Unlock
  - [x] 3.3 Update `FightScene.js` (Combo System)
    - Track hits and timestamps
    - Trigger `ComboOverlay` updates
    - Trigger `AudioManager.playAnnouncer` on milestones (3, 5, 7)
  - [x] 3.4 Update `FightScene.js` (Match End)
    - Trigger `showKO()` and `playKO()` on HP 0
    - Trigger `showWin()` and `playWin()` after delay
  - [x] 3.5 Update `CharacterSelectScene.js`
    - Play character name audio on selection confirmation
  - [x] 3.6 Ensure Integration tests pass
    - Run ONLY the tests written in 3.1
    - Verify game flow matches requirements

**Acceptance Criteria:**

- Round start prevents movement until "FIGHT!"
- Combos display visually and play audio on milestones
- Victory sequence plays "KO" then "You Win"
- Character select plays names

### Testing

#### Task Group 4: Test Review & Polish

**Dependencies:** Task Groups 1-3

- [x] 4.0 Final Polish & Gap Analysis
  - [x] 4.1 Review existing tests
    - Review tests from 1.1, 2.1, 3.1
  - [x] 4.2 Analyze coverage gaps
    - Focus on edge cases (e.g., simultaneous KO, rapid combos)
    - Check mobile performance of overlays
  - [x] 4.3 Write up to 10 additional tests
    - Fill critical gaps found in 4.2
  - [x] 4.4 Run feature-specific tests
    - Run all Announcer-related tests
    - Verify complete flow

**Acceptance Criteria:**

- All announcer features work smoothly
- No visual glitches or audio overlap issues
- Performance remains high (60FPS) on target devices

## Execution Order

1. Audio Infrastructure (Task Group 1)
2. Visual & HUD Components (Task Group 2)
3. Gameplay Integration (Task Group 3)
4. Test Review & Polish (Task Group 4)
