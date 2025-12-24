# Spec Requirements: Signature Victory Portrait

## Initial Description

Implement 'Signature Victory Picture' for the winning character. It should be a unique asset (victory.png) displayed on the winner's side of the screen with a dramatic 'Pop' animation, replacing the scaling HUD portrait effect.

## Requirements Discussion

### First Round Questions

**Q1:** Image Style?
**Answer:** Dynamic Action Pose.

**Q2:** Placement?
**Answer:**

- **Hero Side Border:** The image should appear on the side of the screen corresponding to the winner (Left for P1, Right for P2).
- **Positioning:** It should slide in from the side edge of the screen.
- **Layering:** The in-game fighter characters must be **on top** of this image. The image acts as a stylized background element for the winner's side.
- **Centering:** It should be centered vertically and fit the height of the screen.

**Q3:** Background Interaction?
**Answer:** No darkening of the world. It should behave like the previous HUD portrait expansion but with a new visual style:

- **Transition:** Slide/Move in from the side of the screen (instead of scaling up from the HUD).
- **Behavior:** It replaces the "HUD portrait expansion" effect.

**Q4:** Audio?
**Answer:** No specific sound effect required for the image appearance.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: **Fighter Assets** - Path: `src/config/rosterConfig.js` (Need to add `victoryPath` here).
- Feature: **UI Manager** - Path: `src/systems/UIManager.js` (Specifically `showVictory` method which currently handles the portrait scaling).
- Feature: **Asset Loading** - Path: `src/scenes/PreloadScene.js` or `src/scenes/LoadingScene.js` (Need to ensure `victory.png` is loaded).

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

- The `victory.png` is a "Dynamic Action Pose".
- It serves as a large, stylized graphical element on the winner's side.
- It enters via a **Slide In** animation from the screen edge.
- It sits **behind** the 3D/sprite characters but **in front** of the stage background (effectively). _Correction based on "fighters characters in the game are in top of this image" - yes, low UI depth or high World depth._

## Requirements Summary

### Functional Requirements

- **Config Update:** Add `victoryPath` to `rosterConfig.js` for each character, pointing to `/assets/fighters/{id}/victory.png`.
- **Asset Management:** Ensure this new asset is loaded (likely in `PreloadScene` or `LoadingScene` alongside other character assets).
- **UI Logic Update (`UIManager.js`):**
  - Modify `showVictory(winnerNum)`.
  - Disable the old "scale up HUD portrait" animation.
  - Instantiate the `victory.png` image.
  - **Positioning:**
    - P1 Winner: Left side of screen.
    - P2 Winner: Right side of screen.
    - Vertically centered.
    - Height: Scaled to fit screen height (or a large portion of it).
  - **Layering:** Set `depth` such that it is **behind** the fighters (`player1`, `player2`) but **above** the stage background/UI background if any. _Note: UIManager elements are usually on top. We might need to adjust depth or add this element to the World Scene instead of the UI Scene to put it behind fighters, OR strictly manage z-index._
  - **Animation:** Slide in from the respective side (Left edge for P1, Right edge for P2).

### Reusability Opportunities

- Reuse `rosterConfig` structure.
- Reuse `UIManager` class structure.

### Scope Boundaries

**In Scope:**

- Code changes to `rosterConfig.js`, `UIManager.js`.
- Placeholder asset creation (if real assets aren't provided, likely reused `fullBody` or `portrait` temporarily).

**Out of Scope:**

- Creating the actual final artwork for `victory.png` (will use placeholders).
- Changing the "Victory Slideshow" (the photo reward that comes _after_).

### Technical Considerations

- **Z-Index/Depth:** The user specifically asked for "fighters characters in the game are in top of this image".
  - `Fighter` sprites usually have depth based on Y position (y-sort) or a fixed game layer depth (e.g., 10-20).
  - `UIManager` usually sits at depth 1000+ to be on top of everything.
  - **Solution:** This specific "Victory Image" should probably be added to the **Scene** (not the UI Container/Camera if possible, or a low-depth UI layer) with a depth **lower** than the fighters.
  - Fighters are typically `depth` ~100 (or dynamic). The floor is `0`.
  - We should set this Victory Image to `depth: 5` (above background, below fighters).
