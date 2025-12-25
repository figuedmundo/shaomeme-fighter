# Spec Requirements: arena-reward-lock

## Initial Description

if the arena doesn't have pictures reward, the arena should show a message in the middle of the game screen, somthing like "coming soon" and only the arenas that have pictures reward should be able to play

## Requirements Discussion

### First Round Questions

**Q1:** I assume that if a user taps on an arena that doesn't have a "pictures reward" (like the Dojo or Desert), the game should **prevent** the fight from starting and instead show the "Coming Soon" message overlay on top of the Arena Select screen. Is that correct?
**Answer:** yes

**Q2:** Should the "locked" arenas look different in the selection carousel _before_ the user tries to tap them (e.g., grayed out, padlock icon), or is the "Coming Soon" message the only feedback?
**Answer:** gray out and "Coming Soon..."" message is good

**Q3:** I assume an arena "has pictures reward" if a corresponding folder exists in the `photos/` directory (e.g., `photos/paris` exists -> Paris is playable). Is this the correct check, or should we add a specific flag in `gameData.json`?
**Answer:** Paris has a a background.png but doesn't have picture rewards, so it should be gray oyt and with the message in red

**Q4:** For the "Coming Soon" message, I assume a simple text overlay centered on the screen that fades out after a short duration (e.g., 2 seconds) is sufficient. Is that acceptable?
**Answer:** it ddoesn't need to fade oout, it can be permanent in a style of the documents restricted letter and color and style

**Q5:** Should there be a "developer mode" or config setting to bypass this lock for testing purposes?
**Answer:** no

### Existing Code to Reference

The user did not provide specific paths, but based on the project structure and roadmap:

- **Arena Selection Logic:** `src/scenes/ArenaSelectScene.js` (Item 5 in roadmap)
- **Backend API:** `server/index.js` (Item 4 in roadmap)

### Follow-up Questions

**Follow-up 1:** To verify if an arena has "picture rewards," should the frontend check if the backend reports **more than 0 photos** for that arena? (For example, even if `paris` is in `gameData.json`, if the backend says it has 0 photos, it becomes locked).
**Answer:** yes, is that possible ?

**Follow-up 2:** You described the "Coming Soon" message as a "documents restricted letter" style in red. Do you envision this as a **"stamped" ink effect** (like a "CLASSIFIED" or "RESTRICTED" stamp) overlaid on top of the grayed-out arena preview?
**Answer:** yes , hand stamped style little angled with a "worn ink" effect

**Follow-up 3:** Since the message is "permanent" on the locked arena, I assume the user can still **scroll/swipe** to these locked arenas in the carousel to see them (grayed out + stamped), but tapping/selecting them simply won't start the fight. Is that correct?
**Answer:** yes

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Lock Logic:** The game must prevent starting a fight if the selected arena has 0 reward photos.
- **Verification:** The determination of "playable" is based on the **backend reporting > 0 photos** for that specific city. (Note: `background.png` or `arena.png` do not count as rewards).
- **Interaction:**
  - Users can still swipe/scroll to locked arenas.
  - Tapping/selecting a locked arena does **nothing** (no fight start).
  - Locked arenas are visually distinct in the carousel.

### Visual Requirements

- **Grayed Out:** Locked arenas should have a grayscale filter or reduced opacity to indicate unavailability.
- **"Coming Soon..." Stamp:**
  - **Text:** "Coming Soon..."
  - **Style:** "Restricted document" style / Rubber stamp aesthetic.
  - **Color:** Red.
  - **Effect:** Angled rotation, "worn ink" texture (grunge effect), overlaying the arena image.
  - **Visibility:** Permanent overlay (does not fade out) while the arena is in focus/view.

### Reusability Opportunities

- **Backend API (`server/index.js`):** Needs to be updated to return photo counts per city so the frontend can check `count > 0`.
- **Arena Select Scene (`src/scenes/ArenaSelectScene.js`):** Existing selection logic needs to be patched to add the condition `if (arena.photoCount > 0) startFight()`.

### Scope Boundaries

**In Scope:**

- Updating backend (`server/index.js`) to return photo counts.
- Updating `ArenaSelectScene` to fetch/receive these counts.
- Implementing the visual "Grayed Out" effect for locked arenas.
- Implementing the "Coming Soon..." red stamp overlay using CSS or Phaser text/graphics.
- Blocking the "Start Fight" action for locked arenas.

**Out of Scope:**

- Creating new photos or assets for empty arenas.
- Developer bypass mode (explicitly excluded).
- Fading out the message (explicitly excluded).

### Technical Considerations

- **Backend Optimization:** The `/api/cities` endpoint currently only returns names. It should be enhanced to return metadata (e.g., `{ name: "paris", photoCount: 0 }`) to avoid making heavy calls to `/api/photos` for every city during the selection menu load.
- **Filtering:** The count must exclude system files like `background.png` or `arena.png` which might exist in the folder but are not "rewards".
