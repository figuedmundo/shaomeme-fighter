# Task Breakdown: Difficulty & Balance

## Overview

Total Tasks: 4 Groups

## Task List

### Core Configuration

#### Task Group 1: Stats & Config

**Dependencies:** None

- [x] 1.0 Centralize Combat Stats
  - [x] 1.1 Write 2-8 focused tests for Config Manager
    - Create `tests/DifficultyConfig.test.js`
    - Test retrieval of combat stats (walkSpeed, jumpPower, etc.)
    - Test retrieval of difficulty profiles
  - [x] 1.2 Update `gameData.json`
    - Add `difficulty` section with Easy/Medium/Hard profiles
    - Expand `combat` section with global stats:
      - `walkSpeed`: 160
      - `jumpPower`: -600
      - `attackDamage`: 10
      - `maxHealth`: 100
  - [x] 1.3 Update `Fighter.js` to use Config
    - Inject `ConfigManager` or read from global config
    - Replace hardcoded values (velocity, jumpPower, health) with config values
  - [x] 1.4 Ensure Config tests pass
    - Run `tests/DifficultyConfig.test.js`

**Acceptance Criteria:**

- Fighter stats are read from `gameData.json` via `ConfigManager`
- Changing a value in `gameData.json` affects the Fighter

### AI Logic

#### Task Group 2: AI Input Controller

**Dependencies:** Task Group 1

- [x] 2.0 Implement AI Controller
  - [x] 2.1 Write 2-8 focused tests for AI Controller
    - Create `tests/AIController.test.js`
    - Test interface compliance (`getCursorKeys`, `getAttackKey`)
    - Test state transitions (Approaching -> Attacking) based on distance
    - Test randomness/difficulty checks (mock `Math.random`)
  - [x] 2.2 Create `src/systems/AIInputController.js`
    - Class structure matching `TouchInputController` interface
    - Implement `update(time, delta)` loop
    - Implement simple State Machine: `IDLE`, `APPROACH`, `ATTACK`, `BLOCK`, `RETREAT`
    - Read difficulty settings to tune behavior (aggression, block chance)
  - [x] 2.3 Ensure AI tests pass
    - Run `tests/AIController.test.js`

**Acceptance Criteria:**

- AI Controller returns valid input states (keys pressed/released)
- AI behavior changes based on Difficulty setting (testable via mocks)

### Integration

#### Task Group 3: Fight Scene Integration

**Dependencies:** Task Group 2

- [x] 3.0 Integrate AI into FightScene
  - [x] 3.1 Write 2-8 focused tests for Integration
    - Create `tests/AIIntegration.test.js`
    - Verify `AIInputController` is instantiated for Player 2
    - Verify `aiController.update()` is called in `FightScene.update()`
  - [x] 3.2 Update `FightScene.js`
    - Instantiate `AIInputController` for Player 2
    - Pass controller to `player2.setControls()`
    - Call `update()` on controller in game loop
  - [x] 3.3 Ensure Integration tests pass
    - Run `tests/AIIntegration.test.js`

**Acceptance Criteria:**

- Player 2 moves and acts autonomously
- Player 2 uses the Difficulty profile defined in config

### Testing

#### Task Group 4: Verification

**Dependencies:** Task Groups 1-3

- [x] 4.0 Final Verification
  - [x] 4.1 Run full feature test suite
    - Run `tests/DifficultyConfig.test.js`
    - Run `tests/AIController.test.js`
    - Run `tests/AIIntegration.test.js`
  - [x] 4.2 Manual Balance Check (Self-Verify)
    - Observe AI behavior (does it attack? does it block?)
    - Ensure it feels "fair" (not spamming)

**Acceptance Criteria:**

- All tests pass
- AI functions correctly in game context
