# Spec Requirements: Refine Config Architecture

## Initial Description

Refactor the configs to extract them to a single json file (`gameData.json`), but keep static preset definitions (lighting, parallax layers, animations) inside the `ConfigManager` class. `gameData.json` should only contain the configuration for cities/arenas (mapping them to presets) and the roster/combat data, allowing for easy content addition without code changes for presets.

## Requirements Discussion

### First Round Questions

**Q1:** I assume `arenas` (the list of cities) and `roster` (the list of fighters) should REMAIN in `gameData.json` so you can easily add new content. Is that correct?
**Answer:** correct

**Q2:** I assume the `presets` section (definitions for lighting, weather, animation, parallax layers) should be MOVED into `ConfigManager.js` as hardcoded constants/private fields. Is that correct?
**Answer:** corret

**Q3:** What about the `combat` section (damage values, combo thresholds)? Should this remain in `gameData.json` (editable) or move to the class (static)?
**Answer:** remain in gameData.json

**Q4:** Should `ConfigManager` continue to expose the exact same API (e.g., `getLightingPresetForCity`) so that no other files (like `FightScene.js`) need to be changed?
**Answer:** please advice best practice

### Existing Code to Reference

No similar existing features identified for reference.

### Follow-up Questions

**Follow-up 1:** Advice on Q4 (API Surface)
**Answer:** Best practice is to maintain the existing public API surface of `ConfigManager` as much as possible (e.g., `getLightingPresetForCity(cityId)`) to avoid a ripple effect of refactoring across all Scenes. The implementation details (fetching from JSON vs internal constant) should be hidden from the consumer. However, we might want to strictly type or document the return values since they now come from static code. We will proceed with **maintaining the existing API** to minimize regression risk.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **JSON Cleanup:** Remove `presets` (parallax, lighting, weather, animation) from `src/config/gameData.json`.
- **Class Update:** Move the definitions of these presets into `src/config/ConfigManager.js` as `static` or `const` data.
- **Data Retention:** Keep `arenas`, `roster`, and `combat` sections in `src/config/gameData.json`.
- **Logic Update:** Update `ConfigManager` methods to:
  1. Look up the _preset key_ for a city from `gameData.json` (e.g., Paris uses "outdoor_day").
  2. Retrieve the _actual preset object_ from the internal static data.
  3. Return the merged/resolved configuration.

### Reusability Opportunities

- Reuse existing `ConfigManager` methods but change their internal implementation.

### Scope Boundaries

**In Scope:**

- modifying `src/config/gameData.json`
- modifying `src/config/ConfigManager.js`
- Updating tests in `tests/Config.test.js` to reflect the new internal structure (if they test implementation details).

**Out of Scope:**

- Changing `FightScene.js` or other consumers (unless API breaks, which we aim to avoid).
- Adding new presets or game content.

### Technical Considerations

- **Backward Compatibility:** Ensure `getLightingPresetForCity` returns the exact same object structure as before.
- **Safety:** Handle cases where a JSON file references a non-existent preset key (default to a safe fallback).
