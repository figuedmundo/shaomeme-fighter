# Spec Requirements: Auto Reward Flow

## Initial Description

lets remove the screen after the fight end, where the player see stats, the claim reward and rematch, lets remove that screen, the game should automatically show the rewards pictures after the player wins

## Requirements Discussion

### First Round Questions

**Q1:** When the player wins, should the slideshow start immediately after the "YOU WIN" announcer call, or should there be a brief delay?
**Answer:** The transition should be smooth, but needs to start immediately.

**Q2:** If we remove the screen with the "REMATCH" button, how would you like the player to trigger a rematch? Should we add a button to the end of the slideshow, or maybe allow a tap to skip/restart?
**Answer:** We can remove that rematch feature.

**Q3:** Should the fight stats (Remaining HP, Max Combo, Time) be shown as a brief overlay before the slideshow starts, or should they be removed from the game entirely?
**Answer:** Lets remove the fighting stats.

**Q4:** What should happen when the player _loses_ (the AI wins)? Currently, it goes to the `ContinueScene` (arcade-style countdown). Should we keep that as is?
**Answer:** That is good (keep the current lose flow).

**Q5:** After the slideshow finishes, where should the game go? Back to the Main Menu, or back to the Arena/Character Select screen?
**Answer:** Back to the main menu.

**Q6:** Are there any specific visual transitions you'd like to see between the fight ending and the first photo appearing?
**Answer:** (Implied by Q1) Smooth and immediate.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Fight End Routing - Path: `src/scenes/FightScene.js` (Currently transitions to VictoryScene or ContinueScene).
- Component: Victory Slideshow - Path: `src/components/VictorySlideshow.js` (Component that plays the photos).
- Scene: Victory Scene - Path: `src/scenes/VictoryScene.js` (The scene being removed).

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Automated Win Flow:** Upon player victory, bypass the `VictoryScene` and start the `VictorySlideshow` immediately.
- **Remove Rematch:** Eliminate the rematch functionality from the win flow.
- **Remove Stats:** Stop displaying HP, Combo, and Time stats after a win.
- **Maintain Lose Flow:** Keep the existing `ContinueScene` logic when the player loses.
- **Menu Exit:** Ensure the slideshow logic returns the player to the `MainMenuScene` upon completion.

### Reusability Opportunities

- The `VictorySlideshow` component can likely be triggered directly from `FightScene` or a lightweight intermediate scene.
- Existing transition presets can be used for the "smooth" requirement.

### Scope Boundaries

**In Scope:**

- Modifications to `FightScene.js` routing.
- Deletion or deprecation of `VictoryScene.js`.
- Updates to `VictorySlideshow.js` completion callback.

**Out of Scope:**

- Changes to the character select or arena select screens.
- Redesigning the `ContinueScene`.
- Adding new reward types.

### Technical Considerations

- `FightScene` currently has a `checkWinCondition` method that handles the transition delay (2 seconds).
- `VictorySlideshow` needs to be initialized and shown within the appropriate context.
- We need to ensure resources are cleaned up properly if we transition directly from Fight to Slideshow.
