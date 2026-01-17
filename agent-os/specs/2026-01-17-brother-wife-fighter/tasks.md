# Task Breakdown: Brother-Wife Fighter

## Overview

Total Tasks: 2

## Task List

### Configuration & Implementation

#### Task Group 1: Roster Configuration

**Dependencies:** None

- [x] 1.0 Add "brother-wife" to game roster
  - [x] 1.1 Verify asset integrity
    - Check `sprite.png` dimensions (should be compatible with 32 frames)
    - Check `portrait.png`, `fullBody.png`, `victory.png` existence
  - [x] 1.2 Update `src/config/gameData.json`
    - Add new object to `roster` array
    - ID: `brother-wife`
    - DisplayName: `嫂嫂`
    - Personality: `aggressive`
    - Paths: `/assets/fighters/brother-wife/...`
  - [x] 1.3 Verify implementation
    - Run existing roster tests: `pnpm test -- tests/rosterConfig.test.js`
    - Run loading tests: `pnpm test -- tests/LoadingScene.test.js`

**Acceptance Criteria:**

- `rosterConfig.test.js` passes with new fighter included
- `LoadingScene.test.js` passes (confirming assets can be loaded)
- No regression in existing fighter loading

## Execution Order

1. Roster Configuration (Task Group 1)
