# Task Breakdown: Animations Enhancement

## Overview

Total Tasks: 16

## Task List

### Asset & Configuration Layer

#### Task Group 1: Sprite Pipeline and Animation Mapping

**Dependencies:** None

- [x] 1.0 Complete asset pipeline updates
  - [x] 1.1 Update `generate_placeholders.py`
    - [x] Increase `total_frames` to 32
    - [x] Update `actions` list: Idle (6), Walk (6), Jump (1), Crouch (1), Attack (3), Hit (1), Block (1), Intro (4), Victory (4), Crumple (2), Die (3)
    - [x] Ensure correct frame calculation logic
  - [x] 1.2 Update `Fighter.js` frame indices
    - [x] Adjust `createAnimations` to match the new 32-frame layout
    - [x] Define new state mappings for `INTRO`, `VICTORY`, and `CRUMPLE`
  - [x] 1.3 Re-generate all placeholder assets
    - [x] Run `python3 generate_placeholders.py`
    - [x] Verify `assets/fighters/` contains the expanded 32-frame strips
  - [x] 1.4 Verify frame loading
    - [x] Run a quick manual check or existing `Assets.test.js` to ensure spritesheets load correctly with the new size

**Acceptance Criteria:**

- `generate_placeholders.py` produces 32-frame spritesheets
- All characters have updated assets
- `Fighter.js` has correct index mappings for all 32 frames

### Core Game Logic Layer

#### Task Group 2: Fighter State Machine Expansion

**Dependencies:** Task Group 1

- [x] 2.0 Complete Fighter component updates
  - [x] 2.1 Write 3-5 focused tests for `Fighter` state transitions
    - [x] Test `INTRO` -> `IDLE` transition
    - [x] Test `CRUMPLE` -> `DIE` transition
    - [x] Test that `VICTORY` state locks input
  - [x] 2.2 Update `FighterState` enum
    - [x] Add `INTRO`, `VICTORY`, `CRUMPLE`
  - [x] 2.3 Implement Idle breathing
    - [x] Update `IDLE` animation to use 6 frames
    - [x] Adjust frame rate for smooth breathing feel
  - [x] 2.4 Implement multi-stage defeat logic
    - [x] Update `takeDamage` to trigger a `CRUMPLE` state before `DIE`
    - [x] Use `animationcomplete` listener to finalize death
  - [x] 2.5 Ensure Fighter logic tests pass
    - [x] Run the new state machine tests
    - [x] Verify no regression in basic combat states

**Acceptance Criteria:**

- `Fighter` supports new animation states
- Idle animation is smoother (6 frames)
- Death sequence includes a crumple phase

### Gameplay & Orchestration Layer

#### Task Group 3: Match Flow and Intro/Victory Sequences

**Dependencies:** Task Group 2

- [x] 3.0 Complete FightScene integration
  - [x] 3.1 Write 3-5 focused tests for `FightScene` match flow
    - [x] Verify characters start off-screen during intro
    - [x] Verify input is locked until "FIGHT!"
    - [x] Verify winner plays victory animation
  - [x] 3.2 Implement Walk-in Intro
    - [x] Update `startRoundSequence` to spawn fighters off-screen
    - [x] Move fighters to starting positions using tweens or physics
    - [x] Play `INTRO` animation once in position
  - [x] 3.3 Implement Knockdown physics
    - [x] Add slight knockback/upwards velocity when a lethal hit lands
    - [x] Ensure `CRUMPLE` triggers upon landing
  - [x] 3.4 Implement Victory Sequence
    - [x] Update `checkWinCondition` to play `VICTORY` pose for the winner
    - [x] Time the pose with the Announcer "YOU WIN" callout
  - [x] 3.5 Ensure FightScene integration tests pass
    - [x] Run the new match flow tests
    - [x] Verify end-to-end match start/end feel

**Acceptance Criteria:**

- Characters walk in at match start
- Winner performs a unique pose at match end
- Knockdowns feel weighty and multi-stage

### Testing & Verification

#### Task Group 4: Test Review & Gap Analysis

**Dependencies:** Task Groups 1-3

- [x] 4.0 Final verification and polish
  - [x] 4.1 Review tests from Task Groups 2 & 3
  - [x] 4.2 Analyze gaps in "Juice" and "Feel"
    - [x] Ensure animations don't feel too slow or choppy
    - [x] Verify transitions between states are smooth
  - [x] 4.3 Add up to 5 strategic E2E tests
    - [x] Cover full flow: Intro -> Combat -> Knockdown -> Victory
  - [x] 4.4 Run all feature-specific tests
    - [x] Ensure `2025-12-19-animations` related tests pass

**Acceptance Criteria:**

- All 10-15 feature tests pass
- Intro and Victory sequences play correctly on mobile-simulated inputs
- No visual glitches in spritesheet frame mapping

## Execution Order

Recommended implementation sequence:

1. Asset & Configuration (Task Group 1) - Critical foundation for indices
2. Fighter State Machine (Task Group 2) - Core component behavior
3. Match Flow Integration (Task Group 3) - User-facing sequences
4. Final Verification (Task Group 4) - Polish and E2E checks
