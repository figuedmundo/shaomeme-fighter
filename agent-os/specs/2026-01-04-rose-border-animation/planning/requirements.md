# Spec Requirements: Rose Border Animation

## Initial Description

"Can you create an animation, creating a red rose, and the tallo grows and creates another rose, in the border, of the screen"

## Requirements Discussion

### First Round Questions

**Q1:** I assume the "red rose" and growing stem should be procedurally generated using Phaser Graphics (circles/curves).
**Answer:** Use Phaser Graphics (circles/curves).

**Q2:** I'm thinking the roses should grow along the left and right borders of the screen to frame the text. Should they also grow along the top/bottom, or just the sides?
**Answer:** Start with only the sides.

**Q3:** Should the animation loop continuously (roses blooming and fading), or happen just once as the letter fades in?
**Answer:** Loop continuously (roses blooming and fading).

**Q4:** How detailed should the "growth" be?
**Answer:** Make it beautiful.

**Q5:** Should this animation be part of the `CreditsScene` specifically, or a reusable component for other scenes?
**Answer:** Credits Scene letter.

### Existing Code to Reference

- `src/scenes/CreditsScene.js`: The target scene where the animation will be integrated.
- Phaser `Graphics` examples in `src/utils/SceneTransition.js` or `src/components/TouchVisuals.js` for drawing primitives.

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Procedural Generation:** Create roses and stems using `Phaser.GameObjects.Graphics`.
- **Placement:** Animation should occur along the left and right borders of the screen.
- **Animation Loop:**
  - Stems grow (using curves/lines).
  - Roses bloom (scale up/unfold).
  - Roses/stems fade out.
  - Process repeats continuously.
- **Aesthetic:** "Beautiful" and organic feel. Use Bézier curves for stems and overlapping shapes for petals.
- **Integration:** Directly into the "Letter" phase of `CreditsScene.js`.

### Scope Boundaries

**In Scope:**

- Creating a `RoseBorder` class or helper function within `CreditsScene` (or a separate component file if complex).
- implementing the growth and bloom animation logic using Tweens.
- Managing the lifecycle (create, animate, destroy/reset) to prevent memory leaks.

**Out of Scope:**

- Complex sprite-based animations (we are using Graphics).
- Interactions (roses don't need to be clickable).
- Audio specific to the roses (unless existing music covers it).

### Technical Considerations

- **Performance:** Ensure that continuous drawing/clearing of Graphics doesn't cause FPS drops. Consider using a single Graphics object for multiple roses if possible, or limited instances.
- **Math:** Use `Phaser.Curves.CubicBezier` or similar for natural-looking stems.
