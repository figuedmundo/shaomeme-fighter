# Specification: Fix Portrait/Landscape Reward Slideshow

## Goal

Fix the issue where landscape images in the victory slideshow are displayed as a collapsed "small white rectangle" by implementing a dynamic sizing strategy for the polaroid frame that works for all aspect ratios (landscape, portrait, square).

## User Stories

- As a player, I want to see my photo rewards clearly displayed in the slideshow regardless of whether they are landscape or portrait, so that I can enjoy the memory.
- As a player, I want the polaroid frame (including the date and white border) to be fully visible and centered on the screen for every photo type.

## Specific Requirements

**Dynamic Frame Sizing**

- The `.polaroid-frame` container must use a "contain" strategy where its dimensions are determined by the image's aspect ratio, constrained by the screen size.
- A maximum width/height constraint (e.g., 85% of viewport) must be applied to the `.polaroid-frame` to ensure it never overflows the screen or gets cut off.
- The CSS must be updated to prevent the flexbox collapse issue (likely caused by lack of intrinsic width on the frame when the image is `width: 100%`).
- Remove the hardcoded fixed dimensions in `.polaroid-frame.is-portrait` if they conflict with the new dynamic approach, or update them to be more flexible.

**Landscape Logic**

- Update `VictorySlideshow.js` to detect landscape images (width > height) and apply a specific class (e.g., `.is-landscape`) if necessary for specific tuning, similar to the existing `.is-portrait` logic.
- Ensure the landscape class applies styles that maximize width while maintaining the aspect ratio within the viewport constraints.

**Visual Consistency**

- The blurred background image must remain visible and fill the screen behind the polaroid frame for all image types.
- The "polaroid" styling (white border, bottom padding for date, drop shadow) must persist and scale correctly with the frame.
- The handwritten date must remain positioned correctly in the bottom white border area.

**Animation Support**

- The "Ken Burns" effect (gentle zoom/pan) must continue to work on the frame/image container without breaking the layout or causing jitter during the cross-fade.

## Visual Design

_No specific visual assets provided, but following existing "Polaroid" aesthetic._

**Polaroid Layout**

- Image area: Centered, maximizing available space inside the frame.
- Border: White, approx 20px on sides/top, 80px on bottom.
- Date: Handwritten font, centered in the bottom 80px border, slightly rotated.

## Existing Code to Leverage

**`src/components/VictorySlideshow.js`**

- Reuse the `isPortrait(img)` helper method or extend it to determine aspect ratios.
- Reuse the `showPhoto(index)` method where the class toggling (`.is-portrait`) currently happens.
- Reuse the `createOverlay()` method structure where the DOM elements are built.

**`src/styles/victory.css`**

- Reuse the `.polaroid-frame` base styles (background, shadow, padding).
- Reuse the `.polaroid-date` styling.
- Reuse (and likely modify) the `.polaroid-frame.is-portrait` selector logic.

## Out of Scope

- Changes to the backend API (`/api/photos`).
- Changes to the photo fetching logic (other than ensuring dimensions are read).
- Redesigning the victory screen outside of the slideshow overlay.
- Adding new UI controls (like skip/pause buttons) - strictly fixing the display bug.
