# Spec Requirements: Full-Body Fighter Select Visuals

## Initial Description

In the select fighter screen, there is 2 parts, left for the player, right for the AI that will be chosen randomly after the player select the character. The image shown must be full body, high quality in a fighter pose, distinct from the standard HUD portraits.

## Requirements Discussion

### First Round Questions

**Q1:** Asset Naming convention?
**Answer:** Use `fullBodyPath`.

**Q2:** Vertical orientation for iPad/iPhone?
**Answer:** Yes, optimized for iPad presence but responsive for iPhone.

**Q3:** Background/Pop effect?
**Answer:** Add a "spotlight" or dramatic gradient behind the active selection.

**Q4:** AI Reveal animation?
**Answer:** Use a dramatic reveal (white flash/slide-in) after the player selection is locked.

**Q5:** Differentiating from portraits?
**Answer:** Keep `fullBodyPath` separate from `portraitPath`.

**Q6:** Resolution target?
**Answer:** High quality (1024px height target) for Retina displays.

### Existing Code to Reference

- `src/scenes/CharacterSelectScene.js`: Main scene to be upgraded.
- `src/config/ConfigManager.js`: Roster data source.
- `src/utils/SceneTransition.js`: For the white flash effect.

### Follow-up Questions

None.

## Visual Assets

No visual assets provided. Implementation will focus on creating the layout and "spotlight" containers using Phaser graphics and high-res placeholders.

## Requirements Summary

### Functional Requirements

1.  **High-Res Asset Loading**:
    - `CharacterSelectScene` must preload `fullBodyPath` assets for all characters.
    - Assets should be distinct from the smaller `portraitPath` used in the select grid.
2.  **Interactive Selection**:
    - Player selection (left) updates immediately as the user scrolls/taps the grid.
    - Show a "Spotlight" or glow effect behind the currently highlighted character.
3.  **Opponent Reveal**:
    - Upon "SELECT" confirmation, the right side (AI) triggers a reveal sequence.
    - The sequence ends with a white flash and the AI's full-body pose appearing.
4.  **Responsive Layout**:
    - **iPad**: Wide split-screen with large fighter poses on left/right edges.
    - **iPhone**: Centered or tighter horizontal layout with poses slightly overlapping or scaled to fit the narrower aspect ratio.

### Technical Considerations

- **Memory Management**: High-res full-body images (1024px) can consume significant VRAM. Ensure we only keep necessary assets in memory or use texture compression if possible.
- **Aspect Ratio**: Fighter poses will have varying widths; the system must handle "fitting" them into their respective left/right containers without distorting the sprites.

### Scope Boundaries

**In Scope:**

- Updating `CharacterSelectScene.js` layout.
- Adding spotlight/gradient backgrounds.
- Implementing the AI reveal animation.
- Updating `ConfigManager.js` to support the new asset path.

**Out of Scope:**

- Creating the actual artistic assets (only implementing the engine support).
- Animating the poses (they will be static high-quality images).
