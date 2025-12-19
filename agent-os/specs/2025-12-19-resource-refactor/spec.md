# Specification: Resource Refactor & Configuration Centralization

## Goal
Consolidate dispersed asset folders into a standardized `public/assets/` structure and extract hardcoded game constants from `FightScene.js` into modular configuration files to improve maintainability and project hygiene.

## User Stories
- As a developer, I want all static assets to be in `public/assets` so that the project structure is clean and standard for Vite.
- As a developer, I want stage and character configurations in `src/config/` so I can tweak game values without modifying scene logic.
- As a developer, I want audio files organized by type (music, sfx, announcer) so I can easily manage the sound library.

## Specific Requirements

**Repository Structure**
- Create `public/assets/` directory structure:
  - `public/assets/audio/music/`
  - `public/assets/audio/sfx/`
  - `public/assets/audio/announcer/`
  - `public/assets/images/backgrounds/`
  - `public/assets/images/ui/`
  - `public/assets/sprites/fighters/`
- Move `resources/*.mp3` to appropriate `audio` subfolders.
- Move `resources/*.png` and `assets/` content to appropriate `images` or `sprites` subfolders.
- Ensure `photos/` remains at root for user-generated content but verify no core game assets are trapped there.

**Configuration Extraction**
- Create `src/config/arenaConfig.js`:
  - Export `ARENA_CONFIGS` (parallax layers), `LIGHTING_PRESETS`, `WEATHER_PRESETS`, `ANIMATION_PRESETS`.
  - Migrate logic from `FightScene.js` helpers (`getLightingPresetForCity`, etc.) to this config or a helper utility.
- Create `src/config/combatConfig.js`:
  - Define combo thresholds and names (currently in `FightScene.js` constants or literals).
- Update `src/config/rosterConfig.js`:
  - Update asset paths to match the new `public/assets` structure.
  - Consolidate any data from `fighterConfig.js` and deprecate `fighterConfig.js`.

**Scene Refactoring**
- Update `src/scenes/FightScene.js`:
  - Remove hardcoded configuration objects.
  - Import from `src/config/`.
  - Use `rosterConfig` for character names.
- Update `src/scenes/PreloadScene.js`:
  - Update all `this.load` calls to point to the new `/assets/...` paths (Vite serves `public` at root).
  - Update `AudioManager` loader paths.

**Build & Serve Compatibility**
- Verify `vite.config.js` treats `public` correctly (default behavior).
- Ensure backend (`server/index.js`) still serves `photos/` correctly for the API.

## Existing Code to Leverage

**`src/config/rosterConfig.js`**
- Already exists. Will be the source of truth for fighter paths.

**`src/scenes/FightScene.js`**
- Contains the "business logic" for selecting presets (`getLightingPresetForCity`). This logic should be preserved but the *data* (the presets themselves) extracted.

**`src/scenes/PreloadScene.js`**
- Contains the comprehensive list of all assets currently used. Use this as the checklist for what needs to be moved.

## Out of Scope
- Adding new characters or stages.
- Changing the visual design of the UI.
- Modifying the backend photo scanning logic (except strictly for path fixes).
- Implementing new gameplay mechanics.
