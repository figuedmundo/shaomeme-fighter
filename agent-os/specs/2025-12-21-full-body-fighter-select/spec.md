# Specification: Full-Body Fighter Select Visuals

## Goal

Upgrade the character selection screen with high-resolution, full-body fighter poses and a dramatic split-screen layout optimized for iPad and responsive for iPhone.

## User Stories

- As a player, I want to see a high-quality, full-body image of my selected character in a cool pose so that the game feels premium and professional.
- As a player, I want to see the AI opponent's full-body pose revealed with a dramatic animation so that the upcoming fight feels more impactful.
- As a player, I want the UI to take full advantage of my iPad's large screen while still looking great on my iPhone.

## Specific Requirements

**Roster Data Extension**

- Add a new property `fullBodyPath` to each character object in `ConfigManager.js` (and the underlying `gameData.json`).
- High-resolution target for these assets: 1024px height.
- Existing `portraitPath` remains for small grid icons and HUD.

**Split-Screen Layout**

- Implement a clear visual divide between the Player (Left) and AI (Right) halves.
- Position the full-body poses to anchor at the bottom edges of their respective sides.
- **iPad Optimization**: Poses should be large, utilizing the extra vertical and horizontal space.
- **iPhone Optimization**: Scale and position poses to fit the narrower aspect ratio, potentially allowing slight overlap with the selection grid.

**Dynamic Backgrounds & Spotlight**

- Implement a "Spotlight" effect behind the active character selection.
- Use a radial gradient or a stylized "Glow" sprite that pulses gently.
- Dim the side that is not currently being highlighted (e.g., dim AI side until reveal).

**Dramatic AI Reveal**

- The reveal sequence starts after the player confirms their selection.
- Cycle through silhouettes or random character icons on the right side.
- Final reveal must use a white screen flash (`SceneTransition.flash(200)`).
- The chosen AI opponent appears in their full-body pose with a scale pulse (1.2x).

**Visual Consistency**

- Maintain the "Shaomeme Fighter" retro aesthetic.
- Use `Press Start 2P` font for character names and UI labels.
- Character names should be large and clearly associated with their respective poses.

## Visual Design

`No visual assets provided`

- Focus on vertical presence for fighter sprites.
- Layout should feel balanced even with varying sprite widths.

## Existing Code to Leverage

**`src/config/ConfigManager.js`**

- Use to manage the updated roster schema and asset paths.

**`src/scenes/CharacterSelectScene.js`**

- Overhaul `create()` and `selectCharacter()` to handle the new split-screen layout.
- Update `revealOpponent()` to use the new `fullBodyPath` assets.

**`src/utils/SceneTransition.js`**

- Use `flash()` for the reveal impact and `transitionTo()` for the final wipe.

**`src/utils/AudioManager.js`**

- Synchronize "tick" sounds with the reveal roll and announcer lines with the final reveal.

## Out of Scope

- Animating the full-body poses (they will be high-quality static sprites).
- Changing the fight logic itself (only the selection visuals are upgraded).
- Adding background environment previews to this screen (reserved for `ArenaSelectScene`).
