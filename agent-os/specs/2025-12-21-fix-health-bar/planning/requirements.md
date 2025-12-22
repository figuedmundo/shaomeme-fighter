# Spec Requirements: Smooth Health Bar Fix

## Initial Description

the health bar doesnt decrease when the character is hit, the health bar decrease needs to be smooth

## Requirements Discussion

### First Round Questions

**Q1:** I assume the health bar should decrease immediately to its new value, while a "ghost" bar (a delayed indicator of the damage taken) slowly follows. Is that correct, or do you want the main health bar itself to animate down smoothly?
**Answer:** I didn't know about the ghost bar, I never saw it working, by smooth, I mean smooth, lets fix the issue, and later when testing I can see if that is smooth or not.

**Q2:** For the "smooth" decrease, I've noticed a "ghost bar" effect is already partially implemented in `UIManager.js` but doesn't seem to be active. Should we prioritize making this effect work correctly as the primary way to show damage?
**Answer:** (Implied by above) Fix the issue first, then evaluate smoothness.

**Q3:** I've identified that `uiManager.update()` is currently missing from the `FightScene.js` update loop, which is likely why the bars aren't updating visually. Besides fixing this, should we also add an immediate redraw of the bars whenever health changes to ensure instant feedback?
**Answer:** (Implied by above) Focus on fixing the lack of decrease and making it smooth.

**Q4:** How fast should the "smooth" depletion be? The current lerp speed is set to 0.05. Would you like it to be faster or slower?
**Answer:** To be evaluated during testing.

**Q5:** Are there any specific colors or additional visual cues (like a brief flash of the bar) you'd like to see when a character is hit?
**Answer:** Not specified, focus is on functional "smooth" decrease.

**Q6:** Are there any exclusions for this task? For instance, should we focus strictly on the health bars and leave other UI elements like the timer or portraits untouched?
**Answer:** Focus on the health bar issue.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: UI Manager - Path: `src/systems/UIManager.js`
- Components to potentially reuse: Health bar drawing logic, ghost health lerping logic.
- Backend logic to reference: `src/components/Fighter.js` (takeDamage method).

## Visual Assets

### Files Provided:

No visual files found.

## Requirements Summary

### Functional Requirements

- Fix the issue where health bars do not visually decrease when a character takes damage.
- Ensure the health bar decrease is "smooth" (likely via the intended ghost bar effect or direct animation).
- Integrate `UIManager.update()` into the `FightScene` update loop to enable the smooth transition logic.

### Reusability Opportunities

- Utilize the existing `p1GhostHealth` and `p2GhostHealth` state in `UIManager.js`.
- Leverage the `drawHealthBars()` and `update()` methods already defined in `UIManager.js`.

### Scope Boundaries

**In Scope:**

- Fixing the visual update of health bars in `FightScene`.
- Implementing/Enabling the smooth depletion animation.
- Ensuring `UIManager` is correctly updated every frame.

**Out of Scope:**

- Major HUD redesigns.
- Changes to other UI elements (Timer, Combo, etc.) unless required for the fix.

### Technical Considerations

- `uiManager.update()` is definitely not being called in `FightScene.update()`.
- The current `updateHealth()` only sets the target health but doesn't trigger a redraw or ensure the ghost bar starts its lerp.
- Lerp speed (0.05) might need adjustment for "smoothness".
