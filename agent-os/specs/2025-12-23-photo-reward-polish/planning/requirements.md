# Spec Requirements: Photo Reward Polish

## Initial Description

From roadmap.md:

### 5.3 Photo Reward Polish

- [ ] **Photo Transitions** — Elegant fade/slide between photos `S`
- [ ] **Movie Style filter** — During the photos sileshow , a movie alike filter should be displayed on top of the photos to make it more visually stunning, with option to activate/deactivat from gameData.json `M`
- [ ] **Ken Burns Effect** — Slow zoom/pan on photos `S`
- [ ] **Background Music** — Soft music during slideshow `S`
- [ ] **Picture resize or crop to fit the screen** - The problem is currenlty the game is shown in a landscape but pictures are usually portrait, lets figure it out how to solve the issue, also the pictre needs to be full size (fit in the screen) and
- [ ] **Add border to the pictures** - Add a border to the pictures when in slideshow
- [ ] **Add hearts to the screen** - Add hearts to the screen when it is tapped and the heart needs to show up small and grow up little by little (very smooth with a heart beat motion) and at the same time start going up like a ballon.

## Requirements Discussion

### First Round Questions

**Q1:** I assume a smooth cross-fade (alpha blending) of around 1 second is the desired "elegant" effect. Is that correct, or would you prefer a slide transition?
**Answer:** YES

**Q2:** For the "movie style filter", I'm thinking of a subtle film grain overlay with a slight vignette to give a cinematic feel. Should we also apply color grading (e.g., warmer tones or sepia), or keep the original photo colors?
**Answer:** YES

**Q3:** Since the game is landscape and photos are often portrait, "fitting" them will leave empty space on the sides. To fill the screen, should we display a blurred, zoomed-in version of the same photo in the background (a common "letterbox" technique)? Or prefer a solid black/themed background?
**Answer:** YES

**Q4:** You mentioned "when it is tapped". Does this mean the player can tap anywhere on the slideshow screen to spawn hearts manually? Or should hearts also appear automatically?
**Answer:** YES and hearts should also appear automatically

**Q5:** I assume the hearts should drift upward and fade out. Should they follow a specific path (e.g., wavy) or just float up?
**Answer:** drift upward, random path, wavy

**Q6:** Do you have a specific audio file in mind for the slideshow music, or should I look for a royalty-free "sentimental/soft" placeholder track?
**Answer:** for the background music is something we can set up in gameData.json arenas victoryMusic

**Q7:** For the "border", are you envisioning a simple white line (like a printed photo) or a more stylized "Polaroid" frame?
**Answer:** like a Polaroid frame

**Q8:** I plan to randomize the zoom (in/out) and pan direction for each photo to keep it dynamic. Is a slow movement (e.g., 5-10% scale change over 5 seconds) appropriate?
**Answer:** YES

### Existing Code to Reference

**Similar Features Identified:**

- `src/components/VictorySlideshow.js`: Main component to update.
- `src/config/gameData.json`: Contains arena configuration, including `victoryMusic`.
- `src/systems/AudioManager.js`: For handling music playback.

### Follow-up Questions

None needed.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A

## Requirements Summary

### Functional Requirements

- **Slideshow Logic:** Update `VictorySlideshow.js` to handle the new visual presentation.
- **Photo Transitions:** Implement smooth cross-fade (1s duration).
- **Ken Burns Effect:** Apply randomized slow zoom (5-10% over 5s) and pan to active photos.
- **Cinematic Filter:** Add a film grain and vignette overlay (toggled via config if needed, though user accepted "movie style filter").
- **Layout Handling:** For portrait photos on landscape screen:
  - Foreground: Full photo with Polaroid-style border.
  - Background: Blurred, zoomed version of the same photo to fill gaps.
- **Interactive Hearts:**
  - Tap anywhere to spawn hearts.
  - Auto-spawn hearts periodically.
  - Animation: Grow from small (heartbeat motion), float upward on random wavy path, fade out.
- **Audio:** Use `victoryMusic` from `gameData.json` for the background track.

### Reusability Opportunities

- Existing `VictorySlideshow.js` structure.
- Existing CSS filters/animations can be used for the "cinematic" look and heart animations.
- Existing `AudioManager` for music.

### Scope Boundaries

**In Scope:**

- Enhancing `VictorySlideshow.js` and associated CSS.
- Updating `gameData.json` structure if needed (it already has `victoryMusic`).
- Adding heart assets (SVG or simple CSS shape) and animation logic.

**Out of Scope:**

- Changing the photo fetching logic (API endpoint remains the same).
- Modifying other scenes beyond the transition out of Victory scene.

### Technical Considerations

- **CSS vs. Canvas:** Most effects (transitions, filters, Ken Burns, hearts) should likely be implemented in CSS for performance and ease of animation within the existing DOM-overlay-based `VictorySlideshow.js`.
- **Config:** Check if "movie style filter" activation needs to be added to `gameData.json` (roadmap mentioned it, user didn't explicitly reject). We should probably add a global or per-arena setting for it.
