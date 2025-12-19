# Task Breakdown: Resource Refactor & Configuration Centralization

## Overview
Total Tasks: 4 Groups

## Task List

### Configuration Layer

#### Task Group 1: Configuration Extraction
**Dependencies:** None

- [ ] 1.0 Extract configurations to `src/config/`
  - [ ] 1.1 Write 2-4 focused tests for Configuration loading
    - Test that `arenaConfig` exports expected presets (e.g., 'paris' has lighting).
    - Test that `combatConfig` exports combo definitions.
  - [ ] 1.2 Create `src/config/arenaConfig.js`
    - Extract `ARENA_CONFIGS` (parallax), `ANIMATION_PRESETS`, `LIGHTING_PRESETS`, `WEATHER_PRESETS` from `FightScene.js`.
    - Implement helper functions (e.g., `getLightingPreset(city)`) as exported utilities or part of the config object.
  - [ ] 1.3 Create `src/config/combatConfig.js`
    - Define combo milestones (3, 5, 7 hits) and their audio keys.
    - Define damage constants if applicable.
  - [ ] 1.4 Update `src/config/rosterConfig.js`
    - Update character asset paths to `assets/fighters/...` (preparing for the move).
    - Ensure all character metadata (display names) is consolidated here.
  - [ ] 1.5 Ensure configuration tests pass
    - Run the tests from 1.1.

**Acceptance Criteria:**
- `src/config/` contains the new files.
- Tests confirm configs are valid objects/modules.

### Resource Layer

#### Task Group 2: Asset Restructuring
**Dependencies:** Task Group 1 (Soft dependency, can be parallel)

- [ ] 2.0 Move and Organize Assets
  - [ ] 2.1 Write 2-4 focused tests for Asset Integrity (Optional/Scripted)
    - Create a script or test to verify `public/assets/` file existence after move? (Maybe too complex for a unit test, manual verify is okay).
    - *Alternative:* Write a test that checks if `PreloadScene` can find the files (Integration test). Let's stick to the physical move here.
  - [ ] 2.2 Create directory structure
    - `mkdir -p public/assets/audio/{music,sfx,announcer}`
    - `mkdir -p public/assets/images/{backgrounds,ui}`
    - `mkdir -p public/assets/sprites/fighters`
  - [ ] 2.3 Move Audio Files
    - Move `resources/*.mp3` to `public/assets/audio/` subfolders based on filename/type.
  - [ ] 2.4 Move Image Files
    - Move `resources/*.png` and `assets/` contents to `public/assets/images` or `sprites`.
    - Move `photos/` *game assets* (if any static ones exist like `valid.webp`) to `public/assets/images/backgrounds/` or keep as placeholder data? *Decision: Move static backgrounds to public/assets/images/backgrounds.*
  - [ ] 2.5 Clean up `resources/` and `assets/` folders
    - Delete empty source folders.
  - [ ] 2.6 Verify File Structure
    - Run `ls -R public/assets` to verify.

**Acceptance Criteria:**
- `resources/` and legacy `assets/` folders are empty/removed.
- `public/assets/` is populated and organized.

### Integration Layer

#### Task Group 3: Code Updates
**Dependencies:** Task Group 1, Task Group 2

- [ ] 3.0 Update Scene Logic
  - [ ] 3.1 Write 2-4 focused tests for Scene Loading
    - Update `tests/Fighter.test.js` or `E2E_FullGameFlow.test.js` to ensure game still boots.
  - [ ] 3.2 Refactor `src/scenes/PreloadScene.js`
    - Update loader paths to use `/assets/...`.
    - Remove hardcoded list if possible, or just update strings.
  - [ ] 3.3 Refactor `src/scenes/FightScene.js`
    - Import `arenaConfig`, `combatConfig`.
    - Replace `getLightingPresetForCity` etc. with config lookups.
    - Remove local constant definitions.
  - [ ] 3.4 Update `src/scenes/CharacterSelectScene.js` (and others)
    - Ensure they use `rosterConfig` for paths (which we updated in 1.4).
  - [ ] 3.5 Ensure Scene tests pass
    - Run `tests/E2E_FullGameFlow.test.js`.

**Acceptance Criteria:**
- Game loads without 404 errors.
- FightScene functions correctly with new config imports.

### Verification Layer

#### Task Group 4: Final Polish & Verification
**Dependencies:** Task Groups 1-3

- [ ] 4.0 Verify and Cleanup
  - [ ] 4.1 Run full test suite
    - `npm test` (or `vitest`).
  - [ ] 4.2 Manual Playthrough Check
    - Verify Audio loads (Announcer, Music).
    - Verify Backgrounds load (Parallax).
    - Verify Characters load.
  - [ ] 4.3 Documentation
    - Update `DOCUMENTATION.md` or `ASSET_GUIDELINES.md` to reflect new `public/assets` structure.

**Acceptance Criteria:**
- All tests pass.
- Game is playable.
- Documentation matches reality.

## Execution Order
1. Configuration Extraction (Safe, code-only)
2. Asset Restructuring (File ops)
3. Code Updates (Linking the two)
4. Verification
