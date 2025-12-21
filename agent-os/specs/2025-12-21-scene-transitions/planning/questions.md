Based on your idea for scene-transitions, I have some clarifying questions:

1. I assume the **Victory Screen** should be an intermediate step before the Photo Slideshow.
   - **Current Flow:** Fight End -> Victory Slideshow (DOM Overlay).
   - **Proposed Flow:** Fight End -> Victory Screen (Stats: Health remaining, Max Combo, Time) -> "View Reward" Button -> Victory Slideshow.
   - Is this correct, or should the stats be overlaid _on_ the slideshow?

2. For the **Continue Screen** (on loss):
   - I'm thinking a classic 10-second arcade countdown.
   - If "Yes": Immediate rematch (same chars, same stage).
   - If "No" (or timeout): "Game Over" screen -> Main Menu.
   - Is this the desired flow?

3. For **Loading Screens**:
   - I assume we need a generic `LoadingScene` that can intercept scene changes.
   - Should the content be static ("Loading...") or dynamic (Random tips/Lore)?
   - _Note: We currently don't have a database of tips/lore._

4. I found `src/utils/SceneTransition.js` which is fully implemented with wipes, fades, etc.
   - Should we strictly use this utility for all transitions?
   - Are there specific presets you want for specific transitions? (e.g., `WIPE_RADIAL` for Character Select, `CURTAIN` for Fight Start).

5. For **Screen Wipes**, `SceneTransition.js` supports: `fade`, `wipeHorizontal`, `wipeVertical`, `wipeRadial`, `curtain`, `slide`, `flash`, `pixelate`.
   - Do you have a preference for which effect becomes the "standard" transition, or should it vary by context?

**Existing Code Reuse:**
Are there existing features in your codebase with similar patterns we should reference? For example:

- `src/utils/SceneTransition.js` (I will definitely use this).
- Any existing UI overlays (like `AnnouncerOverlay`) that we should mimic for the Loading/Continue screens?

Please provide file/folder paths or names of these features if they exist.

**Visual Assets Request:**
Do you have any design mockups, wireframes, or screenshots that could help guide the development?

- Especially for the **Victory Stats** layout and **Continue Screen** style.

If yes, please place them in: `agent-os/specs/2025-12-21-scene-transitions/planning/visuals/`

Use descriptive file names like:

- victory-stats-mockup.png
- continue-screen-wireframe.jpg
- loading-screen-style.png

Please answer the questions above and let me know if you've added any visual files or can point to similar existing features.
