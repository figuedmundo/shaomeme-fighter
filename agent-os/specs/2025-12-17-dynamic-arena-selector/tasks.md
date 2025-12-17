# Task Breakdown: Dynamic Arena Selector

## Overview
Total Tasks: 2 Groups (Frontend & Integration)

## Task List

### Frontend Components

#### Task Group 1: Arena Select Scene & UI
**Dependencies:** None

- [x] 1.0 Implement Arena Select Scene and UI
  - [x] 1.1 Write 2-4 focused tests for `ArenaSelectScene` logic
    - Test scene initialization and registry
    - Test fetching data mock (mocking `fetch` or API calls)
    - Test selecting an arena updates state
  - [x] 1.2 Create `src/scenes/ArenaSelectScene.js` skeleton
    - Register in `src/index.js` (or `gameConfig.js`)
    - Implement basic `preload`, `create`, `update` methods
    - Add "Loading..." text/spinner state
  - [x] 1.3 Implement Data Fetching
    - Fetch `/api/cities` in `create` (or `init`)
    - For each city, fetch `/api/photos?city=[name]` to get preview image URL
    - Store data in scene state: `this.arenas = [{ name: 'Paris', url: '...' }, ...]`
  - [x] 1.4 Implement UI Layout (Hero & Grid)
    - Create "Hero Background" image (full screen, changes on selection)
    - Create bottom "Thumbnail Grid" (Phaser Images or DOM Elements)
    - Add "City Name" title text (Large, centered, modern font)
    - Add "Back" button to return to Main Menu
  - [x] 1.5 Implement Interaction Logic
    - Click thumbnail -> Update Hero Background & Title
    - Add visual feedback for selection (Gold border/Highlight)
    - Implement "FIGHT" button (or double-click) to confirm
  - [x] 1.6 Apply Visual Polish
    - Add dark gradient/overlay behind grid for readability
    - Use modern fonts (not pixel art)
    - Ensure responsive layout (scales with screen)
  - [x] 1.7 Ensure Arena Select Scene tests pass
    - Run ONLY the 2-4 tests written in 1.1
    - Verify data loading and state updates work via tests
    - Manually verify UI rendering in browser

**Acceptance Criteria:**
- Scene loads and fetches real data from API
- User can see list of cities as thumbnails
- Selecting a thumbnail updates the background preview and title
- UI matches "Modern Arcade" aesthetic (High Def, dark theme, gold accents)

### Integration

#### Task Group 2: Navigation & Fight Scene Integration
**Dependencies:** Task Group 1

- [x] 2.0 Connect Scenes and Pass Data
  - [x] 2.1 Write 2-4 focused tests for Scene Transitions
    - Test `MainMenuScene` transitions to `ArenaSelectScene`
    - Test `ArenaSelectScene` transitions to `FightScene` with correct data
    - Test `FightScene` accepts and uses `data` payload
  - [x] 2.2 Update `MainMenuScene`
    - Change "Start Game" button target to `ArenaSelectScene`
  - [x] 2.3 Update `FightScene` to accept dynamic background
    - Modify `init(data)` to receive `{ city, backgroundUrl }`
    - In `preload` (or `create`), load the specific `backgroundUrl` if provided
    - Fallback to default `resources/main-bg.jpg` if no data (safety check)
  - [x] 2.4 Handle Asset Loading in FightScene
    - Since background URL is dynamic, use `this.load.image()` inside `init` or `preload`? 
    - *Note:* Phaser 3 `preload` is usually static. For dynamic assets passed via `data`, we might need to use `this.load.image()` with a `once('complete')` listener or `this.load.start()` if called outside preload, OR just pass the *already loaded* texture key if `ArenaSelectScene` keeps the texture loaded.
    - *Decision:* `ArenaSelectScene` loads the images for preview. If we use the *same* URL, the browser cache helps. In `FightScene`, we can use `this.load.image('dynamic-bg', data.backgroundUrl)` in `preload`.
  - [x] 2.5 Ensure Integration tests pass
    - Run ONLY the 2-4 tests written in 2.1
    - Verify full flow: Main Menu -> Arena Select -> Fight (with correct BG) -> Victory/Defeat
    - Manually play a round to ensure background renders correctly

**Acceptance Criteria:**
- "Start Game" leads to Arena Select
- Selected Arena background appears in Fight Scene
- Fallback works if direct booting FightScene (e.g. via URL or dev tools)

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [x] 3.0 Review and Fill Gaps
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review tests from 1.1 (Scene Logic)
    - Review tests from 2.1 (Transitions & Data Passing)
  - [x] 3.2 Analyze coverage gaps
    - Focus on API failure cases (what if `/api/cities` fails?)
    - Focus on empty data cases (no photos for a city)
  - [x] 3.3 Write up to 4 additional strategic tests
    - Integration: Full flow from Main Menu to Fight Scene load
    - Edge Case: API returns empty list -> Show "No Arenas" message?
  - [x] 3.4 Run feature-specific tests
    - Run all tests from 1.1, 2.1, and 3.3

**Acceptance Criteria:**
- Full flow verified automated and manually
- Error states handled gracefully

## Execution Order

Recommended implementation sequence:
1. Frontend Components (Task Group 1)
2. Integration (Task Group 2)
3. Testing (Task Group 3)
