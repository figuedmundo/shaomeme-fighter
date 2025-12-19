Based on your request to refactor resources and configuration for [resource-refactor], I have some clarifying questions:

1. I assume you want to consolidate `resources/`, `assets/`, and the *game assets* currently in `photos/` into a unified `public/assets/` structure (e.g., `public/assets/audio`, `public/assets/sprites`, `public/assets/backgrounds`). Is that correct?
2. Regarding the *user content* in `photos/` (the personal photos for the slideshow): I assume these should remain in a separate `photos/` directory at the project root (as they are data, not game assets), but we should ensure the backend API knows where to find them. Is that correct?
3. I plan to extract the hardcoded configurations from `FightScene.js` into modular config files in `src/config/`. For example: `src/config/arenas.js` (lighting/weather/bg presets), `src/config/characters.js` (names, stats). Does this structure work for you?
4. I assume we need to update the asset loading logic (likely in a `PreloadScene` or `BootScene`) to reflect these new paths. Should I also verify if `server/index.js` or `server/ImageProcessor.js` needs updates regarding asset serving?
5. You mentioned "mp3s outside" resources. I assume you want all audio files moved to `public/assets/audio/` and categorized (e.g., `/announcer`, `/sfx`, `/music`). Correct?

**Existing Code Reuse:**
Are there existing configuration files or patterns in `src/config/` or `src/constants/` that we should follow? I see a `src/config/` folder in the file tree.

**Visual Assets Request:**
Do you have any diagrams of the desired folder structure or screenshots of how you'd like the config files to look?

If yes, please place them in: `agent-os/specs/2025-12-19-resource-refactor/planning/visuals/`

Please answer the questions above.