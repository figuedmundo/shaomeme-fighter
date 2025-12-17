# Spec Requirements: Visual Polish & Branding

## Initial Description
Integrate the new "Shaomeme Fighter" logos, add UI sounds, and apply "game style" filters to background photos.

## Requirements Discussion

### First Round Questions

**Q1:** "Shaomeme Fighter" logo usage?
**Answer:** Yes, replace placeholder logos in MainMenuScene and BootScene.

**Q2:** "Game style" filters?
**Answer:** Yes, match the "cinematic" look (sepia, high contrast) established in the Slideshow.

**Q3:** UI Sounds?
**Answer:** User asked for a list of missing sounds.
**Resolution:** We have `arena.mp3`, `vs.mp3`, `KO.mp3`, `attack1-5.mp3`. Missing specific `hover`, `select`, `back`.
**Plan:** Use `attack1.mp3` as placeholder for `select`. Create a `placeholders.md` document to track missing assets.

**Q4:** Font style?
**Answer:** Yes, unify branding. User mentioned MK font in refs but it wasn't found.
**Resolution:** Use existing `PressStart2P` for now.

**Q5:** Global Branding?
**Answer:** User asked for suggestions.
**Resolution:** Add "Created by [Name]" footer. Enforce Gold/Red/Black palette.

### Follow-up Questions

**Follow-up 1:** Slideshow Music?
**Answer:** User added `refs/soundtrack.mp3`.
**Resolution:** Use `refs/soundtrack.mp3` for the Victory Slideshow background music.

## Visual Assets

### Files Identified:
- `assets/shaomeme_fighter.png`: The main logo file.
- `refs/soundtrack.mp3`: The music track for the victory slideshow.
- `resources/PressStart2P-Regular.ttf`: The global font.

### Visual Insights:
- **Logo:** High resolution PNG, should be scaled to fit UI headers.
- **Filters:** `filter: sepia(0.3) contrast(1.2)` is the baseline.

## Requirements Summary

### Functional Requirements
- **Logo Integration:** Display `shaomeme_fighter.png` in `MainMenuScene`.
- **Global Styling:** Apply "Cinematic" CSS filters to `ArenaSelectScene` and `FightScene` backgrounds (via CSS class or Phaser tint/pipeline if possible, but DOM overlay filters are easier for HTML elements).
- **Audio Polish:**
    - Play `attack1.mp3` (placeholder) on Button Clicks.
    - Play `refs/soundtrack.mp3` during `VictorySlideshow`.
- **Typography:** Enforce `PressStart2P` font family on all UI text.
- **Footer:** Add "Created by Edmundo for [Girlfriend]" footer to Main Menu.

### Reusability Opportunities
- **CSS:** Reuse `src/styles/victory.css` filter classes.
- **Audio:** Reuse existing `attack` sounds for UI feedback.

### Scope Boundaries
**In Scope:**
- Replacing Main Menu logo.
- Adding CSS filters to background containers.
- Wiring up Button Click sounds.
- Playing specific slideshow music.
- Creating `placeholders.md` report.

**Out of Scope:**
- Creating custom shaders for Phaser sprites (only CSS filters for backgrounds/UI).
- Finding the "missing" MK font (will use PressStart2P).

### Technical Considerations
- **Asset Movement:** Need to copy `assets/shaomeme_fighter.png` and `refs/soundtrack.mp3` to `resources/` (or `public/`) so the game can load them.
- **CSS Filters:** Phaser Canvas doesn't easily accept CSS filters *inside* the canvas. We might need to apply filters to the *canvas element itself* or use Phaser FX for in-game backgrounds.
    - *Decision:* For `ArenaSelect` (DOM UI), use CSS. For `FightScene` (Phaser), potentially use `postFX` if supported, or just keep it simple with CSS on the container if acceptable. Spec says "background photos", which implies the static images.
