# Task Breakdown: Visual Polish & Branding

## Overview
Total Tasks: 3 Groups

## Task List

### Asset Management

#### Task Group 1: Assets & Placeholders
**Dependencies:** None

- [x] 1.0 Organize and document assets
  - [x] 1.1 Write 2-8 focused tests for Asset Loading
    - Limit to 2-8 highly focused tests maximum
    - Test that `shaomeme_fighter.png` and `soundtrack.mp3` can be loaded by Phaser
    - Test that missing placeholder file paths are handled gracefully (if applicable)
  - [x] 1.2 Copy/Move Assets to `resources/`
    - Move `assets/shaomeme_fighter.png` to `resources/`
    - Move `refs/soundtrack.mp3` to `resources/`
  - [x] 1.3 Create `planning/placeholders.md`
    - Document missing UI sounds (Hover, Back)
    - Document missing MK Font
    - Document any other temporary assets
  - [x] 1.4 Ensure asset tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify assets are accessible in the `resources/` directory

**Acceptance Criteria:**
- Assets exist in `resources/`
- `placeholders.md` exists and is populated
- Tests pass confirming asset availability

### Frontend Components & Styling

#### Task Group 2: UI Branding & Filters
**Dependencies:** Task Group 1

- [x] 2.0 Apply Visual Branding
  - [x] 2.1 Write 2-8 focused tests for UI Styling
    - Limit to 2-8 highly focused tests maximum
    - Test that MainMenu scene loads the new logo image
    - Test that CSS variables for colors are set
  - [x] 2.2 Global CSS Updates (`src/styles/styles.css`)
    - Define `:root` variables for MK Palette: `--color-gold: #ffd700`, `--color-red: #880000`, `--color-black: #111111`
    - Apply `font-family: 'PressStart2P'` to global UI elements
  - [x] 2.3 Implement Main Menu Updates (`src/scenes/MainMenuScene.js`)
    - Replace text title with `shaomeme_fighter.png` image
    - Add "Created by Edmundo..." footer text
  - [x] 2.4 Apply Cinematic Filters (`src/styles/arena.css` & `victory.css`)
    - Add/Ensure `.cinematic-filter` class exists with `sepia(0.3) contrast(1.2)`
    - Apply this class to the `ArenaSelectScene` background container
  - [x] 2.5 Ensure UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify Logo is present in Main Menu
    - Verify CSS variables are active

**Acceptance Criteria:**
- Main Menu displays the correct PNG logo
- UI Text uses `PressStart2P`
- Global color palette is defined in CSS
- Arena Select background has cinematic filters

### Audio Polish

#### Task Group 3: Audio Integration
**Dependencies:** Task Group 1 & 2

- [x] 3.0 Implement Audio Feedback
  - [x] 3.1 Write 2-8 focused tests for Audio Logic
    - Limit to 2-8 highly focused tests maximum
    - Test that a specific sound key triggers when a mock button is clicked
    - Test that `VictorySlideshow` plays the correct soundtrack key
  - [x] 3.2 Implement UI Sound Helper
    - Create a simple helper or add logic to `MainMenuScene`/`ArenaSelectScene` to play `attack1` (as placeholder) on button clicks
  - [x] 3.3 Update Victory Slideshow Audio
    - Modify `src/components/VictorySlideshow.js` to play `soundtrack` instead of fallback
  - [x] 3.4 Ensure audio tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify sound trigger logic

**Acceptance Criteria:**
- Clicking UI buttons triggers a sound
- Victory Slideshow plays the custom soundtrack

## Execution Order

Recommended implementation sequence:
1. Asset Management (Task Group 1)
2. Frontend Components & Styling (Task Group 2)
3. Audio Polish (Task Group 3)
