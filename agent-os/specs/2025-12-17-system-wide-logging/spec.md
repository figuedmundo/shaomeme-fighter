# Specification: System-Wide Logging

## Goal

Implement a comprehensive, multi-level logging system across both the Frontend (Phaser/Vite) and Backend (Express) to improve observability and facilitate the detection of hidden bugs that bypass automated tests.

## User Stories

- As a developer, I want to see detailed logs of game state transitions and API interactions so that I can quickly identify the root cause of runtime issues.
- As a developer, I want to toggle between different log levels (e.g., INFO vs. VERBOSE) so that I can debug high-frequency physics issues without cluttering the console during normal play.

## Specific Requirements

**Unified Logging Utility**

- Implement a logger utility that abstracts the underlying logging library (e.g., pino) to provide a consistent API for both environments.
- Support standard log levels: ERROR, WARN, INFO, DEBUG, and VERBOSE.
- Configure log levels via environment variables (e.g., `LOG_LEVEL=debug`) to allow flexible runtime adjustments.

**Backend Instrumentation (Express)**

- Add request/response logging for all API endpoints (`/api/cities`, `/api/photos`) using middleware.
- Log detailed file system operations within the `photos/` and `cache/` directories.
- Instrument `ImageProcessor.js` to log start/finish times, compression ratios, and any processing failures.

**Frontend Instrumentation (Phaser)**

- Instrument all Phaser scenes (`Boot`, `Preload`, `MainMenu`, `CharacterSelect`, `ArenaSelect`, `Fight`) to log lifecycle events (init, preload, create).
- Log asset loading progress and completion status for all textures, spritesheets, and audio files.
- Track critical game state changes: scene transitions, fighter state machine updates (e.g., IDLE -> ATTACK), and health changes.

**Input & Physics Debugging (Verbose)**

- Implement high-frequency logging for touch input detection and virtual joystick movements under the VERBOSE level.
- Log hitbox overlap detection and physics collision events to debug combat hit-registration issues.
- Ensure VERBOSE logs are disabled by default to maintain performance on target mobile devices (iPad/iPhone).

**Standardized Formatting**

- Standardize all existing `console.log` and `console.error` calls to use the new unified logger.
- Ensure logs include timestamps and a clear indication of the source component (e.g., `[Backend:API]`, `[Frontend:Fighter]`).
- Adhere to project coding standards regarding error handling and naming conventions.

## Existing Code to Leverage

**server/index.js & server/ImageProcessor.js**

- Replaces scattered `console.log` and `console.error` calls with the unified logger.
- Leverages existing error blocks to capture and log more context about file system and image processing errors.

**src/scenes/FightScene.js**

- Extends current `console.log` markers used for debugging the "stuck" issue into permanent, level-based logs.
- Instruments the `checkAttack` and `update` loops with optional VERBOSE logging.

**src/components/Fighter.js**

- Standardizes the `createAnimations` log and adds logs for state transitions and health updates.
- Provides a hook for logging input state merging (Keyboard + Touch).

## Out of Scope

- Logging to external SaaS platforms (Datadog, Sentry) is not required for this phase.
- Persistent database storage for logs.
- Real-time log streaming UI within the game itself.
- Logging of third-party library internals (Phaser core, Express core) unless relevant to application logic.
