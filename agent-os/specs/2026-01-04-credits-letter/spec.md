# Specification: Credits Letter

This specification outlines the addition of a personal introductory letter to the Credits screen in _Shaomeme Fighter_.

## 1. Objective

Enhance the emotional impact of the Credits screen by presenting a heartfelt message to "Shaomeme QQ" before displaying the standard game credits.

## 2. User Experience

1. **Trigger:** The player taps the "CREDITS" button on the Main Menu.
2. **Phase 1 (The Letter):**
   - The screen is black.
   - A long, personal letter appears using the "Press Start 2P" arcade font.
   - The text appears with a "typewriter" effect (character by character) to build anticipation.
   - A "TAP TO CONTINUE" prompt appears at the bottom once the text is fully revealed (or is always present).
3. **Phase 2 (The Credits):**
   - Upon tapping the screen, the letter fades out.
   - The standard credits ("Created by Edmundo", "Made with love for Shaomeme QQ", etc.) fade in.
   - The "BACK" button becomes available to return to the Main Menu.

## 3. Visual & Technical Design

### Text Content

> "Shaomeme QQ, I like mucho from you your hearth, that is kind, and selfness, always thinking about more other people that yourself, but that is also your burden, when you forget about yourself. Also I like mucho the way you are like a spotlight, when you get into a room , or class, or a group , everyone fox on you, you dont like, you will prefer be unnoticed, but everyone always mucho attentive of what you say, what you do, it means you are mucho interesting, that you energy make other people attract to you, like a mot to the flame of light. I like mucho your laugh, your sincere laugh and amusmet when you have something new in front of you, you desire to learn and visit, new place, to live new experiences "

### Formatting

- **Font:** `"Press Start 2P", sans-serif`
- **Size:** ~16px (to fit the long text on mobile screens).
- **Alignment:** Center or Left-aligned with generous margins (e.g., 10% of screen width).
- **Color:** White or Soft Gold.
- **Background:** Solid black (`0x000000`).

### Implementation Details (`CreditsScene.js`)

- **State Management:** Use a simple flag or state variable (e.g., `this.isShowingLetter = true`).
- **Text Wrapping:** Use Phaser's `wordWrap` property to ensure the long text fits within the screen bounds.
- **Typewriter Effect:** Use `this.time.addEvent` or a tween to reveal characters over time.
- **Input Handling:** Add a global pointer listener (`this.input.on('pointerdown', ...)`) to handle the transition from Phase 1 to Phase 2.

## 4. Implementation Plan

### Step 1: Prepare CreditsScene

- Refactor existing credits logic into a helper method (e.g., `showActualCredits()`) so it can be triggered after the letter.

### Step 2: Implement Letter Display

- Create the letter text object in `create()`.
- Set initial alpha to 1 and the credits container/elements alpha to 0.
- Implement the typewriter reveal logic.

### Step 3: Add Transition Logic

- Add the "Tap to continue" listener.
- If tapped while the letter is typing, finish the typing instantly.
- If tapped after typing is finished, fade out the letter and call `showActualCredits()`.

## 5. Verification Plan

### Automated Tests

- Create a new test file `tests/CreditsLetter.test.js`.
- Verify the letter text is present initially.
- Verify the credits content is hidden initially.
- Simulate a pointer down and verify the transition to credits.

### Manual Verification

- Launch the game, go to Credits.
- Observe the typewriter effect.
- Tap during typing to skip.
- Tap after typing to see the credits.
- Ensure text wrapping works on different screen sizes (simulated in browser).
