# Specification: Enhance Fighter Select UI

## Goal

Overhaul the visual design of the Character Select screen to match a "Mortal Kombat 11" aesthetic, featuring a cinematic background, vertical rectangular fighter slots with metallic borders, and polished selection effects, optimized for iPad.

## User Stories

- As a player, I want to see a visually stunning character select screen that feels premium and cinematic.
- As a player, I want the fighter icons to be large and clear rectangular portraits so I can easily identify and tap them on my iPad.
- As a player, I want clear visual feedback (highlights, scaling) when I select a character so I know who I've picked.

## Specific Requirements

**Background Implementation**

- Replace the current solid black background with `background.png` (scaled to `cover` the screen).
- Ensure the background is centered and responsive to aspect ratio changes (iPad landscape focus).
- Adjust or remove existing "spotlight" graphics if they clash with the new cinematic background (likely replace with a subtle overlay if needed).

**Grid Layout Refactor**

- Change the grid layout from square icons to **vertical rectangles (approx 3:4 aspect ratio)**.
- Center the grid dynamically on the screen (likely moving it lower or ensuring it doesn't overlap with the "Full Body" portraits if they remain).
- Adjust spacing (gap) between slots to match the dense, cohesive look of the mockup (approx 6px gap).

**Icon Visual Style**

- Implement a **Metallic Border Effect** for each slot:
  - Outer Border: Dark Bronze (`#5c4d3c`, approx 2px).
  - Inner Border: Bright Gold (`#a88d57`, approx 1px).
- Unselected State: Portraits should be slightly dimmed (opacity ~0.9).
- Selected State:
  - Scale up slightly (approx 1.05x).
  - Border changes to White or bright Gold.
  - Inner glow effect (`#ffdb76`).
  - Maintain the existing **Red (P1)** and **Blue (AI)** distinct highlight colors, likely by tinting the border or adding a colored glow behind the slot.

**Touch Optimization**

- Ensure the hit area for each slot matches the new larger rectangular shape.
- Verify that touch interactions (tap to select) remain responsive.

## Visual Design

**`planning/visuals/mockup.html`**

- **Border Style:** Use the CSS `border: 2px solid #5c4d3c` and `box-shadow: inset 0 0 0 1px #a88d57` as the reference for the Phaser Graphics implementation.
- **Slot Shape:** 80x105px (scaled up for actual device resolution).
- **Hover/Active State:** `transform: scale(1.05)`, `box-shadow: inset 0 0 0 2px #ffdb76, 0 0 15px #ffdb76`.

**`planning/visuals/background.png`**

- Use as the main background image.
- Dark, cinematic, sci-fi/gothic structures.

## Existing Code to Leverage

**`src/scenes/CharacterSelectScene.js`**

- **`rosterConfig` Integration:** Reuse the loop that iterates over `rosterConfig` to build the grid.
- **Selection Logic:** Reuse `selectCharacter(index)` and `confirmSelection()` methods.
- **Audio:** Reuse `this.audioManager` calls for UI sounds.
- **`fitInArea`:** Reuse/adapt this helper for fitting the portrait images into the new rectangular slots.

**`src/config/rosterConfig.js`**

- Source of truth for character IDs and asset paths.

## Out of Scope

- Changing the actual character roster data (adding/removing characters).
- Creating new "Full Body" portrait assets (we will reuse existing ones).
- Changing the transition logic to the Arena Select screen (visuals only).
- Implementing the specific "text tooltip" from the mockup (we already have a large Name display).
