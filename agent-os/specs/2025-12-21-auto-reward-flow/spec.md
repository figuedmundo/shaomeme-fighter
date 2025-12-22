# Specification: Auto Reward Flow

## Goal

Streamline the post-fight experience by automatically triggering the reward slideshow upon victory, removing the intermediate stats and rematch screen.

## User Stories

- As a player, I want to see my photo rewards immediately after winning so that I can enjoy the "gift" aspect of the game without extra clicks.
- As a player, I want a smooth transition from the fight to the memories so the experience feels cinematic.

## Specific Requirements

**Automated Win Sequence**

- Modify `FightScene.js` to trigger the `VictorySlideshow` component immediately after the victory sequence (KO and announcer call).
- Remove the transition to `VictoryScene`.

**Cinematic Transition**

- When a win is confirmed, fade the `FightScene` main camera to black over 500ms before starting the slideshow.
- This ensures the DOM-based slideshow overlay appears over a clean black background.

**Remove Redundant Features**

- Remove the display of HP, Combo, and Time stats after a win.
- Remove the "Rematch" functionality entirely as per user request.

**Slideshow Exit Logic**

- Update `VictorySlideshow.js` exit handler to transition directly to `MainMenuScene` instead of `ArenaSelectScene`.
- Use the `TransitionPresets.BACK_TO_MENU` for the final transition.

**Maintain Loss Flow**

- Ensure the player still transitions to `ContinueScene` upon losing to the AI.

## Visual Design

No mockups provided. The UI will leverage the existing `VictorySlideshow` DOM overlay.

## Existing Code to Leverage

**`src/scenes/FightScene.js`**

- Use `checkWinCondition` to intercept the victory event.
- Use `this.slideshow.show(this.city)` to trigger the reward.
- Call `this.transition.fadeOut()` before showing the slideshow.

**`src/components/VictorySlideshow.js`**

- Update the `exit()` method to target `MainMenuScene`.

**`src/utils/SceneTransition.js`**

- Use `TransitionPresets` for consistent fade effects.

## Out of Scope

- Redesigning the `ContinueScene`.
- Adding new UI buttons to the slideshow (keep only "EXIT").
- Changing the "REMATCH" behavior for the loss screen (ContinueScene).
