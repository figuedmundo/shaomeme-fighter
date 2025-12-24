# Task Breakdown: Improve AI Difficulty

## Overview

Total Tasks: 4 Groups

## Task List

### Configuration & Foundation

#### Task Group 1: Difficulty Config & Adaptive System

**Dependencies:** None

- [x] 1.0 Update configuration and basic adaptive systems
  - [x] 1.1 Write 2-8 focused tests for ConfigManager and Adaptive Logic
  - [x] 1.2 Update `src/config/gameData.json`
  - [x] 1.3 Implement Adaptive Difficulty in `AIInputController.js`
  - [x] 1.4 Ensure Config & Adaptive tests pass

**Acceptance Criteria:**

- Nightmare difficulty is loadable
- AI stats change dynamically based on health difference (Adaptive)
- Tests pass

### Core AI Logic

#### Task Group 2: Advanced Decision Making (Combos & Spacing)

**Dependencies:** Task Group 1

- [x] 2.0 Implement advanced combat logic
  - [x] 2.1 Write 2-8 focused tests for AI combat decisions
  - [x] 2.2 Refactor `AIInputController` for Action Queues
  - [x] 2.3 Implement Combo Logic
  - [x] 2.4 Implement Spacing & Whiff Punish
  - [x] 2.5 Ensure Advanced Logic tests pass

**Acceptance Criteria:**

- AI can chain at least 3 attacks (Combo)
- AI moves in and out of range (Footsies)
- AI reacts to missed player attacks (Whiff Punish)

### Defensive Logic

#### Task Group 3: Wake-up & Reaction Options

**Dependencies:** Task Group 2

- [x] 3.0 Implement defensive and recovery logic
  - [x] 3.1 Write 2-8 focused tests for Wake-up logic
  - [x] 3.2 Implement Wake-up State Machine
  - [x] 3.3 Refactor Reaction System
  - [x] 3.4 Ensure Defensive tests pass

**Acceptance Criteria:**

- AI acts immediately upon standing up (Wake-up)
- Blocking works reliably with new queue system

### Testing & Verification

#### Task Group 4: Integrated Difficulty Testing

**Dependencies:** Task Groups 1-3

- [x] 4.0 Final verification and balance check
  - [x] 4.1 Review tests from Task Groups 1-3
  - [x] 4.2 Analyze coverage gaps
  - [x] 4.3 Write up to 10 integration tests
  - [x] 4.4 Run feature-specific tests

**Acceptance Criteria:**

- All feature tests pass
- Nightmare mode generates significantly more ATTACK/BLOCK commands than Easy mode in simulations
- Wake-up and Combos trigger consistently in correct contexts

## Execution Order

Recommended implementation sequence:

1. Configuration & Foundation (Task Group 1) - Sets up the data and scaling
2. Core AI Logic (Task Group 2) - Adds the offensive capabilities
3. Defensive Logic (Task Group 3) - Adds the defensive/recovery capabilities
4. Testing & Verification (Task Group 4) - Ensures it all works together
