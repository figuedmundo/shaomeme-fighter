# Specification: Performance Optimization (Lazy Loading & Cleanup)

## Goal

To optimize the game's initial load time and runtime memory usage by implementing "Lazy Loading" for heavy assets (fighters, arenas) and ensuring proper resource cleanup between scenes, guaranteeing a smooth experience on mobile devices.

## User Stories

- As a player, I want the game to start quickly without waiting for every single character to load.
- As a player, I want the game to run smoothly (60 FPS) without crashing due to memory leaks on my iPad.
- As a developer, I want to ensure that only necessary assets are in memory during a fight.

## Specific Requirements

**Refactor `PreloadScene`**

- Remove the loop that loads ALL fighter spritesheets.
- Retain loading of global UI assets (logo, fonts), common audio (UI sfx, announcer basics), and lightweight configuration data.
- Ensure `PreloadScene` transitions quickly to the Splash/Main Menu.

**Enhanced `LoadingScene` (JIT Loading)**

- Update `src/scenes/LoadingScene.js` to handle actual asset loading.
- Input: `targetScene`, `targetData` (containing `player1`, `player2`, `arena` keys).
- Logic:
  - Check if assets for `player1` (and `player2` if applicable) are already in `this.textures`.
  - If not, use `this.load.spritesheet()` to queue them.
  - Check if assets for `arena` (backgrounds) are loaded.
  - If not, use `this.load.image()` to queue them.
  - Listen for `this.load.on('complete')` before transitioning.
  - Handle error cases (missing files) gracefully by loading a fallback/placeholder.

**Memory Cleanup System**

- Implement strict cleanup in `FightScene` shutdown.
- When leaving `FightScene`:
  - Identify unique assets used (e.g., "fighter_ann", "arena_paris").
  - Call `this.textures.remove(key)` to free VRAM.
  - Call `this.anims.remove(key)` for related animations to prevent stale references.
- Ensure `ArenaSelectScene` also cleans up preview images if they are heavy.

**Asset Optimization Script**

- Create a utility script `scripts/optimize-assets.js` (using `sharp` if available in devDependencies, or just a shell script).
- Target: `public/assets/fighters/**/*.png` and `public/assets/backgrounds/**/*.png`.
- Action: Resize to max reasonable dimensions (e.g., height 1080px) and compress to WEBP or optimized PNG.
- _Note:_ This is a dev-tool requirement, not runtime.

## Visual Design

_No new UI elements. The existing "LOADING..." screen in `LoadingScene` will simply be functional instead of cosmetic._

## Existing Code to Leverage

**`src/scenes/PreloadScene.js`**

- Move the fighter loading logic FROM here TO `LoadingScene`.

**`src/scenes/LoadingScene.js`**

- Expand `startLoading` method.
- Currently it just does `this.time.delayedCall`. Replace/Augment this with `this.load.start()` after queuing assets.

**`src/scenes/FightScene.js`**

- Add `shutdown()` or `destroy()` method to handle `this.textures.remove()`.

## Out of Scope

- Dynamic resolution scaling during gameplay.
- Advanced audio compression (ffmpeg dependency).
- Complex asset bundling/atlasing (keeping separate files for simplicity).
- "Low Quality" mode toggle in settings.
