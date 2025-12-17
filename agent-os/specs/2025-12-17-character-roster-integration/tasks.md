# Task Breakdown: Character Roster Integration

## Overview
Total Tasks: 3 Groups (Config & Assets, Scene Implementation, Integration)

## Task List

### Config & Assets

#### Task Group 1: Roster Configuration & Asset Prep
**Dependencies:** None

- [x] 1.0 Setup Roster and Assets
  - [x] 1.1 Write 2-4 focused tests for `rosterConfig` validation
    - Test that config is an array of objects
    - Test that each object has required fields (`id`, `displayName`, paths)
  - [x] 1.2 Create `src/config/rosterConfig.js`
    - Define the 7 characters: `ann`, `mom`, `dad`, `brother`, `old_witch`, `fat`, `fresway_worker`
    - Set default paths: `assets/fighters/[id]/portrait.png`, `assets/fighters/[id]/icon.png`
  - [x] 1.3 Create asset directory structure
    - Create `assets/fighters/[id]/` folders for all 7 characters
    - Place default/placeholder images (use simple colored rects or standard silhouettes if real assets missing) to avoid 404s during dev
  - [x] 1.4 Ensure Config tests pass
    - Run ONLY the tests from 1.1

**Acceptance Criteria:**
- `rosterConfig.js` exists and exports valid data
- Directory structure exists
- Tests pass

### Scene Implementation

#### Task Group 2: Character Select Scene
**Dependencies:** Task Group 1

- [x] 2.0 Implement Character Select Scene
  - [x] 2.1 Write 2-4 focused tests for `CharacterSelectScene` logic
    - Test scene initialization
    - Test loading assets from config
    - Test selection logic updates state (selected character ID)
  - [x] 2.2 Create `src/scenes/CharacterSelectScene.js` skeleton
    - Register in `src/index.js` and `src/config/gameConfig.js`
    - Implement `preload` to load assets from `rosterConfig`
  - [x] 2.3 Implement UI Layout (MK11 Style)
    - Create "Left Portrait" (Player 1) - defaults to first character or "Select" state
    - Create "Right Portrait" (Opponent) - defaults to Silhouette/Shadow
    - Create "Central Grid" of icons based on roster
    - Add "Character Name" text
  - [x] 2.4 Implement Interaction Logic
    - Click/Tap grid icon -> Update Left Portrait & Name
    - Double-Click (or "Select" button) -> Confirm Selection
    - Update state: `this.selectedCharacterId`
  - [x] 2.5 Ensure Scene tests pass
    - Run ONLY tests from 2.1
    - Manually verify UI layout and interaction in browser

**Acceptance Criteria:**
- Scene renders with grid and portraits
- Clicking icons updates the display
- Assets load correctly (or fallback gracefully)

### Integration

#### Task Group 3: Navigation & Data Passing
**Dependencies:** Task Group 2

- [x] 3.0 Connect Scenes
  - [x] 3.1 Write 2-4 focused tests for Navigation flow
    - Test `MainMenu` -> `CharacterSelect`
    - Test `CharacterSelect` -> `ArenaSelect` with payload `{ playerCharacter: id }`
    - Test `ArenaSelect` passes `playerCharacter` through to `FightScene`
  - [x] 3.2 Update `MainMenuScene`
    - Change target: `scene.start('CharacterSelectScene')`
  - [x] 3.3 Update `ArenaSelectScene` to receive and pass data
    - Update `init(data)` to store `playerCharacter`
    - Update `confirmSelection()` to include `playerCharacter` in payload to `FightScene`
  - [x] 3.4 Update `FightScene` (Minimal)
    - Update `init(data)` to log/store `playerCharacter` (Logic to *use* it is separate, but data must arrive)
  - [x] 3.5 Ensure Integration tests pass
    - Run ONLY tests from 3.1
    - Verify full flow manually: Main -> Char Select -> Arena Select -> Fight

**Acceptance Criteria:**
- Full navigation flow works
- `FightScene` receives the selected character ID

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review and Fill Gaps
  - [x] 4.1 Review tests from Task Groups 1-3
  - [x] 4.2 Analyze coverage gaps (Focus on asset loading failures)
  - [x] 4.3 Write up to 4 additional strategic tests
    - Test fallback if image load fails
    - Test boundary cases (selecting invalid index)
  - [x] 4.4 Run feature-specific tests
    - Run all tests from 1.1, 2.1, 3.1, 4.3

**Acceptance Criteria:**
- All tests pass
- Robust against missing assets

## Execution Order

Recommended implementation sequence:
1. Config & Assets (Task Group 1)
2. Scene Implementation (Task Group 2)
3. Integration (Task Group 3)
4. Testing (Task Group 4)
