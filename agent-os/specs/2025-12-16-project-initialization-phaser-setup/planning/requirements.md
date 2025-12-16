# Spec Requirements: Project Initialization & Phaser Setup

## Initial Description
Set up Phaser 3 with Vite, create basic scene structure (Boot, MainMenu, Fight), and ensure the Node.js backend serves the app.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should completely remove the existing custom-engine game logic in `src/javascript` and replace it with a fresh Phaser 3 structure, but keep the `temp_clone` folder for reference. Is that correct?
**Answer:** Yes, proceed with a full replacement. The custom engine in `temp_clone` provides the mechanics (damage values, character data) to be ported, but the engine itself will be discarded in favor of Phaser 3 for better mobile support and physics.

**Q2:** I'm thinking we should structure the Phaser scenes as classes in `src/scenes/` (e.g., `BootScene.js`, `MainMenuScene.js`, `FightScene.js`). Should we also include a `PreloadScene.js` for asset loading, or handle that in `BootScene`?
**Answer:** Yes, include a `PreloadScene.js`. The structure should be:
- `BootScene.js`: Minimal setup (configure scaling, input).
- `PreloadScene.js`: Load global assets (logos, UI sounds).
- `MainMenuScene.js`: Simple entry point.
- `FightScene.js`: The core game loop (placeholder for now).

**Q3:** I assume the `MainMenuScene` should initially just have a simple "Start Game" text or button to verify the scene flow, before we implement the full UI later. Is that acceptable for this initial setup?
**Answer:** Yes, keep the UI minimal. A simple interactive text object or standard HTML button overlay is sufficient to prove the scene flow is working.

**Q4:** I'm thinking of setting the game resolution to a fixed aspect ratio suitable for iPad (e.g., 1024x768 or similar 4:3 ratio) since that's the primary target. Do you have a specific resolution or scaling strategy (e.g., `Phaser.Scale.FIT`) in mind?
**Answer:** Use `1024x768` as the base resolution and configure Phaser with `mode: Phaser.Scale.FIT` and `autoCenter: Phaser.Scale.CENTER_BOTH`. This ensures it looks good on the target iPad while scaling down correctly for iPhones.

**Q5:** I assume the backend server in `server/index.js` currently serves the static files. Should I update it to specifically serve the Vite build output (`dist/`) in production mode, while we continue to use `vite` for dev mode?
**Answer:** Yes. The backend `server/index.js` should be configured to serve the `dist` folder static files when running in production, and serve the `photos` API endpoint (empty placeholder for now).

**Q6:** Should we keep the existing `index.html` structure (with the loading overlay) and adapt it for Phaser (mounting the game to a `div`), or should Phaser take over the entire body?
**Answer:** Let Phaser mount to a specific `div` (e.g., `#game-container`) within the `index.html`. We can keep the existing `loading-overlay` div in `index.html` but manually hide it once the `PreloadScene` finishes, or let Phaser handle loading visuals entirely. For now, keeping the HTML structure simple and letting Phaser handle the view is best.

## Visual Assets

### Files Provided:
No visual assets provided for this initialization phase. We will use the existing logo and placeholder colors/text.

### Visual Insights:
No new visual patterns to analyze. We will rely on the existing `agent-os/product/mission.md` for the "personalized" vibe (future work) but strictly stick to technical setup here.

## Requirements Summary

### Functional Requirements
- **Game Engine:** Initialize Phaser 3 inside the `src/` directory.
- **Bundler:** Configure `vite.config.js` to handle Phaser assets and builds correctly.
- **Scenes:** Implement `BootScene`, `PreloadScene`, `MainMenuScene`, and `FightScene` classes.
- **Flow:** Application launches -> Boot -> Preload (loads logo) -> Main Menu (shows "Start") -> Fight (shows empty arena).
- **Backend:** `server/index.js` must serve the built `dist/` files on a specific port (e.g., 3000) and API requests.
- **Scaling:** Configure Phaser for `1024x768` with `FIT` scaling for mobile devices.

### Reusability Opportunities
- **Assets:** Reuse `assets/logo.png` and `assets/shaomeme_fighter.png`.
- **Reference Logic:** Keep `temp_clone/` to reference `fighterConfig.js` or damage calculation logic later, but do not import directly into the new Phaser setup to avoid polluting the clean architecture.

### Scope Boundaries
**In Scope:**
- Installing `phaser` npm package.
- Creating the Phaser `Game` config instance.
- Creating the 4 basic Scene classes.
- Basic routing/transition between scenes.
- Serving the app via Express.

**Out of Scope:**
- Porting the actual fighting mechanics (physics, hitboxes).
- Implementing the "Invisible Combat Zones" (touch controls).
- The Photo API implementation (just a placeholder route is fine).
- The complex Arena Selector UI.

### Technical Considerations
- Ensure `type: module` in `package.json` is respected.
- Use ES6 classes for Phaser Scenes.
- Ensure the build command `npm run build` produces a working static bundle in `dist/`.
