# Spec Requirements: Performance

## Initial Description

Implement Phase 6.2: Performance:

- **Optimize Assets**: Compress images/audio.
- **60 FPS Lock**: Ensure smooth gameplay.
- **Memory Management**: Cleanup between scenes.
- **Load Time Optimization**: Lazy load non-critical assets.

## Requirements Discussion

### First Round Questions & Answers (Implicit Approval)

**Q1:** Asset Compression?
**Answer:** User approved defaults. We will implement automated scripts to compress images (sharp) and audio (ffmpeg if available, or just document the process). We will assume manual compression for now or a simple script using `sharp` for images in `assets/`.

**Q2:** 60 FPS Lock?
**Answer:** User approved defaults. We will ensure the game configuration targets 60 FPS and implement a basic "Performance Monitor" that logs warnings if FPS drops below 55 for extended periods. We won't implement dynamic visual degradation yet unless critical.

**Q3:** Memory Management?
**Answer:** User approved defaults. We will implement a `TextureManager` or verify `shutdown()` logic in scenes. Specifically, we will ensure that `ArenaSelectScene` and `FightScene` clean up large textures (backgrounds) when leaving.

**Q4:** Load Time Optimization?
**Answer:** User approved defaults. We will implement **Lazy Loading** for Fighter Spritesheets and Arena Backgrounds. Instead of loading ALL fighter spritesheets in `PreloadScene`, we will load only UI assets and Audio. Fighter sprites and Arena backgrounds will be loaded _on demand_ during `LoadingScene` (before the fight) or asynchronously in the selection screens.

**Q5:** Audio Compression?
**Answer:** User approved defaults. We will skip automated audio compression implementation for now as it requires complex dependencies (ffmpeg) and focus on code-side loading optimizations.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Preload Logic - Path: `src/scenes/PreloadScene.js` (Needs refactoring to remove heavy assets).
- Feature: Fight Loading - Path: `src/scenes/LoadingScene.js` (To be enhanced to load specific assets).

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

No visual assets provided.

## Requirements Summary

### Functional Requirements

1.  **Refactor PreloadScene**:
    - Remove `this.load.spritesheet` for all fighters.
    - Keep UI assets, common audio, and generic data.

2.  **Implement Lazy Loading**:
    - Update `LoadingScene.js` (which runs before `FightScene`?) or create a new intermediate loader.
    - When a character/arena is selected, load _only_ that specific character's spritesheet and that arena's assets before starting the fight.
    - Use `this.load.spritesheet` inside a scene that isn't `PreloadScene`, handling the `complete` event to proceed.

3.  **Memory Management**:
    - In `FightScene` shutdown/destroy: explicitly call `this.textures.remove(key)` for the character and arena assets to free VRAM.
    - Ensure `AudioManager` cleans up if necessary (though audio is usually global).

4.  **Performance Monitoring**:
    - Add a simple FPS logger in `BootScene` or `Main` that logs to `UnifiedLogger` if performance tanks.

### Reusability Opportunities

- Reuse `src/scenes/LoadingScene.js` if it exists (it does, based on file list) for the "Just In Time" loading.

### Scope Boundaries

**In Scope:**

- Refactoring `PreloadScene` to be lighter.
- Implementing JIT loading for Fighters/Arenas.
- Implementing Texture cleanup on Scene shutdown.
- Basic image compression script (optional helper).

**Out of Scope:**

- Complex dynamic resolution scaling.
- Automated CI/CD asset compression pipeline.
- Refactoring the entire Audio system (just loading).

### Technical Considerations

- **Risk**: If we unload assets, we must ensure they are reloaded if the user picks the same character again. The JIT loader must check `if (!this.textures.exists(key))` before loading.
