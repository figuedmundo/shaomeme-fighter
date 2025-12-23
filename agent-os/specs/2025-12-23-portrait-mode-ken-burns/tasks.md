# Task Breakdown: Portrait Mode Ken Burns

## Overview

Total Tasks: 2

## Task List

### Frontend Components

#### Task Group 1: Slideshow Animation Logic

**Dependencies:** None

- [x] 1.0 Implement Portrait Mode Logic in VictorySlideshow
  - [x] 1.1 Write 2-4 focused tests for aspect ratio logic
    - Test image load handling and dimension detection logic
    - Test calculation of duration based on aspect ratio
    - Reuse existing test setup in `VictorySlideshowConfig.test.js` or `VictorySlideshowLogic.test.js`
  - [x] 1.2 Update `src/components/VictorySlideshow.js`
    - Add logic to wait for image load to get natural dimensions
    - Implement `isPortrait` check (Height > Width)
    - Calculate dynamic duration for portrait photos (e.g., `BaseTime * (Height/Width)`)
    - Update `showPhoto` to apply different logic based on orientation
    - Override the default `setInterval` timer for portrait photos to match the animation duration
  - [x] 1.3 Update `src/styles/victory.css`
    - Add `.ken-burns-portrait` class
    - Add CSS variables support for dynamic duration and translation distance
    - Define `@keyframes` or transition logic for top-to-bottom pan
  - [x] 1.4 Ensure frontend tests pass
    - Run ONLY the new tests from 1.1

**Acceptance Criteria:**

- Portrait photos pan from top to bottom
- Landscape photos use existing random zoom
- Duration is longer for taller photos
- Transitions occur immediately after pan finishes

### Testing

#### Task Group 2: Verification

**Dependencies:** Task Group 1

- [x] 2.0 Verify Feature Integration
  - [x] 2.1 Review existing tests for `VictorySlideshow`
    - Ensure no regressions in existing Ken Burns logic
  - [x] 2.2 Add integration test for mixed slideshow
    - Simulate a sequence of Portrait -> Landscape -> Portrait
    - Verify timing/duration changes between slides
  - [x] 2.3 Run all related tests
    - Run `VictorySlideshow.test.js` (and related split files)

**Acceptance Criteria:**

- All slideshow tests pass
- Manual verification confirms smooth transitions and correct behavior
