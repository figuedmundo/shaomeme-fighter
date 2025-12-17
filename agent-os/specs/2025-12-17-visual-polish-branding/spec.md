# Specification: Visual Polish & Branding

## Goal
Elevate the visual and audio quality of the game to match a cohesive "Shaomeme Fighter" brand by integrating custom logos, unified typography, cinematic filters, and responsive UI sounds.

## User Stories
- As a player, I want to see the custom "Shaomeme Fighter" logo in the menus, so that the game feels personalized and complete.
- As a player, I want to hear audio feedback when interacting with menus, so that the UI feels responsive.
- As a player, I want the visual style (fonts, colors, filters) to be consistent across all screens, so that the game feels like a polished product.
- As a player, I want to listen to a specific meaningful soundtrack during the victory slideshow, so that the emotional reward is heightened.

## Specific Requirements

**Asset Management**
- Copy `assets/shaomeme_fighter.png` to `resources/` for game loading.
- Copy `refs/soundtrack.mp3` to `resources/` for game loading.
- Create `planning/placeholders.md` listing missing assets (UI hover/select sounds, custom font if later desired).

**Visual Branding (Logos & Typography)**
- Replace existing text/placeholder logos in `MainMenuScene` (and `BootScene` if applicable) with `shaomeme_fighter.png`.
- Enforce `PressStart2P` font family globally across all UI text (CSS and Phaser Text objects).
- Add a footer text "Created by Edmundo for [Girlfriend]" to the `MainMenuScene`.
- Apply "Mortal Kombat" color palette (Gold `#ffd700`, Deep Red `#880000`, Black `#111111`) to main UI elements via CSS variables.

**Cinematic Filters**
- Apply CSS filters (`sepia(0.3) contrast(1.2)`) to the background container of `ArenaSelectScene` to match the "memory" aesthetic.
- Apply similar filters to the `VictorySlideshow` image container (reusing/refining existing logic).

**Audio Polish**
- Implement a simple "Sound Manager" pattern or helper function to play UI sounds.
- Bind `attack1.mp3` (as a placeholder for "Select") to all primary UI buttons ("Start", "Fight", "Back", "Exit").
- Update `VictorySlideshow.js` to play `soundtrack.mp3` instead of the fallback/generic music.

## Visual Design

**`assets/shaomeme_fighter.png`**
- Use as the primary hero image in the Main Menu.
- Scale to fit width while maintaining aspect ratio.

## Existing Code to Leverage

**`src/styles/victory.css`**
- Reuse the `.cinematic-filter` class.
- Extend `src/styles/styles.css` with new global variables for branding colors.

**`src/components/VictorySlideshow.js`**
- Modify the `handleAudio` method to specifically load and play `soundtrack` key.

**`src/scenes/MainMenuScene.js`**
- Update the `create` method to load the new logo image instead of text.

## Out of Scope
- Creating custom WebGL shaders for in-game sprite filtering.
- Implementing a complex audio mixer (simple play/stop is sufficient).
- Designing new UI assets from scratch (buttons/panels will use CSS styling).
