# Task Breakdown: System-Wide Logging

## Overview

Total Tasks: 18

## Task List

### Foundation Layer

#### Task Group 1: Infrastructure & Logger Utility

**Dependencies:** None

- [x] 1.0 Complete foundation layer
  - [x] 1.1 Write 3 focused tests for the Logger utility
    - Test environment detection (Node vs. Browser)
    - Test log level filtering (e.g., DEBUG doesn't show in INFO)
    - Test message formatting and prefixing
  - [x] 1.2 Install necessary dependencies (`pino`, `pino-pretty`)
  - [x] 1.3 Create a unified `src/utils/Logger.js` (or similar) compatible with ESM and both environments
  - [x] 1.4 Implement log level configuration via environment variables/Vite defines
  - [x] 1.5 Ensure foundation layer tests pass
    - Run ONLY the 3 tests written in 1.1

**Acceptance Criteria:**

- Logger utility works in both browser and server
- Log levels correctly filter messages
- Configuration is controllable via environment variables

### Backend Layer

#### Task Group 2: Backend Instrumentation

**Dependencies:** Task Group 1

- [x] 2.0 Complete backend instrumentation
  - [x] 2.1 Write 3 focused tests for backend logging middleware
    - Verify API request/response logging
    - Verify error capture in middleware
  - [x] 2.2 Implement Express middleware for request/response logging in `server/index.js`
  - [x] 2.3 Refactor `server/ImageProcessor.js` to use the new Logger with structured data
  - [x] 2.4 Standardize all `console.log/error` calls in `server/` directory
  - [x] 2.5 Ensure backend logging tests pass
    - Run ONLY the 3 tests written in 2.1

**Acceptance Criteria:**

- All API calls are logged with method, path, and status code
- Image processing steps (start, end, success/fail) are logged
- No raw `console.log` calls remain in the server directory

### Frontend Layer

#### Task Group 3: Game & Scene Instrumentation

**Dependencies:** Task Group 1

- [x] 3.0 Complete frontend instrumentation
  - [x] 3.1 Write 4 focused tests for game event logging
    - Verify scene lifecycle logs
    - Verify fighter state transition logs
  - [x] 3.2 Instrument Phaser Scene lifecycle methods (init, preload, create) across all scenes
  - [x] 3.3 Instrument `src/components/Fighter.js` to log state machine changes and damage
  - [x] 3.4 Add high-frequency VERBOSE logs to `TouchInputController.js` and `FightScene.js` (collisions)
  - [x] 3.5 Refactor all `src/` directory `console.log` calls to use the new Logger
  - [x] 3.6 Ensure frontend logging tests pass
    - Run ONLY the 4 tests written in 3.1

**Acceptance Criteria:**

- Scene transitions and asset loading progress are visible in logs
- Fighter state changes (IDLE, ATTACK, HIT, DIE) are logged
- Verbose logs can be toggled to debug input/physics

### Testing & Bug Hunt

#### Task Group 4: Test Review & Bug Investigation

**Dependencies:** Task Groups 1-3

- [x] 4.0 Final verification and bug hunt
  - [x] 4.1 Review feature-specific tests from Task Groups 1-3 (Total: 10 tests)
  - [x] 4.2 Analyze the "hidden bug" using logs generated during E2E test runs
  - [x] 4.3 Write up to 2 additional strategic E2E tests to pin down the identified bug
  - [x] 4.4 Run all feature-specific tests (approx. 12 tests) and verify the bug is caught/fixed

**Acceptance Criteria:**

- All 12 feature-specific tests pass
- Logs successfully reveal the cause of the "game not working" issue
- E2E tests now reflect the fix for the previously hidden bug

## Execution Order

Recommended implementation sequence:

1. Foundation (Task Group 1) - Critical for both layers
2. Backend Layer (Task Group 2) - Simpler environment to test first
3. Frontend Layer (Task Group 3) - Most complex instrumentation
4. Bug Investigation (Task Group 4) - Final goal of the feature
