# Specification: Arena Reward Lock

## Goal

To prevent users from selecting arenas that do not have photo rewards (empty folders) and provide clear visual feedback ("Coming Soon" stamp) to indicate availability, enhancing the polished feel of the game.

## User Stories

- As a player, I want to clearly see which arenas are playable and which are coming soon so I don't waste time selecting an empty stage.
- As a player, I expect locked arenas to be non-selectable but still visible in the carousel.
- As a player, I want to see a fun "Coming Soon" stamp on locked arenas that fits the game's aesthetic.

## Specific Requirements

**Backend API Update (`/api/cities`)**

- Update `GET /api/cities` in `server/index.js` to return an object array `[{ name: "paris", photoCount: 5 }, ...]` instead of just strings.
- Count logic must exclude system files like `background.png`, `arena.png`, `.DS_Store`, etc. Only count valid photo extensions (`.jpg`, `.png`, etc.) that are NOT backgrounds.
- Ensure backward compatibility or update frontend to handle the new object structure.

**Frontend Data Fetching (`ArenaSelectScene`)**

- Update `fetchArenas()` in `src/scenes/ArenaSelectScene.js` to handle the new response format from `/api/cities`.
- Store `photoCount` in the local arena object for valid rendering logic.
- Continue to fetch the background preview image regardless of lock status (so users can still see what the locked arena looks like).

**Locked Arena Visualization**

- If `photoCount === 0`:
  - Apply a **Grayscale Pipeline** or tint `0x555555` to the arena thumbnail in the carousel.
  - Create a "Coming Soon" Stamp Container overlay on top of the thumbnail.
- **Stamp Design:**
  - Text: "COMING SOON..."
  - Font: "Press Start 2P" (or similar standard font if heavy weight needed).
  - Color: Red (`#FF0000` or `#CC0000`).
  - Rotation: Slightly angled (e.g., -15 to -10 degrees).
  - Border: Thick red rectangular border with rounded corners or "grunge" texture if available (use `Phaser.GameObjects.Graphics`).
  - Opacity: 100% (Permanent).

**Interaction Logic**

- Users can swipe/navigate to a locked arena (it becomes the "selected" arena in view).
- When a locked arena is selected:
  - The "Start Fight" / "FIGHT >" button must be **Hidden** or **Disabled** (grayed out).
  - Tapping the thumbnail/fight button does NOT trigger `confirmSelection()`.
  - Optionally play a "locked/error" UI sound if they try to tap it.

## Visual Design

_No visual mockups provided. Using "Restricted Document" aesthetic._

**"Coming Soon" Stamp**

- **Text:** "COMING SOON" in all caps.
- **Style:** Stamped ink look.
- **Color:** Red.
- **Placement:** Centered over the arena thumbnail.
- **Effect:** Grayscale filter on the thumbnail image behind the stamp.

## Existing Code to Leverage

**`server/index.js` - `/api/cities` Endpoint**

- Currently reads directories. will be expanded to `readdir` the subdirectories and count files matching the allowed extensions regex, excluding `background` filenames.

**`src/scenes/ArenaSelectScene.js` - `fetchArenas()`**

- Already fetches cities and then photos. logic will be simplified to trust the `photoCount` from the new `/api/cities` response, reducing the need to fetch _all_ photos just to check existence.

**`src/scenes/ArenaSelectScene.js` - `buildGrid()`**

- Logic for creating thumbnails and borders already exists. Will add the `Grayscale` pipeline or tint and the new `Container` for the stamp here.

**`src/scenes/ArenaSelectScene.js` - `selectArena()`**

- Logic for highlighting selection. Will need to check `this.arenas[index].photoCount > 0` to decide whether to show/enable the `fightBtn`.

## Out of Scope

- Creating new photo content or placeholders.
- "Developer Mode" or bypass settings.
- Fading out the "Coming Soon" message (it is permanent).
- Changes to the Fight Scene or other gameplay logic.
