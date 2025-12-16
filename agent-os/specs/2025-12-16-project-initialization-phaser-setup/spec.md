# Specification: Project Initialization & Phaser Setup

## Goal
Initialize the Phaser 3 game engine within the existing project structure, replacing the custom JavaScript engine while maintaining the Vite build pipeline and Node.js backend for serving the application.

## User Stories
- As a developer, I want a clean Phaser 3 project structure so that I can build the game using a robust engine with mobile support.
- As a developer, I want the application to build successfully with Vite so that I can deploy it to production.
- As a player, I want to see the game load, display a main menu, and enter a fight scene to verify the game loop is running.

## Specific Requirements

**Phaser 3 Integration**
- Install `phaser` (v3.x) via npm.
- Initialize the Phaser `Game` instance in `src/index.js`, targeting a `#game-container` div.
- Configure Phaser with `type: Phaser.AUTO`, `width: 1024`, `height: 768`.
- Set scaling mode to `Phaser.Scale.FIT` with `autoCenter: Phaser.Scale.CENTER_BOTH` for mobile responsiveness.

**Scene Architecture**
- Create `src/scenes/BootScene.js` for initial configuration (e.g., input settings).
- Create `src/scenes/PreloadScene.js` to load the game logo (`assets/logo.png`) and basic assets.
- Create `src/scenes/MainMenuScene.js` with a simple "Start Game" text interaction to transition to the fight.
- Create `src/scenes/FightScene.js` as a placeholder with a background color or text to confirm the transition works.

**Vite Configuration**
- Ensure `vite.config.js` correctly bundles the Phaser application for production (`npm run build`).
- Verify the build output is generated in the `dist/` directory.

**Backend Configuration**
- Update `server/index.js` to serve static files from `dist/` in production mode.
- Ensure the server runs on a configurable port (default 3000) and serves `index.html` for the root route.

**Cleanup**
- Remove the old custom game engine logic from `src/javascript/` (e.g., `app.js`, `components/`, `services/`, `helpers/`) to prevent confusion.
- Keep `temp_clone/` untouched for future reference of game data.

## Visual Design

*No new visual mockups provided. Relying on basic placeholder UI.*

## Existing Code to Leverage

**`assets/logo.png`**
- Re-use the existing logo for the `PreloadScene` and `MainMenuScene`.

**`server/index.js`**
- Adapt the existing Express server setup to serve the new `dist/` folder instead of the old structure.

**`temp_clone/`**
- Strictly for reference only (damage values, config). Do not import code from here.

## Out of Scope
- Porting collision detection, physics, or hitboxes (Core Combat System).
- Implementing touch controls or "Invisible Combat Zones".
- Detailed character selection or roster logic.
- The `photos/` API endpoint implementation (placeholder only).
