# Task Breakdown: Accessibility & QoL

## Overview

Total Tasks: 4 Groups

## Task List

### Gameplay & Scenes (Phaser)

#### Task Group 1: Scene & Pause Logic

**Dependencies:** None

- [x] 1.0 Implement Core Pause & Tutorial Logic
  - [x] 1.1 Write 2-4 focused tests for `PauseScene` and Tutorial Persistence
    - Test `localStorage` reading/writing for `has_seen_tutorial`
    - Test `PauseScene` launch/resume logic (mocking scene manager)
    - Test audio toggle state persistence
  - [x] 1.2 Create `PauseScene` class
    - Implement `create` method with semi-transparent background (alpha 0.8)
    - Implement `Resume`, `Audio Toggle`, and `Quit` button interactive texts
    - Handle `pointerdown` events to resume `FightScene` or exit to `MainMenu`
    - Ensure input propagation is stopped
  - [x] 1.3 Implement Pause Trigger in `FightScene`
    - Add "Pause" icon/text button in top-right HUD (z-depth > 100)
    - Connect button to `this.scene.pause('FightScene')` and `this.scene.launch('PauseScene')`
    - Ensure game loop/physics actually stops
  - [x] 1.4 Implement Tutorial Overlay Logic in `FightScene`
    - Check `localStorage` for `has_seen_tutorial` in `create()`
    - If false, pause game and launch `TutorialOverlay` (or create internal container)
    - On dismiss: unpause, set `localStorage` flag
  - [x] 1.5 Ensure Scene tests pass
    - Run ONLY the 2-4 tests written in 1.1

**Acceptance Criteria:**

- Pressing Pause stops the fight logic immediately
- "Resume" continues exactly where left off
- Tutorial appears ONLY on first load (clearing local storage resets it)

### UI & UX (Phaser)

#### Task Group 2: Visual Implementation

**Dependencies:** Task Group 1

- [x] 2.0 Build Visual Elements
  - [x] 2.1 Write 2-4 focused tests for UI positioning
    - Test button coordinate logic (relative to screen width/height)
    - Test Touch Zone overlay dimensions matches `TouchInputController` logic
  - [x] 2.2 Implement Touch Zone Indicators
    - Create `Graphics` objects in `FightScene` (or HUD layer)
    - Left Zone: Blue gradient (alpha 0.1), width 50%
    - Right Zone: Red gradient (alpha 0.1), width 50%
    - Ensure they are visually subtle but distinct
  - [x] 2.3 Style the Pause Menu
    - Use "Press Start 2P" font (Gold/Red palette from MainMenu)
    - Add hover effects (White on hover)
    - Add simple background panel (Rounded rectangle or dark overlay)
  - [x] 2.4 Style the Tutorial Overlay
    - Create "Swipe" and "Tap" visual hints (text + simple arrow icons/graphics)
    - Layout: Left side "Movement", Right side "Combat"
    - "Tap to Start" blinking text at bottom
  - [x] 2.5 Ensure UI tests pass
    - Run ONLY the 2-4 tests written in 2.1

**Acceptance Criteria:**

- Touch zones clearly visible but not distracting
- Pause menu matches game aesthetic (Font/Colors)
- Tutorial text is legible on top of game background

### Feature Integration

#### Task Group 3: Post-Match & Audio Integration

**Dependencies:** Task Group 2

- [x] 3.0 Complete Rematch & Audio Features
  - [x] 3.1 Write 2-4 focused tests for Rematch logic
    - Test `VictoryScene` data passing for restart
    - Test `AudioManager` toggle function
  - [x] 3.2 Implement "Rematch" Button in `VictoryScene`
    - Add button next to "Claim Reward"
    - On click: `transitionTo('FightScene', { ...prevData })`
    - Ensure all fight parameters (fighters, background, etc.) are preserved
  - [x] 3.3 Connect Audio Toggle in Pause Menu
    - Link toggle button to `this.sound.mute` or `AudioManager.setVolume`
    - Update button text/icon to reflect state (ON/OFF)
  - [x] 3.4 Ensure Integration tests pass
    - Run ONLY the 2-4 tests written in 3.1

**Acceptance Criteria:**

- Rematch immediately restarts fight with same chars/stage
- Muting in pause menu silences game immediately

### Testing

#### Task Group 4: Final Verification

**Dependencies:** Task Groups 1-3

- [x] 4.0 Review and Polish
  - [x] 4.1 Manual Playthrough Check
    - Verify Tutorial -> Fight -> Pause -> Resume -> Fight -> Win -> Rematch flow
    - Verify "Quit" correctly cleans up and returns to Main Menu
  - [x] 4.2 Fill Critical Test Gaps
    - Write up to 4 E2E tests for the full "Pause -> Resume" and "Rematch" flow
  - [x] 4.3 Run Feature Tests
    - Run all tests from groups 1.1, 2.1, 3.1, and 4.2

**Acceptance Criteria:**

- Full flow is smooth and bug-free on mobile resolution simulation
- No "bleeding" of inputs through overlays

## Execution Order

1. Scene & Pause Logic (Task Group 1)
2. Visual Implementation (Task Group 2)
3. Post-Match & Audio Integration (Task Group 3)
4. Final Verification (Task Group 4)
