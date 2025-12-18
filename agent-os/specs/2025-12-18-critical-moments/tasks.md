# Task Breakdown: Critical Moments

## Overview

Total Tasks: 4 Task Groups

## Task List

### Core Logic Systems

#### Task Group 1: Hit Logic Extensions (Lethal Hit & Slow Motion)

**Dependencies:** None

- [x] 1.0 Implement Critical Hit Logic
  - [x] 1.1 Write 2-8 focused tests for Hit Logic
    - Test `HitFeedbackSystem.hitStop` with standard vs custom durations
    - Test time scale manipulation logic (mocking `scene.time.timeScale`)
    - Test "Lethal Hit" detection logic
  - [x] 1.2 Extend `HitFeedbackSystem` for Lethal Freeze
    - Update `triggerHitFeedback` to accept `isLethal` flag
    - Implement override logic: if `isLethal`, use 500ms duration instead of standard
  - [x] 1.3 Implement Slow Motion Manager
    - Create `CriticalMomentsManager.js` (or similar coordinator)
    - Implement `triggerSlowMotion()`: Set timeScale to 0.3
    - Implement automatic restoration: Delayed call to reset timeScale to 1.0 after 2s
  - [x] 1.4 Ensure Hit Logic tests pass
    - Run ONLY the tests written in 1.1
    - Verify hit stop duration and time scale changes

**Acceptance Criteria:**

- Lethal hits trigger a 500ms freeze
- Game speed drops to 0.3 after lethal freeze
- Game speed returns to 1.0 after 2 seconds

### Visual Systems

#### Task Group 2: Camera & Overlay Effects

**Dependencies:** None (can be built in parallel with Group 1)

- [x] 2.0 Implement Visual Effects
  - [x] 2.1 Write 2-8 focused tests for Visuals
    - Test Zoom logic: Start/End values and duration
    - Test Vignette creation: Graphics object existence and depth
    - Test Pulse logic: Alpha calculation based on HP percentage
  - [x] 2.2 Implement Round Start Zoom
    - Add `CriticalMomentsManager.playRoundStartZoom()`
    - Use `scene.cameras.main.zoomTo` for the sequence
  - [x] 2.3 Implement Low Health Vignette
    - Create procedural radial gradient texture using `Phaser.Graphics`
    - Implement `updateHealthPulse(hpPercent)` method
    - Logic: Modulate alpha (0.0 - 0.3) based on HP thresholds (<20% vs <5%)
  - [x] 2.4 Ensure Visual System tests pass
    - Run ONLY the tests written in 2.1
    - Verify zoom calls and vignette properties

**Acceptance Criteria:**

- Camera starts zoomed at 1.25x and zooms out on signal
- Red vignette appears when HP < 20%
- Vignette pulse speeds up when HP < 5%

### Integration

#### Task Group 3: Scene Integration

**Dependencies:** Task Groups 1 & 2

- [x] 3.0 Integrate Critical Moments
  - [x] 3.1 Write 2-8 focused tests for Integration
    - Test `FightScene` triggers `playRoundStartZoom` on start
    - Test `FightScene` updates health pulse in `update()` loop
    - Test `FightScene` passes `isLethal` flag to `HitFeedbackSystem`
  - [x] 3.2 Integrate Zoom with Round Start
    - Hook into `FightScene` start sequence (before "FIGHT!")
  - [x] 3.3 Integrate Health Pulse
    - Update `FightScene.update()` to calculate lowest HP %
    - Call `CriticalMomentsManager.updateHealthPulse()`
  - [x] 3.4 Integrate Lethal Hit Logic
    - Update `checkAttack` or `takeDamage` to predict lethal damage
    - Pass `isLethal` to `hitFeedback.triggerHitFeedback`
    - Chain the Slow Motion trigger after the freeze
  - [x] 3.5 Ensure Integration tests pass
    - Run ONLY the tests written in 3.1
    - Verify scene events trigger system methods correctly

**Acceptance Criteria:**

- Zoom happens automatically at round start
- Screen pulses red when P1 or P2 is low health
- Final KO triggers freeze -> slow motion -> victory

### Testing

#### Task Group 4: Verification & Polish

**Dependencies:** Task Groups 1-3

- [ ] 4.0 Final Verification
  - [ ] 4.1 Manual Visual Verification
    - Play a full match
    - Verify "Juice" feel: Is the freeze too long? Is the zoom smooth?
    - Check for pulse visual interference with HUD
  - [ ] 4.2 Analyze Test Coverage
    - Review tests from 1.1, 2.1, 3.1
    - Identify any critical missing scenarios (e.g., double KO edge case)
  - [ ] 4.3 Write up to 4 additional strategic tests
    - Cover cleanup/destroy logic to prevent memory leaks
    - Cover scene restart scenarios
  - [ ] 4.4 Run feature-specific tests
    - Run ONLY the tests for this feature
    - Verify stability

**Acceptance Criteria:**

- All feature tests pass
- No visual glitches or stuck slow-motion states
- Performance remains smooth (60fps) during effects

## Execution Order

1. Core Logic (Hit/Slow Mo)
2. Visual Systems (Zoom/Vignette)
3. Integration (FightScene hooks)
4. Verification
