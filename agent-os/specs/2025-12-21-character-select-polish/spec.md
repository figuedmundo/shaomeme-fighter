# Specification: Character Select Polish

## Goal

Enhance the character selection experience with dramatic "VS" animations, an automated opponent reveal, and synchronized audio to deliver a high-quality arcade feel on mobile.

## User Stories

- As a player, I want to see who I am fighting before leaving the selection screen so the match feels more personal.
- As a player, I want a dramatic visual feedback when I confirm my character so I feel excited for the upcoming fight.
- As a player, I want the selection process to feel fast and responsive on my iPad without unnecessary UI clutter.

## Specific Requirements

**Opponent Reveal Sequence**

- Triggered when the player taps the "SELECT" button.
- The right-side silhouette (`?`) must cycle through random character icons rapidly for 500ms.
- The "roll" must stop on a random character ID (excluding the player's choice).
- Once stopped, the silhouette is replaced by the actual opponent's high-fidelity portrait.

**VS Splash Animation**

- Occurs immediately after the opponent is revealed.
- Scale both Player 1 and Opponent portraits by 1.2x over 200ms using a `Sine.easeOut` tween.
- Trigger a white screen flash using `SceneTransition.flash(200)` to emphasize the confirmation.
- Fade the character selection grid and "BACK" buttons to alpha 0 over 300ms.

**Audio Synchronization**

- Play a "tick" sound effect for each icon switch during the opponent reveal roll.
- Play the Announcer voice line for the revealed opponent character immediately after the roll stops.
- Ensure the P1 Announcer voice line plays exactly when the "SELECT" button is tapped.

**Data Persistence**

- The `opponentCharacter` ID must be stored in the scene state.
- Both `playerCharacter` and `opponentCharacter` must be passed in the data object to `ArenaSelectScene`.

**Visual Consistency**

- Maintain the "Shaomeme Fighter" retro aesthetic using `Press Start 2P` font.
- Ensure the "VS" text (if added) or splash effects use high-contrast gold/red strokes similar to `AnnouncerOverlay`.

## Visual Design

`No visual assets provided`

- Use the existing layout of `CharacterSelectScene.js`.
- Scale portraits in place without changing their origin points (typically center-origin).

## Existing Code to Leverage

**`src/scenes/CharacterSelectScene.js`**

- Modify `confirmSelection()` to include the reveal and splash logic.
- Use `this.selectedCharacterIndex` to identify the player's choice.

**`src/utils/SceneTransition.js`**

- Use `this.transition.flash(duration, color)` for the confirmation effect.
- Use `this.transition.transitionTo(...)` for the final wipe to the next scene.

**`src/config/rosterConfig.js`**

- Use to pull the list of valid characters for the random opponent roll.

**`src/utils/AudioManager.js`**

- Use `playUi()` for the roll ticks and `playAnnouncer()` for character names.

## Out of Scope

- Interactive stage previews or background changes during selection.
- Merging Character Select and Arena Select into a single scene.
- Manual selection of the opponent (strictly random/AI controlled for now).
- New animations for the character icons themselves (only portraits/UI fade).
