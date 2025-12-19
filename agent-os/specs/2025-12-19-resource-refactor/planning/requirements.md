# Spec Requirements: 2025-12-19-resource-refactor

## Initial Description
Refactor resources and configuration. Clean up the repository structure by consolidating resource folders (`resources/`, `assets/`, `photos/`) and extracting hardcoded configurations (presets, names, asset paths) into a centralized configuration system.

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want to consolidate `resources/`, `assets/`, and the *game assets* currently in `photos/` into a unified `public/assets/` structure.
**Answer:** Yes (Inferred from prompt "clean the repository, move out the configs... rething how we can make it more usable").

**Q2:** Regarding the *user content* in `photos/` (the personal photos for the slideshow): I assume these should remain in a separate `photos/` directory at the project root.
**Answer:** Yes, `photos/` is for user data (Memory Arenas). We will ensure it is clean and distinct from static game assets.

**Q3:** I plan to extract the hardcoded configurations from `FightScene.js` into modular config files in `src/config/`.
**Answer:** Yes, explicitly requested ("move out the configs... into a config file").

**Q4:** I assume we need to update the asset loading logic (likely in a `PreloadScene` or `BootScene`) to reflect these new paths.
**Answer:** Yes.

**Q5:** You mentioned "mp3s outside" resources. I assume you want all audio files moved to `public/assets/audio/` and categorized.
**Answer:** Yes, requested ("inside resources we have audio amd also mp3s outiside... need to refactor").

### Existing Code to Reference
- `src/scenes/FightScene.js`: Contains the hardcoded presets to extract.
- `resources/`, `assets/`, `photos/`: Directories to process.
- `src/systems/`: Likely consumes some of these configs.

### Follow-up Questions
None required. The goal is clear: structural hygiene and externalization of config.

## Visual Assets

### Files Provided:
No visual assets provided.

## Requirements Summary

### Functional Requirements
1.  **Repository Cleanup:**
    *   Establish a standard `public/assets/` directory.
    *   Subdirectories: `public/assets/audio/`, `public/assets/images/`, `public/assets/data/` (if needed).
    *   Move files from `resources/` and root `assets/` to this new structure.
    *   Audit `photos/` to ensure it only contains user-content (cities/memories) and not core game assets.
2.  **Configuration Extraction:**
    *   Create `src/config/` directory.
    *   **Arena Config:** Extract `ARENA_CONFIGS`, lighting, weather, and animation presets.
    *   **Fighter Config:** Extract character names, texture keys, and basic stats.
    *   **Combat Config:** Extract combo definitions, damage values, and attack ranges.
3.  **Code Refactoring:**
    *   Refactor `FightScene.js` to import configurations.
    *   Refactor Asset Loader (e.g., `PreloadScene`) to use the new file paths.
    *   Ensure strict separation of concerns: Scene handles logic, Config handles data.

### Reusability Opportunities
- Use `src/config/` as the single source of truth for game constants, making future features (like new characters or stages) easier to add by just editing files.

### Scope Boundaries
**In Scope:**
- Moving files and updating paths.
- Creating config files.
- Updating `FightScene.js` and `PreloadScene.js`.

**Out of Scope:**
- changing gameplay mechanics.
- Adding new content (new characters/stages).
- Changing the backend photo scanning logic (unless paths break).

### Technical Considerations
- **Vite Public Dir:** Vite serves files in `public/` at the root `/`. Code references to `resources/image.png` will need to change to `assets/images/image.png` (assuming `public/` is root).
- **Audio:** Ensure audio manager finds the new paths.
