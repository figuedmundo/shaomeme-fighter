# Task Breakdown: Refine Config Architecture

## Overview

Total Tasks: 2 Groups

## Task List

### Configuration Layer

#### Task Group 1: Config Separation

**Dependencies:** None

- [x] 1.0 Refactor Config Architecture
  - [x] 1.1 Write 2-4 focused tests for ConfigManager
    - Update `tests/Config.test.js` to assert that `ConfigManager` correctly resolves a city's preset key (from JSON) to a full preset object (from static constants).
    - Example: `getLightingPresetForCity('paris')` should return the 'outdoor_day' object structure, even if 'outdoor_day' is no longer in JSON.
  - [x] 1.2 Update `src/config/ConfigManager.js`
    - Define `PARALLAX_PRESETS`, `LIGHTING_PRESETS`, `WEATHER_PRESETS`, and `ANIMATION_PRESETS` as internal `const` objects.
    - Copy the preset data from `gameData.json` into these constants.
    - Rewrite `getParallaxConfigForCity`, `getLightingPresetForCity`, `getWeatherPresetForCity`, and `getAnimationPresetForCity` to look up the preset key from `this.data.arenas[city]` and then return the constant object.
  - [x] 1.3 Update `src/config/gameData.json`
    - Remove the `presets` top-level key.
    - Verify `arenas`, `roster`, and `combat` are preserved.
  - [x] 1.4 Ensure Config tests pass
    - Run `tests/Config.test.js`.

**Acceptance Criteria:**

- `gameData.json` is smaller and cleaner (no technical preset definitions).
- `ConfigManager.js` contains the static preset definitions.
- `tests/Config.test.js` passes, confirming the API contract is unbroken.

### Verification Layer

#### Task Group 2: Regression Testing

**Dependencies:** Task Group 1

- [x] 2.0 Verify System Integrity
  - [x] 2.1 Run full test suite
    - Execute `npm test` to ensure no regression in `FightScene` or other consumers.
    - Specifically check `AnnouncerIntegration` or `ArenaSelect` tests if they rely on config.
  - [x] 2.2 Manual Sanity Check (Optional/Automated via Agent)
    - Verify that `ConfigManager.getArenaConfig('paris')` returns valid data.
    - Verify that `ConfigManager.getLightingPresetForCity('paris')` returns a valid object.

**Acceptance Criteria:**

- All existing tests pass.
- No regression in game loading or scene initialization.
