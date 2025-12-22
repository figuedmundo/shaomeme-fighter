# Spec Requirements: Branding

## Initial Description

Implement Phase 6.1: Branding:

- **Splash Screen**: Animated logo on startup.
- **Credits Screen**: "Made with love for Shaomeme QQ".
- **Easter Eggs**: Hidden references to the relationship.

## Requirements Discussion

### First Round Questions & Answers (Implicit Approval)

**Q1:** Splash Screen Flow?
**Answer:** User approved defaults. We will implement a dedicated `SplashScene` that plays on boot (after Preload/Boot) and transitions to `MainMenuScene`.

**Q2:** Credits Access?
**Answer:** User approved defaults. We will add a subtle "Credits" or "About" button to the `MainMenuScene`.

**Q3:** Credits Content?
**Answer:** User approved defaults. A simple, elegant static screen (`CreditsScene`) with the "Made with love" message, author name, and potentially a photo.

**Q4:** Easter Egg Mechanics?
**Answer:** User approved defaults. We will implement a flexible `SecretManager` system (or simple logic within `CreditsScene` initially) to handle triggers (e.g., tapping a logo 5 times).

**Q5:** Logo Animation?
**Answer:** User approved defaults. Simple Fade-In / Hold / Fade-Out sequence for the Splash Screen.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Main Menu - Path: `src/scenes/MainMenuScene.js` (For adding the entry point to Credits).
- Feature: Boot Sequence - Path: `src/scenes/BootScene.js` / `src/scenes/PreloadScene.js` (To insert SplashScene into the flow).

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

No visual assets provided.

## Requirements Summary

### Functional Requirements

1.  **Splash Scene**:
    - New Scene: `src/scenes/SplashScene.js`.
    - Display Logo centered.
    - Animation: Alpha 0 -> 1 (Fade In), Delay, Alpha 1 -> 0 (Fade Out).
    - Auto-transition to `MainMenuScene`.
    - Allow "Tap to Skip".

2.  **Credits Scene**:
    - New Scene: `src/scenes/CreditsScene.js`.
    - Text: "Created by [Author]", "For Shaomeme Fighter", "Made with love for Shaomeme QQ".
    - Simple layout, readable font.
    - "Back" button to return to Main Menu.

3.  **Main Menu Integration**:
    - Update `src/scenes/MainMenuScene.js`.
    - Add a small "Credits" button (text or icon) in a corner (bottom-right or bottom-left).

4.  **Easter Egg Foundation**:
    - Implement a simple counter in `CreditsScene`.
    - If Logo/Heart is tapped X times, play a distinct sound or show a hidden message.

### Reusability Opportunities

- Reuse `src/components/UIButton.js` (if it exists, or similar button logic from MainMenu) for the Back button.
- Reuse `FadeTransition` logic if available, or standard Phaser tweens.

### Scope Boundaries

**In Scope:**

- Splash Scene implementation.
- Credits Scene implementation.
- Main Menu linking.
- Basic Easter Egg trigger (tap count).

**Out of Scope:**

- Complex movie-style rolling credits.
- Complex Easter Egg rewards (unlocking characters/modes) - just a sound/visual feedback for now.
- Networked asset loading for the Splash (use local asset).

### Technical Considerations

- The Splash Screen needs to be loaded _quickly_. It might need to be part of `BootScene` or have its own minimal preload before the main heavy `PreloadScene` runs, OR it runs after `PreloadScene` as a stylistic intro.
  - _Decision:_ To keep it simple and smooth, we will run `SplashScene` AFTER `PreloadScene` is done. This ensures the logo asset is loaded and the game is ready, acting as a "Presentation" intro before the Menu.
