# Task Breakdown: Debug Slideshow Exit Delay

## Overview

Total Tasks: 6

## Task List

### Optimization Logic

#### Task Group 1: Async Interruption Logic

**Dependencies:** None

- [x] 1.0 Implement Abortable Async Sequence
  - [x] 1.1 Write 2-3 focused tests for abortable sequence
  - [x] 1.2 Refactor `VictorySlideshow.playSequence`
  - [x] 1.3 Ensure interruption tests pass

**Acceptance Criteria:**

- The 5-second timer is immediately cancelled/bypassed when exit is called.
- The slideshow loop terminates instantly.

### UI & Transitions

#### Task Group 2: Graceful Fade-Out

**Dependencies:** Task Group 1

- [x] 2.0 Implement Fade-Out & Music Sync
  - [x] 2.1 Write 2-3 focused tests for exit transition
  - [x] 2.2 Update `VictorySlideshow` CSS
  - [x] 2.3 Refactor `VictorySlideshow.exit`
  - [x] 2.4 Ensure transition tests pass

**Acceptance Criteria:**

- Clicking exit triggers a smooth fade-to-black.
- Music fades out in sync with the screen.
- Exit button remains visible/highlighted during the fade.

## Execution Order

Recommended implementation sequence:

1. Optimization Logic (Task Group 1)
2. UI & Transitions (Task Group 2)
