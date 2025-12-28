# Task Breakdown: Fix Portrait/Landscape Reward Slideshow

## Overview

Total Tasks: 2 groups

## Task List

### Frontend Implementation

#### Task Group 1: Component & Style Updates

**Dependencies:** None

- [x] 1.0 Update VictorySlideshow Logic and Styles
  - [x] 1.1 Write 2-4 focused tests for aspect ratio detection
    - Create a simple test file `tests/VictorySlideshowHelper.test.js` (or similar) to verify `isPortrait` logic and potential new landscape detection helper.
    - Test standard portrait, landscape, and square dimensions.
  - [x] 1.2 Update `src/components/VictorySlideshow.js`
    - Modify `showPhoto` to reliably determine image aspect ratio.
    - Add logic to toggle `.is-landscape` class on the polaroid frame in addition to `.is-portrait`.
    - Ensure class updates happen before the image fades in.
    - **FIX:** Implemented explicit JS-based calculation of frame dimensions to prevent flexbox collapse with absolute positioned images.
  - [x] 1.3 Update `src/styles/victory.css` for Dynamic Sizing
    - Refactor `.polaroid-frame` to use max-width/max-height constraints (e.g., `max-height: 85vh`, `max-width: 85vw`).
    - Fix flexbox collapse issue by ensuring the container respects image aspect ratio or vice-versa.
    - Implement `.polaroid-frame.is-landscape` specific styles if needed to maximize width usage.
    - Ensure `.polaroid-frame.is-portrait` uses flexible sizing (e.g., `vh` units) rather than fixed pixels if not already doing so, matching the "contain" strategy.
    - Verify `object-fit: contain` on the image works in harmony with the frame's constraints.
    - **FIX:** Removed CSS-based sizing constraints that conflicted with JS inline styles.
  - [x] 1.4 Verify Visual consistency
    - Ensure the "Ken Burns" animation keyframes still apply correctly to the new flexible container.
    - Check that the date stamp remains correctly positioned in the bottom border.
  - [x] 1.5 Ensure logic tests pass
    - Run the tests from 1.1 to verify the helper logic.
    - Manual verification will be required for the visual CSS changes (as standard unit tests won't catch layout shifts).

**Acceptance Criteria:**

- Landscape images display with correct aspect ratio and visible polaroid frame (no "white rectangle" collapse).
- Portrait images continue to display correctly.
- Frame never exceeds ~85% of viewport dimensions.
- Date and borders remain visible and correctly proportioned.

### Testing & Verification

#### Task Group 2: Verification

**Dependencies:** Task Group 1

- [x] 2.0 Verify Fix
  - [x] 2.1 Manual Visual Verification (Crucial for CSS)
    - Since this is a visual bug, extensive manual verification is required.
    - Verify landscape photo display.
    - Verify portrait photo display.
    - Verify square photo display (if available).
    - Check "Ken Burns" effect smoothness.
  - [x] 2.2 Run Existing Tests
    - Run `tests/VictorySlideshow.test.js` (if it exists) or related integration tests to ensure no regressions in flow.
    - Run `tests/VictorySlideshowLogic.test.js` and `tests/VictorySlideshowStyles.test.js` from the file structure if applicable.

**Acceptance Criteria:**

- Visual confirmation that the bug is resolved.
- No regressions in slideshow navigation or closure.

## Execution Order

1. Frontend Implementation (Task Group 1)
2. Testing & Verification (Task Group 2)
