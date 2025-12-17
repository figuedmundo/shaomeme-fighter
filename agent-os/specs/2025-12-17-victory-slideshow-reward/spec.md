# Specification: Victory Slideshow Reward

## Goal
Implement a visually rich post-match victory sequence that displays a photo slideshow of the current arena (location), rewarding the player with cherished memories upon winning.

## User Stories
- As a player, I want to see a slideshow of photos from the location I just fought in after I win, so that I can relive those memories.
- As a player, I want the slideshow to have a cinematic feel (smoke borders, movie filters), so that it fits the "Shaomeme Fighter" aesthetic.
- As a player, I want the slideshow to play appropriate music (Victory/Location theme), so that the emotional impact is heightened.
- As a player, I want to easily exit the slideshow and choose a new arena, so that I can continue playing.

## Specific Requirements

**Trigger & State Management**
- The slideshow MUST automatically trigger after the `FightScene` determines a winner and the victory animation completes.
- A new method `showVictorySlideshow()` should be added to `FightScene` to handle this transition (pausing game physics/input).
- The slideshow MUST be a full-screen HTML overlay (DOM element) layered on top of the Phaser canvas.

**Data Fetching**
- Reuse the existing backend endpoint `GET /api/photos?city=[currentCity]` to fetch the list of images.
- The frontend must handle cases where no photos are returned (fallback to a "Victory" text or generic image).

**Slideshow Presentation**
- **Overlay:** A full-screen dark overlay (`z-index: 200`) blocking game interaction.
- **Smoke Frame:** The `smoke.png` asset MUST be used as a border frame on top of the photos.
- **Filters:** Apply CSS filters (e.g., `sepia(0.3)`, `contrast(1.1)`) to the photos to achieve a "cinematic memory" look.
- **Animation:** Photos MUST auto-advance every 3-4 seconds with a simple fade transition (CSS `opacity`).
- **Loop:** The slideshow should loop indefinitely until the user exits.

**Navigation**
- An "Exit" or "Continue" button MUST be visible (z-index above smoke) to allow the user to leave.
- Clicking "Exit" MUST navigate the user back to the `ArenaSelectScene`.

**Audio Logic**
- Upon Victory: Immediately stop combat music and play `KO.mp3` or `victory.mp3`.
- During Slideshow: Attempt to play a location-specific track (if metadata exists) or fallback to `arena.mp3` (or a specific victory theme if added later).

## Visual Design

**`planning/visuals/smoke.png`**
- Use as a decorative border frame (`position: absolute; inset: 0; pointer-events: none;`) over the image container.
- Ensure the center is transparent to reveal the underlying slideshow photos.

**`src/styles/victory.css` (Existing)**
- Reuse and update `.victory-overlay`, `.victory-image-container` classes.
- Add new classes for `.smoke-border` and `.cinematic-filter`.

## Existing Code to Leverage

**`server/index.js` - `/api/photos` Endpoint**
- Reuse this existing API to fetch the array of photo URLs for the current scene's `city`.

**`src/scenes/FightScene.js`**
- Hook into the `update()` loop or collision logic to detect HP <= 0.
- Use `this.add.dom()` or standard `document.createElement` logic (similar to `TouchVisuals` or `ArenaSelectScene` UI) to append the HTML overlay.

**`src/styles/victory.css`**
- Leverage the existing CSS structure for the overlay and close button. Update styling to match the new "smoke/cinematic" requirement.

## Out of Scope
- "Credits" text rolling functionality.
- Complex WebGL shaders for image transitions (CSS transitions only).
- Multi-track audio mixing or cross-fading (simple stop/play is sufficient).
- fetching music files from the backend (unless already supported by file structure, assume simple local resource lookup for now).
