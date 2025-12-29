# Task Breakdown: Aggressive AI Overhaul

## Overview

Total Tasks: 11

## Task List

### AI Logic Core

#### Task Group 1: Configuration & Tuning

**Dependencies:** None

- [x] 1.0 Update Game Configuration
  - [x] 1.1 Write 2-8 focused tests for ConfigManager
    - Test that new difficulty presets are loaded correctly
    - Test that "Nightmare" presets return expected aggressive values (0 reaction time, 1.0 aggression)
  - [x] 1.2 Update `src/config/gameData.json`
    - Update `difficulty` object:
      - **Hard**: `aggression`: 0.9, `reactionTime`: { "min": 150, "max": 250 }, `mistakeChance`: 0.05
      - **Nightmare**: `aggression`: 1.0, `reactionTime`: { "min": 0, "max": 50 }, `mistakeChance`: 0.0
    - Ensure all roster entries have `personality: "aggressive"` (or verify existing).
  - [x] 1.3 Ensure Configuration tests pass
    - Run ONLY the tests from 1.1

**Acceptance Criteria:**

- `ConfigManager.getDifficultyConfig('nightmare')` returns the new ultra-hard values.
- All fighters default to aggressive behavior settings in config.

### AI Decision Engine

#### Task Group 2: AI Controller Refactor (Mercy Removal & Aggression)

**Dependencies:** Task Group 1

- [x] 2.0 Refactor Base AI Logic
  - [x] 2.1 Write 2-8 focused tests for `AIInputController` (Confidence & Aggression)
    - Test that `calculateConfidence` does NOT decrease when AI has high health (Mercy removal)
    - Test that `getModifiedAggression` returns values near 1.0 for Nightmare difficulty
  - [x] 2.2 Refactor `calculateConfidence`
    - Remove "Mercy" logic branch (where high health/winning reduces confidence).
    - Ensure confidence stays at 1.0 (or high) when winning.
  - [x] 2.3 Refactor `getModifiedAggression` & `getModifiedMistakeChance`
    - Ensure Nightmare/Hard difficulties scale aggression UP, never down.
    - Set mistake chance to absolute 0 for Nightmare.
  - [x] 2.4 Refactor `makeDecision` timing
    - Reduce `moveInterval` for Hard/Nightmare (make them "think" faster, e.g., 50-100ms ticks).
  - [x] 2.5 Ensure Base AI tests pass
    - Run ONLY the tests from 2.1

**Acceptance Criteria:**

- AI never "holds back" when winning.
- Decision tick rate is noticeably faster on high difficulties.

#### Task Group 3: Input Reading & God-Reflexes

**Dependencies:** Task Group 2

- [x] 3.0 Implement Input Reading
  - [x] 3.1 Write 2-8 focused tests for `AIInputController` (Reactions)
    - Test that AI enters BLOCK state immediately when opponent attacks (mocked state)
    - Test that AI triggers "Wake-up" attack when opponent is grounded
  - [x] 3.2 Refactor `monitorOpponent` for "Input Reading"
    - If Difficulty is Nightmare:
      - Bypass `reactionDelay` simulation completely.
      - Check `opponent.currentState` (or `opponent.isAttacking`).
      - If attacking & in range -> Immediate BLOCK or COUNTER.
      - If opponent Jumps -> Immediate Anti-Air (Attack + Up).
  - [x] 3.3 Implement "Wake-up Pressure"
    - Detect when `opponent.currentState` is `CRUMPLE` or `HIT` (knockdown).
    - Queue `APPROACH` + `ATTACK` timed to hit exactly as they recover (Meaty).
  - [x] 3.4 Implement "Whiff Punish"
    - If opponent attacks and misses (distance > hit range), immediately `APPROACH` + `ATTACK`.
    - Probability: 100% on Nightmare, 80% on Hard.
  - [x] 3.5 Ensure Input Reading tests pass
    - Run ONLY the tests from 3.1

**Acceptance Criteria:**

- Nightmare AI blocks instantly on player attack startup.
- Nightmare AI attacks immediately if player misses a hit.
- AI consistently attacks player on wake-up.

### Testing

#### Task Group 4: Verification

**Dependencies:** Task Groups 1-3

- [x] 4.0 Verify AI Behavior
  - [x] 4.1 Review tests from Groups 1-3
  - [x] 4.2 Write 1-2 Integration Tests for AI vs Idle Opponent
    - Verify AI kills an idle opponent in < 20 seconds on Nightmare (relentless attacking).
  - [x] 4.3 Run feature-specific tests
    - Run tests from 1.1, 2.1, 3.1, and 4.2.

**Acceptance Criteria:**

- All AI logic tests pass.
- AI demonstrates "god-like" reflexes in tests (0 delay).

## Execution Order

1. Configuration & Tuning (Task Group 1)
2. AI Controller Refactor (Task Group 2)
3. Input Reading & God-Reflexes (Task Group 3)
4. Verification (Task Group 4)
