# Specification: Branding (Splash Screen & Credits)

## Goal

To implement a professional splash screen on startup and a "Credits" section that adds a personal touch and hidden Easter eggs, enhancing the game's polish and emotional value.

## User Stories

- As a player, I want to see a branded splash screen when the game starts so that it feels like a professional arcade game.
- As a player, I want to view a credits screen to see the "Made with love" message.
- As a player, I want to discover hidden Easter eggs by interacting with the UI to feel rewarded for curiosity.

## Specific Requirements

**Splash Scene (`SplashScene.js`)**

- Create a new Phaser Scene `SplashScene`.
- Insert it into the game flow: `PreloadScene` -> `SplashScene` -> `MainMenuScene`.
- Display the game logo (or a specific "Studio" logo if available, otherwise reuse `logo`) centered on a black background.
- Animate opacity: Fade In (0.5s) -> Hold (2s) -> Fade Out (0.5s).
- Transition automatically to `MainMenuScene` after the sequence.
- Add "Tap to Skip" functionality (pointerdown event instantly triggers transition).
- Play a short intro sound if available (optional).

**Credits Scene (`CreditsScene.js`)**

- Create a new Phaser Scene `CreditsScene`.
- Display a static layout with:
  - Header: "CREDITS" (Arcade font)
  - Content: "Created by [Author]", "For Shaomeme Fighter", "Made with love for Shaomeme QQ".
  - Optional: A central heart icon or small photo if asset exists.
- Add a "Back" button at the bottom to return to `MainMenuScene`.
- Use `SceneTransition` for smooth entry/exit (Fade).

**Main Menu Integration**

- Modify `MainMenuScene.js` to add a "Credits" button.
- Position: Bottom-Right or distinct from "Start Game".
- Style: Smaller text than "Start Game", consistent font.
- Interaction: On click, transition to `CreditsScene`.

**Easter Egg Logic**

- In `CreditsScene`, make a specific element (e.g., the Heart icon or a specific text) interactive.
- Implement a click counter.
- Trigger: On the 5th (or Xth) click, play a distinct "Secret" sound (e.g., a specific voice line or chime) and/or spawn a particle effect.
- Reset counter on scene exit.

## Visual Design

_No specific visual assets provided. Using project defaults._

**General Style**

- Background: Black or dark gradient (consistent with existing theme).
- Font: `"Press Start 2P", sans-serif` (Project standard).
- Colors: Gold (`#ffd700`) for interactive elements, White (`#ffffff`) for body text.

## Existing Code to Leverage

**`src/scenes/MainMenuScene.js`**

- Reuse the Text Button pattern (setInteractive, pointerover/out styles).
- Reuse the `addTransitions` / `TransitionPresets` logic for navigation.
- Reuse the existing footer text style for the Credits content.

**`src/scenes/PreloadScene.js`**

- Update the `create()` method to `this.scene.start("SplashScene")` instead of `MainMenuScene`.

**`src/utils/SceneTransition.js`**

- Leverage for consistent Fades between Splash -> Menu and Menu <-> Credits.

## Out of Scope

- Rolling/Scrolling credits (static screen only).
- Unlocking new content via Easter Eggs (sound/visual feedback only).
- Network fetching of assets for the Splash screen (local assets only).
- Complex custom animations for the logo (simple alpha tweens only).
