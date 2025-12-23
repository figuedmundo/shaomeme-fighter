# Task Breakdown: Photo Reward Polish

## Overview

Total Tasks: 13

## Task List

### CSS & Styles

#### Task Group 1: Styles for Slideshow Polish

**Dependencies:** None

- [x] 1.0 Implement CSS styles for the new slideshow features
  - [x] 1.1 Write 2-8 focused tests for UI component styles (using visual regression or style checking if possible, otherwise simple component rendering tests)
    - Limit to 2-8 highly focused tests
    - Verify classes are applied correctly (e.g., `.polaroid-frame`, `.blurred-background`)
  - [x] 1.2 Add "Ken Burns" animation keyframes
    - Define CSS `@keyframes` for slow zoom/pan
    - Create utility classes for different directions (e.g., `.ken-burns-in`, `.ken-burns-out`)
  - [x] 1.3 Add "Polaroid" frame styles
    - Create `.polaroid-frame` class with white border and bottom padding
    - Add drop shadow styling
  - [x] 1.4 Add Cinematic Filter styles
    - Create `.cinematic-overlay` with film grain background image/noise
    - Add vignette effect using `box-shadow` or radial gradient
    - Update `.cinematic-filter` to include sepia/contrast adjustments
  - [x] 1.5 Add Floating Heart animation styles
    - Define `@keyframes` for floating up and fading out
    - Define `@keyframes` for heartbeat scaling
    - Create `.floating-heart` class
  - [x] 1.6 Ensure CSS tests pass
    - Run the 2-8 focused tests from 1.1

**Acceptance Criteria:**

- All new CSS classes (`.polaroid-frame`, `.cinematic-overlay`, `.floating-heart`) are defined.
- Keyframe animations for Ken Burns and Hearts work as expected.
- Cinematic filter visual effects are implemented.

### Frontend Logic

#### Task Group 2: VictorySlideshow Component Updates

**Dependencies:** Task Group 1

- [x] 2.0 Update `VictorySlideshow.js` logic
  - [x] 2.1 Write 2-8 focused tests for `VictorySlideshow` logic
    - Test `createOverlay` structure (ensure new elements are added)
    - Test `showPhoto` updates both background and foreground
    - Test heart spawning logic (manual tap and auto-spawn)
  - [x] 2.2 Update DOM structure in `createOverlay`
    - Add background container for the blurred image
    - Add foreground container for the Polaroid frame
    - Add cinematic overlay container
    - Add container for hearts
  - [x] 2.3 Implement dual-image update in `showPhoto`
    - Update background image source (blurred, cover)
    - Update foreground image source (contain, polaroid)
    - Apply random Ken Burns class to the foreground image
  - [x] 2.4 Implement Cinematic Mode toggle
    - Read `cinematicMode` from config (or default to true)
    - Conditionally apply the cinematic overlay
  - [x] 2.5 Implement Heart System
    - Add `spawnHeart(x, y)` method
    - Add click listener to overlay to trigger `spawnHeart`
    - Add interval for auto-spawning hearts
  - [x] 2.6 Ensure `VictorySlideshow` tests pass
    - Run the 2-8 focused tests from 2.1

**Acceptance Criteria:**

- Slideshow renders with blurred background and Polaroid foreground.
- Photos transition smoothly with Ken Burns effect.
- Tapping spawns hearts; hearts also spawn automatically.
- Cinematic overlay is visible.

### Configuration & Polish

#### Task Group 3: Config and Audio

**Dependencies:** Task Group 2

- [x] 3.0 Final Polish and Configuration
  - [x] 3.1 Write 2-8 focused tests for config integration
    - Verify `gameData.json` is read correctly for `victoryMusic`
    - Verify `cinematicMode` toggle works
  - [x] 3.2 Update `gameData.json` (if needed)
    - Ensure `victoryMusic` paths are correct
    - Add `cinematicMode: true` global setting (optional)
  - [x] 3.3 Verify Audio Integration
    - Ensure music plays on start
    - Ensure music stops on exit
  - [x] 3.4 Manual Polish Check (Run the game)
    - Verify z-indexing (Hearts > UI > Overlay > Photo > Background)
    - Tune animation timings (Ken Burns speed, transition duration)
  - [x] 3.5 Ensure config tests pass
    - Run the 2-8 focused tests from 3.1

**Acceptance Criteria:**

- Music plays correctly.
- Visuals are polished and layered correctly.
- No regression in existing slideshow functionality.

## Execution Order

Recommended implementation sequence:

1. CSS & Styles (Task Group 1)
2. Frontend Logic (Task Group 2)
3. Configuration & Polish (Task Group 3)
