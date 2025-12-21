# Spec Requirements: Character Select Polish

## Initial Description

From Roadmap Task 5.2:

- **Stage Preview** — Improve arena preview when selected.
- **Zoom Camera** — Close-up on selected character for dramatic effect.
- **Voice Lines** — Ensure character voice lines are perfectly synced with selection and zoom.

## Requirements Discussion

### First Round Questions

**Q1:** Where should the arena preview appear?
**Answer:** Suggestion: Skip on this screen to keep mobile UI simple and preserve existing flow.

**Q2:** Should we zoom the camera or scale portraits?
**Answer:** Suggestion: Scale portraits (1.2x) and add a "VS" splash effect with a screen flash.

**Q3:** When should the zoom happen?
**Answer:** During the "Confirmed" state after tapping SELECT.

**Q4:** Should we reveal the random opponent on this screen?
**Answer:** Yes.

**Q5:** Stage Selection Flow: Merge or keep?
**Answer:** Keep current flow (`Character Select -> Arena Select`). Don't break transitions.

**Q6:** Which elements should stay static?
**Answer:** Suggestion: Fade out the grid and UI buttons during the "VS Splash" so the focus is on the fighters.

### Existing Code to Reference

- `src/utils/SceneTransition.js`: For the `flash` method.
- `src/scenes/CharacterSelectScene.js`: Current selection logic.
- `src/components/AnnouncerOverlay.js`: For potential "VS" text animations.

### Follow-up Questions

None.

## Visual Assets

No visual assets provided. Implementation will follow existing "Shaomeme Fighter" retro aesthetic.

## Requirements Summary

### Functional Requirements

1.  **Opponent "Roll" Logic**:
    - When SELECT is tapped, P1 choice is locked.
    - The Opponent Silhouette (`?`) cycles through random character icons for 500ms.
    - Stops on the actual AI opponent chosen for the fight.
2.  **VS Splash Animation**:
    - Triggered immediately after opponent reveal.
    - P1 and Opponent portraits scale up by 20% over 200ms.
    - A white `transition.flash(200)` is triggered.
    - The character select grid and "BACK" button fade to alpha 0.
3.  **Audio Sync**:
    - Play "select" sound on icon tap (existing).
    - Play "confirmed" sound + P1 Announcer name on SELECT tap (existing).
    - Play "roll" tick sound during opponent selection.
    - Play Opponent Announcer name upon reveal.
4.  **Data Persistence**:
    - Ensure both `playerCharacter` and `opponentCharacter` are passed to the next scene.

### Scope Boundaries

**In Scope:**

- Polish of `CharacterSelectScene.js`.
- Opponent reveal animation.
- Portrait scaling/splash effects.
- Audio synchronization for the new reveal.

**Out of Scope:**

- Adding arena previews to this screen.
- Changing the scene navigation order.
- Creating new 3D assets or complex camera rigs.

### Technical Considerations

- **Performance**: Ensure the "roll" animation doesn't drop frames on older iPhones/iPads.
- **Timing**: The entire sequence (Reveal -> Splash -> Wipe) should not exceed 2.5 seconds to keep the game feeling fast.
