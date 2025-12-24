# Task Breakdown: Signature Victory Portrait

## Overview

Total Tasks: 3 Task Groups

## Task List

### Asset & Config Layer

#### Task Group 1: Config & Asset Setup

**Dependencies:** None

- [x] 1.0 Setup character victory config
  - [x] 1.1 Update `src/config/gameData.json`
    - Add `victoryPath` to each character in the `roster` array.
    - Example: `"victoryPath": "/assets/fighters/ann/victory.png"`
  - [x] 1.2 Create placeholder victory assets
    - Create a simple transparent PNG or copy `fullBody.png` to `victory.png` for each character folder in `public/assets/fighters/`.
    - Characters: ann, brother, dad, fat, fresway_worker, mom.
  - [x] 1.3 Write 2-4 focused tests for `ConfigManager`
    - Verify that `ConfigManager.getCharacter(id)` now includes the `victoryPath` property.
  - [x] 1.4 Ensure config tests pass
    - Run ONLY the 2-4 tests written in 1.3

**Acceptance Criteria:**

- `gameData.json` contains `victoryPath` for all characters.
- Placeholder files exist in the correct directories.
- `ConfigManager` correctly returns the new path.

### Asset Pipeline Layer

#### Task Group 2: Asset Loading

**Dependencies:** Task Group 1

- [x] 2.0 Implement JIT loading for victory portraits
  - [x] 2.1 Write 2-4 focused tests for `LoadingScene`
    - Test that `victoryPath` is queued for loading alongside the character spritesheet.
  - [x] 2.2 Update `src/scenes/LoadingScene.js`
    - In `startLoading`, fetch the `victoryPath` from `ConfigManager` for P1 and P2.
    - Queue the image load using a key like `victory_{charId}`.
  - [x] 2.3 Ensure loading tests pass
    - Run ONLY the 2-4 tests written in 2.1

**Acceptance Criteria:**

- `LoadingScene` successfully loads the `victory.png` assets.
- Texture keys `victory_{charId}` are available in the texture manager after loading.

### Frontend Implementation Layer

#### Task Group 3: UI Implementation & Animation

**Dependencies:** Task Group 2

- [x] 3.0 Implement Signature Victory UI
  - [x] 3.1 Write 4-8 focused tests for `UIManager.showVictory`
    - Verify the HUD portrait no longer scales up.
    - Verify a new image with the `victory_{charId}` key is created.
    - Verify the image depth is lower than the fighters (e.g., depth 5).
    - Verify the image is positioned on the correct side (Left for P1, Right for P2).
  - [x] 3.2 Refactor `src/systems/UIManager.js`
    - Modify `showVictory(winnerNum)`:
      - Get the winner's character ID from the config.
      - Create the `victory_{charId}` image object.
      - Set `origin` and `depth` (behind fighters).
      - Set initial position off-screen (Left edge for P1, Right edge for P2).
      - Implement the `slide-in` tween to the "Hero Side".
      - Ensure it scales to fit the screen height (~90%).
  - [x] 3.3 Ensure UI tests pass
    - Run ONLY the 4-8 tests written in 3.1

**Acceptance Criteria:**

- The win sequence displays the character's signature image.
- The image slides in smoothly from the side.
- The image sits behind the fighter sprites.
- The old HUD scaling effect is removed.

## Execution Order

1. Config & Assets (Task Group 1)
2. Asset Loading (Task Group 2)
3. UI Implementation & Animation (Task Group 3)
