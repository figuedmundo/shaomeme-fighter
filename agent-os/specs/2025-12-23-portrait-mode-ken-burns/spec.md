# Specification: Portrait Mode Ken Burns

## Goal

Enhance the `VictorySlideshow` to intelligently handle portrait-oriented photos by applying a specialized top-to-bottom panning "Ken Burns" effect that allows the entire image to be seen, replacing the generic zoom effect for these specific images.

## User Stories

- As a **player**, I want to see the full content of vertical photos (like full-body shots or tall landmarks) panning smoothly from top to bottom, so I don't miss any details.
- As a **player**, I want horizontal/landscape photos to continue using the existing gentle zoom effect, so the slideshow remains dynamic and varied.

## Specific Requirements

**Orientation Detection**

- Logic must detect if a photo is "portrait" (Height > Width) or "landscape" before displaying it.
- This check should happen inside the `showPhoto` loop in `VictorySlideshow.js` after the image has loaded (or by pre-calculating from metadata if available).

**Dynamic Ken Burns Animation (Portrait)**

- **Start Position:** Image top edge aligned with container top. Width fills container.
- **End Position:** Image bottom edge aligned with container bottom.
- **Motion:** Linear or Ease-out pan downwards.
- **Keyframe:** Needs dynamic calculation or CSS variable injection because the translation distance depends on image height relative to container height.
- **Duration:** Calculated dynamically based on image height (e.g., `Height * Multiplier` or `BaseTime + (Height/Width * Factor)`). Taller images get longer durations to keep pan speed comfortable.

**Existing Ken Burns (Landscape)**

- Retain the existing random zoom/pan logic for non-portrait images.
- Ensure the transition between these two modes is seamless.

**Visual Context**

- The "Polaroid" white border must remain.
- The "Blurred Background" (filling the screen with a copy of the photo) must remain.
- The panning animation happens _inside_ the Polaroid frame's content area.

**Transition Logic**

- When the portrait pan reaches the bottom, the slideshow immediately transitions (fades) to the next slide.
- This overrides the standard fixed 5-second interval for portrait photos (the interval effectively becomes the animation duration).

## Existing Code to Leverage

**`src/components/VictorySlideshow.js`**

- Reuse `showPhoto()` method structure.
- Reuse `createOverlay()` for DOM structure.
- Extend `imgElement` manipulation to handle dynamic classes/styles.

**`src/styles/victory.css`**

- Reuse `.polaroid-frame` and `.blurred-background` styles.
- Create new `@keyframes ken-burns-portrait` (or handle via dynamic `transform` transitions in JS).

## Out of Scope

- Backend API changes (photo serving).
- Changes to "Hearts" animation or spawning logic.
- Changes to audio playback.
- Interactive controls (pause/manual navigation) beyond what exists.
- "Movie filter" or "Cinematic mode" changes (these persist as-is).
