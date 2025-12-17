# Spec Requirements: Dynamic Arena Selector

## Initial Description
Create a scene to select arenas based on available folders in photos/, stylizing the selection UI.

## Requirements Discussion

### First Round Questions

**Q1:** I assume this scene will fetch the list of available cities (folders) from the recently implemented `/api/cities` endpoint. Is that correct?
**Answer:** Yes, the idea is to show all cities we have been.

**Q2:** I'm thinking the UI should present these cities as a horizontal scrolling list or a grid of "cards," where each card shows a preview image (fetched via `/api/photos?city=[name]`) and the city name. Does this layout sound right, or did you have a different style in mind (e.g., a world map)?
**Answer:** Yes, that layout is good.

**Q3:** Upon selecting an arena, I assume the game should transition to the Character Selection scene (roadmap item #6, not yet built) or directly to the Fight Scene for now? Given the roadmap, maybe we should placeholder the next step or link directly to a fight with default characters?
**Answer:** Please suggest.

**Q4:** Should this "Arena Select" scene be the first screen after the "Main Menu" (Start Game -> Arena Select -> Character Select -> Fight), or should Character Select come first?
**Answer:** I think it should be Start Game -> Character Select -> Arena Select -> Fight.

**Q5:** Regarding style: The mission mentions "90s arcade classics". Should the selection UI reflect this (e.g., pixelated fonts, high contrast, maybe a "VS" screen vibe) or keep it cleaner/modern given it's a "Memory" feature?
**Answer:** Lets switch from arcade game to cleaner and modern.

**Q6:** Is there any specific background music or sound effect you'd like to associate with this screen, or should we reuse the main menu theme?
**Answer:** We can reuse main menu background music or sound effect.

### Existing Code to Reference
No similar existing features identified for reference.

### Follow-up Questions

**Follow-up 1:** Visual Style Discrepancy: The mockup shows a very "arcade-style" grid with 2 rows of small thumbnails, metallic borders, and characters facing off in the background. However, you mentioned wanting a "cleaner and modern" look (switching away from arcade). Should we treat this mockup strictly as a layout guide but style it with modern, clean CSS?
**Answer:** Sorry for the misunderstanding, lets keep with arcade style game, (but not pixel art arcade).

**Follow-up 2:** Character Integration: The mockup shows two characters (Baraka and Cassie Cage from MK11) standing in the background. Since the "Character Selection" screen isn't built yet, for this specific task, should we display just the selected arena's background image in full screen behind the UI?
**Answer:** Please suggest, we can always later update it accordingly we move to next tasks. (Implicitly accepting suggestion to keep it simple for now, likely just background).

**Follow-up 3:** Flow Confirmation: Start Game -> Character Select -> Arena Select -> Fight. Since "Character Select" is not yet implemented, how should we handle the transition from Main Menu? Option A (Temporarily skip Character Select) or Option B (Dummy scene)?
**Answer:** Okay lets go for option A.

## Visual Assets

### Files Provided:
- `arena_mockup.png`: A high-fidelity screenshot from Mortal Kombat 11's stage selection screen.
  - **Layout:** A grid of rectangular thumbnails (2 rows) at the bottom.
  - **Selected Item:** The selected stage ("Sea of Blood") is highlighted with a distinct border and text title above the grid.
  - **Background:** The background features a large, dynamic view of the selected arena/stage.
  - **Characters:** Two 3D characters face each other in the foreground (left and right), framing the title text ("ALL ARENAS").
  - **Style:** "Arcade" but high-definition/modern (not pixel art). Dark themes, gold/metallic accents, dramatic lighting.

### Visual Insights:
- **Design Patterns:** Bottom-aligned grid navigation with "hero" background preview.
- **User Flow:** User navigates grid -> Background changes instantly to reflect selection -> Confirm selection to proceed.
- **Fidelity:** High-fidelity reference. We should aim for this layout structure (bottom grid, hero background) but using our own assets (city photos).

## Requirements Summary

### Functional Requirements
- **Data Fetching:** Fetch list of cities from `/api/cities`. For each city, fetch one photo from `/api/photos?city=[name]` to use as a thumbnail and background preview.
- **UI Layout:**
  - **Hero Background:** Full-screen image of the currently selected city (dynamically updates on hover/selection).
  - **Selection Grid:** A grid of thumbnails located at the bottom of the screen (2 rows if many cities, or scrollable row).
  - **Title Display:** Text displaying the name of the selected city (e.g., "PARIS", "ISTANBUL") prominently above the grid.
- **Input:**
  - Mouse/Touch click on thumbnail to select.
  - "Confirm/Fight" button (or double-tap) to proceed to Fight Scene.
  - "Back" button to return to Main Menu.

### Reusability Opportunities
- Reuse `MainMenuScene` background music/sounds.
- Reuse existing button styles from Main Menu if suitable, or adapt for the "HD Arcade" look.

### Scope Boundaries
**In Scope:**
- Creating `ArenaSelectScene.js`.
- Fetching and parsing data from the existing API.
- Implementing the "Bottom Grid + Hero Background" layout.
- Styling UI to match "HD Arcade" aesthetic (Mortal Kombat 11 style reference: dark, bold fonts, clear highlights).
- Navigation flow: Main Menu -> Arena Select -> Fight Scene.

**Out of Scope:**
- Character Selection (Skipped for now per Option A).
- Character models/sprites standing in the foreground (Deferred until Character Selection is built).
- "Pixel art" retro style (Explicitly requested "Arcade but not pixel art").

### Technical Considerations
- **Phaser DOM Elements:** Use Phaser's DOM Element integration (or HTML overlay) for the grid if scrolling is complex, OR implement pure Phaser Image/Container logic for the grid (preferred for performance/consistency in games).
- **Asset Loading:** Preload thumbnails? Or load on demand? Given the API structure, we might need to load one "preview" image per city during the scene `preload` or `create` phase.
- **State Management:** Pass the selected `city` data to the `FightScene` so it knows which background to load.
