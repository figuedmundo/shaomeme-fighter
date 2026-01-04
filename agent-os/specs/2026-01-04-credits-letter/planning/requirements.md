# Spec Requirements: Credits Letter

## Initial Description

I need that the credit view , shows first the letter below, and then the credits itself "Shaomeme QQ, I like mucho from you your hearth, that is kind, and selfness, always thinking about more other people that yourself, but that is also your burden, when you forget about yourself. Also I like mucho the way you are like a spotlight, when you get into a room , or class, or a group , everyone fox on you, you dont like, you will prefer be unnoticed, but everyone always mucho attentive of what you say, what you do, it means you are mucho interesting, that you energy make other people attract to you, like a mot to the flame of light. I like mucho your laugh, your sincere laugh and amusmet when you have something new in front of you, you desire to learn and visit, new place, to live new experiences "

## Requirements Discussion

### First Round Questions

**Q1:** I assume the letter should be displayed before the credits roll. Should the letter be interactive (e.g., "Tap to continue") or should it progress to the credits automatically after a timer?
**Answer:** Tap to continue is better.

**Q2:** For the visual style of the letter, should we use a "handwritten" or "typewriter" style font to make it feel more like a personal note, or stick with the project's "Press Start 2P" arcade font?
**Answer:** Arcade font.

**Q3:** I'm thinking of presenting the letter as a single block of text that slowly fades in, or perhaps "typing" out letter by letter. Do you have a preference for the animation?
**Answer:** Suggestion requested. (Suggested: Typewriter effect for arcade feel).

**Q4:** Should the background during the letter be a simple black screen, or should we use one of the game's arena backgrounds with a dark overlay?
**Answer:** Black screen.

**Q5:** Is there any specific music or sound effect you'd like to play specifically while the letter is being read?
**Answer:** No.

**Clarification:** The credits is the screen that is shown when in the menu the credits button is tapped.

### Existing Code to Reference

- `src/scenes/CreditsScene.js`: The current credits implementation.
- `src/utils/SceneTransition.js`: Scene transition utility.

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements

- Display a personal letter upon entering the Credits Scene.
- The letter must be displayed on a black background.
- Use the "Press Start 2P" font for the letter.
- The letter should be interactive: users must tap to proceed to the actual credits.
- After the tap, the letter should transition/fade out to reveal the standard credits (Created by, Made with love, etc.).

### Scope Boundaries

**In Scope:**

- Modification of `CreditsScene.js` to include a two-stage display (Letter then Credits).
- Text wrapping and layout for the long letter content.
- Tap-to-continue interaction.

**Out of Scope:**

- New music for the letter.
- Changes to the Main Menu (unless necessary for the transition).

### Technical Considerations

- The text is quite long, so it needs careful wrapping to be readable on mobile screens (iPhone/iPad).
- Phaser's `text` object supports `wordWrap`.
- Typewriter effect can be implemented using a timer or a tween.
