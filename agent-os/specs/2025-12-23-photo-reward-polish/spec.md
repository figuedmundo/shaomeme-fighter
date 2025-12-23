# Specification: Photo Reward Polish

## Goal

Enhance the "Memory Arena" photo reward slideshow with cinematic visual effects, improved layout for portrait photos, interactive heart animations, and smooth transitions to create a more emotional and polished user experience.

## User Stories

- As a player, I want to see photos beautifully presented with a "Ken Burns" effect so that static images feel alive.
- As a player, I want portrait photos to fit the landscape screen elegantly without black bars, using a blurred background fill.
- As a player, I want to tap the screen to release floating hearts so that I can interact with the memories playfully.
- As a player, I want to see a cinematic filter (film grain/vignette) and Polaroid-style borders to make the photos feel like cherished keepsakes.

## Specific Requirements

**Photo Transitions & Ken Burns Effect**

- Implement smooth 1-second cross-fade transitions between photos.
- Apply randomized "Ken Burns" effect (slow pan/zoom, 5-10% scale change over 5s) to the active photo.
- Ensure the effect resets or randomizes for each new photo displayed.
- Use CSS animations/transforms for performance.

**Portrait Photo Layout**

- Display the main photo fully visible (contain) with a "Polaroid" style white border.
- Create a background layer displaying the _same_ photo, but zoomed to fill (cover), heavily blurred, and darkened to act as a dynamic backdrop.
- Ensure proper z-indexing so the main photo sits clearly above the blurred background.

**Cinematic Overlay**

- Add a persistent overlay layer on top of the photos (but below UI controls) with a film grain texture and vignette.
- Toggle this effect based on `gameData.json` configuration (add a global `cinematicMode` or per-arena setting).
- Use CSS `pointer-events: none` to allow clicks through to the interaction layer.

**Interactive Hearts**

- Create a visual feedback system where tapping anywhere on the screen spawns a heart.
- Hearts should spawn small, scale up (heartbeat motion), float upward on a randomized wavy path, and fade out.
- Implement an automatic spawner that releases hearts periodically (e.g., every 2-3 seconds) to keep the screen lively.
- Use standard heart assets (CSS shape or SVG) to avoid external dependencies.

**Audio Integration**

- Ensure the `victoryMusic` defined in `gameData.json` plays during the slideshow.
- Add a "pop" or subtle sound effect when hearts are spawned (optional/nice-to-have, reuse existing UI sounds if suitable).

**Polaroid Border**

- Wrap the main foreground image in a container that provides a white border with a slightly larger bottom padding (classic Polaroid look).
- Add a subtle drop shadow to lift the photo off the background.

**Visual Polish**

- Add a "Movie Style" filter (sepia/warmth + contrast) to the photos via CSS.
- Ensure the "Victory" title and "Exit" button remain legible and z-indexed above all visual effects.

## Existing Code to Leverage

**`src/components/VictorySlideshow.js`**

- Reuse the existing lifecycle (`show`, `startSlideshow`, `exit`) and overlay creation logic.
- Extend `createOverlay` to add the new background layer, cinematic overlay, and heart container.
- Update `showPhoto` to handle the dual-image update (background + foreground).

**`src/styles/victory.css`**

- Extend existing `.victory-overlay` and `.victory-image` styles.
- Add new classes for `.polaroid-frame`, `.blurred-background`, `.cinematic-grain`, and `.floating-heart`.
- Reuse/modify `.cinematic-filter` class.

**`src/config/gameData.json`**

- Use the existing `victoryMusic` property for audio.
- Add `cinematicMode: true` (or similar) to `gameData.json` if we want to make the filter optional.

**`src/systems/AudioManager.js`**

- Reuse `playMusic` and `stopMusic` methods as currently implemented.

## Out of Scope

- Changing the backend API (`/api/photos`).
- Modifying the combat or character select scenes.
- Adding complex 3D effects or WebGL shaders (stick to CSS).
- Changing the "Memory Arena" unlock logic.
- Implementing a "Share" feature for photos.
- User authentication or saving photos to the device.
