# Task Breakdown: Victory Slideshow Reward

## Overview
Total Tasks: 3 Groups

## Task List

### Backend & Logic Layer

#### Task Group 1: Data Integration & Game Logic
**Dependencies:** None

- [x] 1.0 Complete data and logic layer
  - [x] 1.1 Write 2-8 focused tests for API and Game Logic
    - Limit to 2-8 highly focused tests maximum
    - Test `/api/photos` response for existing/missing cities
    - Test `showVictorySlideshow()` state transition logic in `FightScene`
  - [x] 1.2 Verify/Update `/api/photos` Endpoint
    - Ensure it correctly accepts `city` parameter
    - Verify it returns correct JSON structure: `[{ url: "...", type: "..." }]`
    - Ensure it returns empty array/fallback if no photos found
  - [x] 1.3 Implement `showVictorySlideshow()` in `FightScene`
    - Create method to pause physics/input
    - Implement trigger logic (called after victory animation)
    - Add logic to fetch photos via `fetch('/api/photos?city=...')`
    - Handle success (pass data to UI) and error/empty (pass fallback data) states
  - [x] 1.4 Implement Audio Logic
    - Stop current BGM on victory
    - Play `KO.mp3` immediately
    - Implement logic to check for location specific music (or fallback to `arena.mp3`)
  - [x] 1.5 Ensure backend/logic tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify API returns expected data
    - Verify `showVictorySlideshow` properly pauses game and fetches data

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- `/api/photos` returns correct image list for a given city
- `FightScene` correctly pauses and triggers the fetch sequence upon victory
- Correct audio sequence plays (Stop BGM -> Play KO -> Play Slideshow BGM)

### Frontend & UI Layer

#### Task Group 2: Slideshow UI & Overlay
**Dependencies:** Task Group 1

- [x] 2.0 Complete UI components
  - [x] 2.1 Write 2-8 focused tests for UI overlay
    - Limit to 2-8 highly focused tests maximum
    - Test overlay creation/removal from DOM
    - Test image cycling logic (timer)
    - Test "Exit" button click handler
  - [x] 2.2 Create `VictorySlideshow` Class/Component
    - Create `src/components/VictorySlideshow.js` (or similar helper)
    - Implement `createOverlay(photos)` method using standard DOM API
    - structure: `div.victory-overlay` > `div.image-container` > `img` + `div.smoke-border`
  - [x] 2.3 Implement CSS Styling (`src/styles/victory.css`)
    - `.victory-overlay`: Fixed, full-screen, z-index 200, black background
    - `.smoke-border`: Absolute position, `pointer-events: none`, use `smoke.png`
    - `.cinematic-filter`: Apply `sepia`, `contrast`, `vignette` to images
    - Animations: CSS transitions for opacity (fade in/out)
  - [x] 2.4 Implement Slideshow Logic
    - Auto-advance timer (3-4s interval)
    - Loop logic (index 0 -> max -> 0)
    - Image preloading (optional, but good for smooth playback)
  - [x] 2.5 Implement Navigation/Exit
    - Add "EXIT" button (z-index high)
    - On click: Remove overlay, Resume/Cleanup scene, `this.scene.start('ArenaSelectScene')`
  - [x] 2.6 Ensure UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify overlay appears/disappears correctly
    - Verify images cycle
    - Verify exit button triggers navigation

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Slideshow renders with "Smoke" border and cinematic filters
- Images auto-advance smoothly
- Exit button works and navigates to `ArenaSelectScene`

### Testing

#### Task Group 3: Integration & Gap Analysis
**Dependencies:** Task Groups 1-2

- [x] 3.0 Review existing tests and fill critical gaps only
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests written by backend-engineer (Task 1.1)
    - Review the 2-8 tests written by frontend-engineer (Task 2.1)
  - [x] 3.2 Analyze test coverage gaps for THIS feature only
    - Focus on the end-to-end flow: Win Fight -> API Call -> Overlay -> Exit -> Arena Select
    - Check edge cases: No photos returned, Network failure
  - [x] 3.3 Write up to 10 additional strategic tests maximum
    - Add integration test: Mock API response and verify Overlay appears
    - Add state test: Verify Game Scene shuts down/transitions correctly after Exit
  - [x] 3.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature
    - Do NOT run the entire application test suite

**Acceptance Criteria:**
- All feature-specific tests pass
- Critical path (Win -> Slideshow -> Exit) is verified
- Graceful handling of missing photos/errors is verified

## Execution Order

Recommended implementation sequence:
1. Backend & Logic Layer (Task Group 1)
2. Frontend & UI Layer (Task Group 2)
3. Testing (Task Group 3)
