# Refactor Resources and Configuration

## Goal
Clean up the repository structure by consolidating resource folders (`resources/`, `assets/`, `photos/`) and extracting hardcoded configurations (presets, names, asset paths) into a centralized configuration system.

## Initial Description
- Move assets into a clean `public/assets/` structure.
- Consolidate `resources`, `assets`, and `photos` folders.
- Extract `FightScene.js` presets (Animation, Lighting, Weather) into config files.
- Extract character names and other hardcoded strings into config files.
- Ensure audio files are organized.

## Context
The current repository has a messy asset structure with scattered files in `resources/`, `assets/`, and `photos/`. `FightScene.js` contains large hardcoded configuration objects for visual effects. We need to standardize this to improve maintainability.
