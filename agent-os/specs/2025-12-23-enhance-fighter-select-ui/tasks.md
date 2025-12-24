# Task Breakdown: Enhance Fighter Select UI

## Overview

Total Tasks: 3 Task Groups

## Task List

### Asset Preparation

#### Task Group 1: Background & Asset Setup

**Dependencies:** None

- [x] 1.0 Setup visuals
  - [x] 1.1 Copy `background.png` from `planning/visuals/` to `public/assets/images/backgrounds/select_bg.png`
    - Verify file exists and is accessible
  - [x] 1.2 Write 2-8 focused tests for Asset Loading in `CharacterSelectScene`
    - Test that the new background image key is loaded in `preload`
    - Test that the background image is added to the scene in `create`
  - [x] 1.3 Ensure asset tests pass
    - Run ONLY the tests written in 1.2

**Acceptance Criteria:**

- `background.png` is correctly placed in the project structure
- Tests verify the scene attempts to load and display the new background

### Frontend Implementation

#### Task Group 2: Scene Layout & Background

**Dependencies:** Task Group 1

- [x] 2.0 Update Scene Background & Structure
  - [x] 2.1 Write 2-8 focused tests for Layout Logic
    - Test that the background object exists and uses the correct texture
    - Test that the grid container or group is centered relative to screen dimensions
  - [x] 2.2 Implement New Background
    - In `CharacterSelectScene.js`, replace the solid color rectangle with `this.add.image(..., 'select_bg')`
    - Implement scaling logic to ensure it `covers` the screen (like CSS object-fit: cover)
    - Remove or adjust the old "Spotlight" graphics if they conflict visually
  - [x] 2.3 Ensure layout tests pass
    - Run ONLY the tests written in 2.1

**Acceptance Criteria:**

- Character Select screen shows the new cinematic background
- Background scales correctly on different aspect ratios (iPad landscape focus)
- Tests pass

#### Task Group 3: Grid & Icon Refactor

**Dependencies:** Task Group 2

- [x] 3.0 Overhaul Grid UI
  - [x] 3.1 Write 2-8 focused tests for Grid Item creation & interaction
    - Test that grid items are created with the new aspect ratio (approx 3:4)
    - Test that selecting an item triggers the visual state change (scale up)
    - Test that P1 and Opponent selections still trigger correct internal state changes
  - [x] 3.2 Refactor `buildGrid()` for Rectangular Slots
    - Change slot dimensions to ~80x105 (relative to screen size)
    - Update `fitInArea` usage to respect the new 3:4 container
    - Adjust grid spacing/gap (approx 6px)
  - [x] 3.3 Implement Metallic Borders (Phaser Graphics)
    - Create a helper method `drawMetallicBorder(x, y, w, h, isSelected)`
    - Draw Outer Border: Dark Bronze (`0x5c4d3c`, 2px)
    - Draw Inner Border: Bright Gold (`0xa88d57`, 1px)
    - Add "Glow" support for selected state (`0xffdb76`)
  - [x] 3.4 Update Selection Visuals
    - Implement "Scale Up" tween on selection (1.05x)
    - Apply P1 (Red) and AI (Blue) highlight tints/glows to the new border structure
    - Ensure unselected items are slightly dimmed (alpha 0.9)
  - [x] 3.5 Ensure grid tests pass
    - Run ONLY the tests written in 3.1

**Acceptance Criteria:**

- Grid uses vertical rectangular slots (Mortal Kombat 11 style)
- Slots have metallic borders matching the mockup
- Selection scales the slot and applies the correct glow/color
- Touch interaction works accurately with the new slot shapes

### Testing

#### Task Group 4: Test Review & Gap Analysis

**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review tests from 1.2 (Assets)
    - Review tests from 2.1 (Layout)
    - Review tests from 3.1 (Grid/Interaction)
  - [x] 4.2 Analyze test coverage gaps for THIS feature only
    - Focus on the visual state transitions (selected vs unselected)
    - Focus on the "End to End" flow of selecting a character and seeing the visual confirmation
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Verify that the "Opponent Roll" visual logic still works with the new portraits/grid (if applicable)
    - Verify responsiveness on a mock iPad resolution
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to Character Select (approx 10-20 tests total)
    - Do NOT run the entire application test suite

**Acceptance Criteria:**

- All Character Select related tests pass
- New visual logic is covered by tests
- No regressions in the selection flow (e.g., sound triggers, data handoff)

## Execution Order

1. Asset Preparation (Task Group 1)
2. Frontend Implementation (Task Group 2 & 3)
3. Testing (Task Group 4)
