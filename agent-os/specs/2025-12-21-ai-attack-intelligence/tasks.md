# Task Breakdown: AI Attack Intelligence

## Overview

Total Tasks: 15

## Task List

### Configuration Layer

#### Task Group 1: Personality & Difficulty Data

**Dependencies:** None

- [x] 1.0 Complete configuration layer
  - [x] 1.1 Write 2 focused tests for personality data retrieval in `ConfigManager.test.js`
  - [x] 1.2 Update `gameData.json` with character personalities (Aggressive, Defensive, Zoner, Balanced)
  - [x] 1.3 Enhance `difficulty` settings in `gameData.json` with reaction time ranges and aggression modifiers
  - [x] 1.4 Ensure configuration tests pass
    - Run `vitest tests/ConfigManager.test.js`

**Acceptance Criteria:**

- `gameData.json` contains valid personality traits for all roster characters
- `ConfigManager` successfully retrieves new difficulty parameters

### Core AI Logic

#### Task Group 2: Reactive Decision Engine

**Dependencies:** Task Group 1

- [x] 2.0 Complete AI reactivity refactor
  - [x] 2.1 Write 4 focused tests for `AIInputController` reaction timing in `AIController.test.js`
  - [x] 2.2 Refactor `AIInputController.js` to use frame-based reactivity instead of fixed intervals
  - [x] 2.3 Implement dynamic reaction delay based on difficulty
  - [x] 2.4 Add player state detection (detecting jump/attack start)
  - [x] 2.5 Ensure AI reactivity tests pass
    - Run `vitest tests/AIController.test.js`

**Acceptance Criteria:**

- AI reacts to player actions within the specified difficulty-based window
- Decision intervals are no longer strictly fixed at 500ms

#### Task Group 3: Personality & Confidence System

**Dependencies:** Task Group 2

- [x] 3.0 Complete personality and confidence implementation
  - [x] 3.1 Write 4 focused tests for personality-specific behaviors (e.g., Aggressive approaches more)
  - [x] 3.2 Implement "Confidence" score calculation (0-1) based on HP and hit history
  - [x] 3.3 Apply personality modifiers to aggression, block rate, and spacing
  - [x] 3.4 Integrate Confidence modifiers into the decision-making loop
  - [x] 3.5 Implement "Action Commitment" (sequences) to prevent jittery behavior
  - [x] 3.6 Ensure AI personality tests pass
    - Run `vitest tests/AIController.test.js`

**Acceptance Criteria:**

- AI behavior visibly changes based on the selected character's personality
- AI aggression scales dynamically during the match based on performance

#### Task Group 4: Advanced Movement & Mistake Injection

**Dependencies:** Task Group 3

- [x] 4.0 Complete movement and polish
  - [x] 4.1 Write 3 focused tests for AI jump behavior and "anti-corner" logic
  - [x] 4.2 Implement AI jumping for approach/evasion
  - [x] 4.3 Add "Anti-Corner" logic to help AI escape being trapped
  - [x] 4.4 Inject "Whiff" and "Panic" chances based on low confidence or difficulty
  - [x] 4.5 Ensure movement and mistake tests pass
    - Run `vitest tests/AIController.test.js`

**Acceptance Criteria:**

- AI uses jumps effectively and doesn't get easily stuck in corners
- AI exhibits occasional human-like mistakes (whiffing, missed blocks)

### Integration & Verification

#### Task Group 5: Full Match Integration

**Dependencies:** Task Group 1-4

- [x] 5.0 Finalize AI integration
  - [x] 5.1 Run `vitest tests/AIIntegration.test.js` to ensure no regressions in fight flow
  - [x] 5.2 Perform a manual playtest to verify "fun factor" and AI intelligence

**Acceptance Criteria:**

- All AI-related tests pass
- AI feels significantly more intelligent and less "boring" in a live match

## Execution Order

Recommended implementation sequence:

1. Personality & Difficulty Data (Task Group 1)
2. Reactive Decision Engine (Task Group 2)
3. Personality & Confidence System (Task Group 3)
4. Advanced Movement & Mistake Injection (Task Group 4)
5. Full Match Integration (Task Group 5)
