# Spec Requirements: Enhance Fighter Select UI

## Initial Description

improve the select fighter vew, can we put a background and make the icons of the faces of the fighet more visual appealing

## Requirements Discussion

### First Round Questions

**Q1:** Background preferences?
**Answer:** User wants to use the specific `background.png` provided in the visuals folder, which is the "mockup background without the middle icons". It's a dark, cinematic background.

**Q2:** Icon Style?
**Answer:** Match the CSS style defined in `mockup.html`.

- Shape: Vertical rectangles (~3:4 aspect ratio).
- Style: Metallic border effect (Bronze outer, Gold inner).
- Dimensions: Approx 80x105px (scaled for iPad).

**Q3:** Visual State (Selected vs Unselected)?
**Answer:**

- **Unselected:** Slightly dimmed (opacity 0.9).
- **Selected/Highlighted:**
  - Keep the existing **Red (P1)** and **Blue (AI/P2)** highlight logic from the current implementation.
  - Apply the "scale up" and "glow" effects from the mockup to the highlighted selection.

**Q4:** Layout?
**Answer:** Match the centralized grid layout from `mockup.html`. Ensure it is optimized for iPad (touch targets).

**Q5:** Portrait Source?
**Answer:** Use existing portrait images.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: **Current CharacterSelectScene**
  - Path: `src/scenes/CharacterSelectScene.js`
  - Logic to reuse: P1/AI selection logic, "Spotlight" effects (might need adjustment for new background), audio triggers.

**Visual Reference:**

- **Mockup HTML:** `agent-os/specs/2025-12-23-enhance-fighter-select-ui/planning/visuals/mockup.html` (Defines the exact CSS for borders, shadows, and spacing).

## Visual Assets

### Files Provided:

- `background.png`: High-res, dark, cinematic background (floating jagged structures, gothic/sci-fi vibe).
- `mockup.html`: HTML/CSS reference for the "Mortal Kombat 11" style grid.
- `mockup.jpg`: The original visual reference.

### Visual Insights:

- **Style:** "Dark, cinematic, gritty, and photorealistic".
- **Color Palette:** Deep blacks, charcoal greys, metallic gold/bronze borders.
- **Grid:** Centered, vertical rectangular slots.
- **Interactions:** Scale up on hover/select with a bright gold inner glow.

## Requirements Summary

### Functional Requirements

- **Replace Background:** Use `background.png` scaled to cover the screen (replacing the solid black + simple spotlights).
- **Refactor Grid:**
  - Change from square icons to **vertical rectangles (3:4)**.
  - Implement the **Metallic Border** style (Bronze outer, Gold inner) using Phaser Graphics or DOM/Container logic (likely Phaser Graphics/Images to maintain Canvas performance).
  - Apply **Red/Blue** distinct highlights for P1 and AI selections, likely overlaid or integrated into the border glow effect.
- **Touch Optimization:** Ensure the new rectangular slots are large enough for comfortable touch interaction on iPad.
- **Responsive Layout:** Center the grid dynamically based on screen size (iPad landscape focus).

### Reusability Opportunities

- Reuse the existing `rosterConfig` for character data.
- Reuse `AudioManager` for select sounds.
- Reuse the `fitInArea` logic but adapt it for the new 3:4 container aspect ratio.

### Scope Boundaries

**In Scope:**

- Visual overhaul of `CharacterSelectScene`.
- Layout changes to the grid.
- Asset integration (Background).

**Out of Scope:**

- Changing the actual roster data.
- Changing the "Full Body" portrait logic (though the container for it might move slightly to accommodate the new background).
- New character assets (using existing portraits).

### Technical Considerations

- **Phaser Implementation:** The CSS effects in `mockup.html` (box-shadow, inset borders) need to be translated to **Phaser Graphics** commands or mostly pre-rendered assets if performance is an issue (though Phaser Graphics should handle simple rects fine).
- **Z-Index:** Selected character must pop to the front (`depth` management).
