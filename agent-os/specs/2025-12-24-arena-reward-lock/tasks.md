# Task Breakdown: Arena Reward Lock

## Overview

Total Tasks: 3 Groups

## Task List

### Backend Layer

#### Task Group 1: API Enhancements

**Dependencies:** None

- [x] 1.0 Update `/api/cities` endpoint
  - [x] 1.1 Write 2-8 focused tests for `/api/cities`
    - Test that the endpoint returns an array of objects `{ name: string, photoCount: number }`
    - Test that `photoCount` accurately reflects the number of valid image files (`.jpg`, `.png`, etc.)
    - Test that `photoCount` **excludes** `background.png`, `arena.png`, and system files
    - Test that a folder with only `background.png` returns `photoCount: 0`
  - [x] 1.2 Update `server/index.js` logic
    - Modify `GET /api/cities` to iterate through directories
    - Implement file counting logic with the specified exclusions
    - Maintain existing error handling
  - [x] 1.3 Ensure Backend tests pass
    - Run ONLY the tests written in 1.1

**Acceptance Criteria:**

- `/api/cities` returns `[{ name: "paris", photoCount: 0 }, { name: "tokyo", photoCount: 5 }]` format
- System files and background images are not counted towards `photoCount`
- Tests pass successfully

### Frontend Layer

#### Task Group 2: Arena Select Logic & UI

**Dependencies:** Task Group 1

- [x] 2.0 Implement Lock & "Coming Soon" UI in `ArenaSelectScene`
  - [x] 2.1 Write 2-8 focused tests for `ArenaSelectScene` logic
    - Mock `/api/cities` response with a mix of locked (0 photos) and unlocked (>0 photos) arenas
    - Test that `fightBtn` is visible ONLY when an unlocked arena is selected
    - Test that `fightBtn` is hidden/disabled when a locked arena is selected
    - Test that the "Coming Soon" stamp container exists for locked arenas
  - [x] 2.2 Update `fetchArenas` method
    - Adapt to the new API response structure (`{ name, photoCount }`)
    - Store `photoCount` in `this.arenas` data
  - [x] 2.3 Implement Visual Lock (Grayscale & Stamp)
    - In `buildGrid()`:
      - Add conditional grayscale tint/pipeline to thumbnails if `photoCount === 0`
      - Create a `Phaser.GameObjects.Container` for the "Coming Soon" stamp
      - Add text ("COMING SOON...") and red border graphics to the container
      - Position and rotate the stamp over the thumbnail
  - [x] 2.4 Implement Interaction Locking
    - Update `selectArena(index)` to check `this.arenas[index].photoCount`
    - Logic to show/hide (or enable/disable) `this.fightBtn` based on the check
    - Ensure tapping a locked thumbnail doesn't trigger selection confirmation
  - [x] 2.5 Ensure Frontend tests pass
    - Run ONLY the tests written in 2.1

**Acceptance Criteria:**

- Arenas with 0 reward photos appear grayed out with a red "COMING SOON..." stamp
- "FIGHT >" button is hidden or disabled when a locked arena is selected
- Users can still view the arena background/thumbnail but cannot start the fight
- Visual style matches the "Restricted Document" aesthetic (Red, Stamped, Angled)

### Testing

#### Task Group 3: Final Verification

**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review and Gap Analysis
  - [ ] 3.1 Review tests from Task Groups 1 & 2
  - [ ] 3.2 Add up to 2 integration tests if needed
    - E.g., Verify the flow from "Backend reports 0 photos" -> "Frontend shows lock" in a broader integration context if mocking was too isolated
  - [ ] 3.3 Run feature-specific tests
    - Run all tests from 1.1, 2.1, and 3.2

**Acceptance Criteria:**

- All feature-related tests pass
- No regressions in basic arena selection for unlocked arenas
