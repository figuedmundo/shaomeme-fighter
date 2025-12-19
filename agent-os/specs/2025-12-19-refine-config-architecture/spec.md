# Specification: Refine Config Architecture

## Goal

Refactor the configuration architecture to separate static engine definitions (lighting, parallax, animation presets) from editable content (arenas, roster, combat values). Static definitions will move to `ConfigManager` code, while content remains in `gameData.json`.

## User Stories

- As a **developer**, I want to add new arenas in `gameData.json` by simply referencing existing presets (e.g., "lighting": "outdoor_day") so that I don't have to touch JavaScript code.
- As a **developer**, I want the detailed definitions of technical presets (like parallax scroll factors) to be hidden in the `ConfigManager` class so that the JSON file remains clean and focused on content.
- As a **developer**, I want the public API of `ConfigManager` to remain unchanged so that I don't break existing game logic in Scenes.

## Specific Requirements

**Cleanup gameData.json**

- Remove the `presets` key and all its children (`parallax`, `lighting`, `weather`, `animation`) from `src/config/gameData.json`.
- Ensure `arenas`, `combat`, and `roster` keys remain intact in `src/config/gameData.json`.

**Static Presets in ConfigManager**

- Define `PARALLAX_PRESETS`, `LIGHTING_PRESETS`, `WEATHER_PRESETS`, and `ANIMATION_PRESETS` as static constant objects within `src/config/ConfigManager.js`.
- Copy the exact data structures currently in `gameData.json` presets into these constants.

**ConfigManager Logic Update**

- Update `getParallaxConfigForCity(city)`:
  - Lookup the city in `this.data.arenas`.
  - Get the preset key from `arena.presets.parallax`.
  - Return the corresponding object from the internal `PARALLAX_PRESETS` constant.
  - Handle defaults/nulls safely.
- Update `getLightingPresetForCity(city)`:
  - Lookup the city in `this.data.arenas`.
  - Get the preset key from `arena.presets.lighting` (default to 'outdoor_day').
  - Return the corresponding object from the internal `LIGHTING_PRESETS` constant.
- Update `getWeatherPresetForCity(city)`:
  - Lookup the city in `this.data.arenas`.
  - Get the preset key from `arena.presets.weather`.
  - Return the corresponding object from the internal `WEATHER_PRESETS` constant.
- Update `getAnimationPresetForCity(city)`:
  - Lookup the city in `this.data.arenas`.
  - Get the preset key from `arena.presets.animation`.
  - Return the corresponding object from the internal `ANIMATION_PRESETS` constant.

**Test Updates**

- Update `tests/Config.test.js` to ensure it tests the integration of JSON content + Static presets correctly.
- Verify `tests/server.test.js` and other tests still pass (regression check).

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**src/config/ConfigManager.js**

- Currently loads `gameData.json` directly.
- Has the method signatures (`getLightingPresetForCity`, etc.) that must be preserved.
- Will need to be modified to mix internal static data with external JSON data.

**src/config/gameData.json**

- Contains the source data for both the content (to keep) and the presets (to move).
- Will be the source for the copy-paste operation to `ConfigManager.js`.

## Out of Scope

- Changing the method signatures of `ConfigManager` (e.g., `getLightingPresetForCity`).
- Refactoring `FightScene.js` or `ArenaSelectScene.js`.
- Adding new presets or new arena content during this refactor.
- Moving `roster` or `combat` data out of `gameData.json`.
