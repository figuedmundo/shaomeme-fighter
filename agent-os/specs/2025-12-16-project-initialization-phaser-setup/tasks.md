# Task Breakdown: Project Initialization & Phaser Setup

## Overview
Total Tasks: 5 Groups, 18 Tasks

## Task List

### Project Setup & Cleanup

#### Task Group 1: Project Preparation
**Dependencies:** None

- [x] 1.0 Prepare project structure
  - [x] 1.1 Remove old game logic
    - Remove `src/javascript/` folder entirely.
    - Remove `src/components/`, `src/services/`, `src/helpers/` if present outside `javascript`.
    - Keep `temp_clone/` for reference.
  - [x] 1.2 Install Phaser 3
    - Run `npm install phaser` (save as dependency).
    - Ensure `package.json` reflects the change.
  - [x] 1.3 Update `vite.config.js`
    - Ensure it handles static asset copying correctly (if needed).
    - Verify output directory is set to `dist`.
  - [x] 1.4 Update `index.html`
    - Add `<div id="game-container"></div>` to the body.
    - Ensure the script entry point points to `src/index.js`.
    - Retain `loading-overlay` div but ensure it can be controlled via CSS/JS.

**Acceptance Criteria:**
- `node_modules` contains `phaser`.
- `src/javascript` is gone.
- `index.html` has the target game container.
- `npm run dev` starts without errors (though it may be blank).

### Game Engine Integration

#### Task Group 2: Phaser Core Setup
**Dependencies:** Task Group 1

- [x] 2.0 Initialize Phaser Engine
  - [x] 2.1 Create `src/index.js` entry point
    - Import Phaser.
    - Create `const config` with:
      - `type: Phaser.AUTO`
      - `width: 1024`, `height: 768`
      - `parent: 'game-container'`
      - `scale`: mode `FIT`, autoCenter `CENTER_BOTH`.
    - Initialize `new Phaser.Game(config)`.
  - [x] 2.2 Verify Phaser loads
    - Run `npm run dev` and check browser console for Phaser version banner.
    - Check that the canvas is rendered in `#game-container`.

**Acceptance Criteria:**
- Black canvas appears in the browser.
- Canvas resizes responsively when window changes (due to `FIT` mode).
- No console errors.

### Scene Implementation

#### Task Group 3: Scene Architecture
**Dependencies:** Task Group 2

- [x] 3.0 Implement Basic Scenes
  - [x] 3.1 Create `src/scenes/BootScene.js`
    - Class `BootScene` extends `Phaser.Scene`.
    - Key: `'BootScene'`.
    - `preload()`: Load minimal assets if needed.
    - `create()`: Transition to `PreloadScene`.
  - [x] 3.2 Create `src/scenes/PreloadScene.js`
    - Class `PreloadScene` extends `Phaser.Scene`.
    - Key: `'PreloadScene'`.
    - `preload()`: Load `assets/logo.png`.
    - `create()`: Add logo to center screen, then transition to `MainMenuScene`.
  - [x] 3.3 Create `src/scenes/MainMenuScene.js`
    - Class `MainMenuScene` extends `Phaser.Scene`.
    - Key: `'MainMenuScene'`.
    - `create()`: Display text "Start Game" (interactive).
    - On click: Transition to `FightScene`.
  - [x] 3.4 Create `src/scenes/FightScene.js`
    - Class `FightScene` extends `Phaser.Scene`.
    - Key: `'FightScene'`.
    - `create()`: Set background color (e.g., dark blue) and add text "FIGHT!".
  - [x] 3.5 Register Scenes in `src/index.js`
    - Import all scenes.
    - Add them to the `scene` array in `config` in order: `[BootScene, PreloadScene, MainMenuScene, FightScene]`.

**Acceptance Criteria:**
- Application boots up.
- Shows logo (Preload).
- Shows "Start Game" (Main Menu).
- Clicking "Start Game" shows "FIGHT!" screen.

### Backend & Deployment

#### Task Group 4: Server Configuration
**Dependencies:** Task Group 3

- [x] 4.0 Configure Backend for Production
  - [x] 4.1 Update `server/index.js`
    - Add check for `process.env.NODE_ENV === 'production'`.
    - If production: Serve static files from `../dist`.
    - Ensure catch-all route (`*`) sends `../dist/index.html` (for SPA routing support, if needed, though mostly single page).
  - [x] 4.2 Verify Build Process
    - Run `npm run build`.
    - Check `dist/` folder content (should have `index.html` and assets).
  - [x] 4.3 Test Production Serve
    - Run `npm run server` (or equivalent command to start `server/index.js` with prod env).
    - Access `http://localhost:3000` (or configured port) and verify the game loads.

**Acceptance Criteria:**
- `npm run build` creates valid assets.
- `node server/index.js` serves the game correctly in a browser.

### Verification

#### Task Group 5: Final Check
**Dependencies:** Task Group 4

- [x] 5.0 Final System Check
  - [x] 5.1 Manual Playtest
    - Open on Desktop: check resizing.
    - Open on Mobile (via network IP): check "FIT" scaling works on phone screen.
  - [x] 5.2 Linting Check
    - Run `npm run lint` to ensure new code meets Airbnb standards.
    - Fix any linting errors in new Scene files.

**Acceptance Criteria:**
- Game flows from Boot -> Fight on both Desktop and Mobile.
- Codebase is clean and lint-free.

## Execution Order

1. Project Preparation (Group 1)
2. Phaser Core Setup (Group 2)
3. Scene Architecture (Group 3)
4. Server Configuration (Group 4)
5. Final Check (Group 5)
