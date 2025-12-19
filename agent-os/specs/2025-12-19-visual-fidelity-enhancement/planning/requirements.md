# Spec Requirements: Visual Fidelity Enhancement (Phase 3.1 & 3.2)

## Initial Description
Implement Phase 3.1 (Stage Enhancement) and Phase 3.2 (UI Polish) from the roadmap.
- Parallax/Weather/Lighting for stages.
- Stylized Health Bars, Portraits, Round/Match Timers, and Combo Counters for UI.

## Requirements Discussion

### First Round Questions

**Q1:** Parallax Backgrounds: I assume we should implement a "fake" parallax (slow scrolling of the single image) OR focus on overlay effects (rain, fog, lighting) to add depth, rather than expecting you to slice every photo into layers. Is that correct?
**Answer:** Yes, use camera drift/zoom for depth.

**Q2:** Weather & Lighting Logic: Should weather be hardcoded per stage or randomized? For "Dynamic Lighting", is a tint flash sufficient?
**Answer:** Weather should be configurable per stage (rain for Galway, fog for Dublin, etc.). Tint flash is the best approach for lighting.

**Q3:** UI Art Style: Should the new Health Bars look gritty/digitized or more modern/clean? Preference for Round Counter?
**Answer:** "Modern Retro" using Phaser Graphics (programmatic rectangles) for performance and high resolution. Round Counter should use the MK4 font.

**Q4:** Character Portraits: Do we have distinct face assets or should we use static icons?
**Answer:** Use "Reactive Static" - the existing icons will shake, flash, and pulse to show state changes (Hit/Win).

**Q5:** Combo Counter: Placement and behavior?
**Answer:** Side-aligned (Player 1 left, Player 2 right). Scale and fade animations on each hit.

**Q6:** Scope Exclusion: I assume we are NOT touching the underlying combat logic in this pass.
**Answer:** Correct. This is a visual-only "juice" pass.

### Existing Code to Reference
- **Similar Interface Elements:** Existing health text in `FightScene.js` (to be replaced).
- **Visual Logic:** "Game Style Filters" (from Phase 1.1) for background tinting logic.
- **Components:** `src/scenes/FightScene.js` for camera and HUD integration.

## Visual Assets

### Files Provided:
No visual assets provided. Proceeding with programmatic UI design using Phaser Graphics.

## Requirements Summary

### Functional Requirements
- **Camera Drift System:** Subtle camera movement based on character position to simulate depth.
- **Weather System:** Particle-based rain and fog emitters configurable per arena.
- **Ghost Health Bars:** Programmatic health bars with a delayed "white bar" drain effect on damage.
- **Match Timer & Round Counter:** High-fidelity UI using `MK4.woff` with pulsing effects.
- **Combo Counter System:** Dynamic scaling text pop-ups tracking consecutive hits.

### Reusability Opportunities
- Use Phaser 3's built-in `ParticleEmitter` class for weather.
- Leverage `Phaser.GameObjects.Graphics` for all UI bars to avoid texture memory bloat.

### Scope Boundaries
**In Scope:**
- Background depth effects (Camera Drift).
- Atmospheric overlays (Rain/Fog).
- Full HUD redesign (Health, Timer, Rounds, Portraits, Combo).
- Visual hit feedback (Background tinting/flashes).

**Out of Scope:**
- Multi-layer image slicing (Parallax).
- Custom animated face sprites (using static icons instead).
- Changes to hitboxes or damage data.

### Technical Considerations
- **Performance:** Target 60FPS on iPad by minimizing texture swaps.
- **Asset Loading:** Generate UI textures programmatically in the `Preloader` or `FightScene`.
- **Scaling:** UI must adapt to different iPhone/iPad aspect ratios (16:9 to 21:9).
