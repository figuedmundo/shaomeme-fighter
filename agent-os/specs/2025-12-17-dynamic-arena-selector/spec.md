# Specification: Dynamic Arena Selector

## Goal
Implement a dynamic "Arena Selection" scene that fetches available cities from the backend, displaying them in a modern, arcade-style interface (thumbnail grid + hero background), and transitions the user to the Fight Scene with the selected arena background.

## User Stories
- As a player, I want to see a visual list of all the cities we've visited so I can choose a specific memory to fight in.
- As a player, I want to see a large preview of the arena before selecting it, so I know exactly what the background will look like.
- As a player, I want a smooth, modern interface that feels like a high-quality arcade game (Mortal Kombat 11 style) rather than a basic web page.

## Specific Requirements

**Scene Implementation**
- Create `src/scenes/ArenaSelectScene.js`.
- Register this new scene in the game configuration (`src/index.js` or `src/config/gameConfig.js`).
- Update `MainMenuScene` to transition to `ArenaSelectScene` instead of `FightScene`.

**Data Fetching**
- In `ArenaSelectScene`, asynchronously fetch the list of cities from `/api/cities`.
- For each city, fetch the first available image via `/api/photos?city=[city_name]` to serve as its thumbnail and preview.
- Handle loading states (show a spinner or "Loading Arenas..." text while fetching).

**UI Layout & Design**
- **Hero Background:** A full-screen `Phaser.GameObjects.Image` that updates when a user hovers over/selects a city in the grid.
- **Thumbnail Grid:** A horizontal row or grid of thumbnails at the bottom of the screen.
- **Title:** A large text object displaying the current city name (e.g., "PARIS") centered above the grid or at the top of the screen.
- **Styling:** Dark overlay/gradient behind the grid for readability. Gold/Metallic borders for the selected item.

**Interaction Logic**
- Clicking a thumbnail updates the Hero Background and the Title.
- Double-clicking or pressing a "FIGHT" button confirms the selection.
- Upon confirmation, start `FightScene` passing the selected `{ city: [name], backgroundUrl: [url] }` as scene data.

**Fight Scene Integration**
- Modify `FightScene.js` (init/create methods) to accept `data` passed from `scene.start()`.
- If `data.backgroundUrl` is present, load/display that image as the background.
- Fallback to the default background if no data is passed (for testing).

## Visual Design
**`planning/visuals/arena_mockup.png`**
- **Grid Layout:** Bottom-aligned row of rectangular thumbnails.
- **Selection Highlight:** Selected thumbnail has a prominent border (gold/yellow) and maybe a "P1" indicator.
- **Hero Preview:** The entire screen background changes to match the selected arena.
- **Text:** Large, uppercase, sans-serif font for the arena name ("SEA OF BLOOD" in mockup -> "PARIS" in our app).
- **Overlay:** A dark bar/gradient behind the thumbnails to separate them from the background.

## Existing Code to Leverage

**`src/scenes/MainMenuScene.js`**
- Reuse the basic text creation and interaction pattern (`setInteractive`, `pointerover`, `pointerdown`) for the "Fight" and "Back" buttons.

**`src/scenes/FightScene.js`**
- Reuse the background loading logic but adapt it to use dynamic URLs from the API instead of static assets.

**`src/styles/previewContainer.css`**
- Reuse `.preview-container___fight-btn` styles if we use DOM elements, or replicate the "red button with shadow" look in Phaser graphics.

## Out of Scope
- Character Selection scene (will be skipped: Main Menu -> Arena Select -> Fight).
- 3D character models standing in the foreground.
- "Pixel art" fonts or styling (explicitly requested modern/HD arcade style).
- Complex world map visualization (sticking to grid/list view).
