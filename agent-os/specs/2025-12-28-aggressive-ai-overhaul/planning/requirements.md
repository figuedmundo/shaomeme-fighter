# Spec Requirements: Aggressive AI Overhaul

## Initial Description

The AI fighter is too easy to defeat. The user manually updated all fighters in `src/config/gameData.json` to be "aggressive", but they are still too easy. The goal is to update all fighters to be more aggressive, smarter, and willing to defeat the player without holding back. There is no need for "fairness" mechanisms; if the AI can defeat the player, it should do so.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should apply this "unfair/god-like" behavior primarily to the **Hard** and **Nightmare** difficulty settings. Is that correct, or do you truly want **Easy/Medium** to also be extremely difficult?
**Answer:** User requested to "continue with your suggestions" and "update all fighters", implying a desire for a significant difficulty spike across the board, or at least ensuring the "Aggressive" personality (which all fighters use) is truly formidable.

**Q2:** I'm thinking of implementing "Input Reading" (reacting instantly to player button presses with 0ms delay) and removing the "Mercy" logic.
**Answer:** User explicitly stated "no need any mechanism to try to make a fare game".

**Q3:** Should we prioritize **Frame-Perfect Blocking** and **Guaranteed Punishes**?
**Answer:** User wanted AI "more smart" and "willing to defeat".

### Existing Code to Reference

**Similar Features Identified:**

- Feature: AI Logic - Path: `src/systems/AIInputController.js`
- Feature: AI Config - Path: `src/config/gameData.json` (Difficulty and Roster settings)

### Follow-up Questions

No follow-ups needed as the direction is clear: "Make it unfair/hard".

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Remove "Mercy" Logic:** logic in `AIInputController.js` that lowers AI confidence or aggression when it is winning (health advantage) must be removed. The AI should press the advantage.
- **Implement "Input Reading":** The AI should be able to react instantly (0-1 frame delay) to player inputs (like attacking or jumping) in higher difficulties/aggressive modes.
- **Enhance Aggression:**
  - Increase attack frequency.
  - Reduce "idle" or "spacing" time for aggressive personalities.
  - Implement reliable "Wake-up" pressure (attacking player as they stand up).
- **Optimize Reactions:**
  - Frame-perfect blocking for "Nightmare" difficulty.
  - Guaranteed punishment of whiffed (missed) player attacks.
- **Configuration Updates:**
  - Update `src/config/gameData.json` difficulty presets ("hard", "nightmare") to have `reactionTime` near zero, `aggression` near 1.0, and `mistakeChance` near 0.
  - Ensure the "aggressive" personality modifier in `AIInputController` provides a significant boost to offensive behavior.

### Reusability Opportunities

- Reuse existing `AIInputController.js` structure but refactor the decision-making methods (`makeDecision`, `getReactionDelay`, `monitorOpponent`).
- Reuse `ConfigManager` to load the new tougher presets.

### Scope Boundaries

**In Scope:**

- `src/systems/AIInputController.js` (Logic overhaul)
- `src/config/gameData.json` (Data tuning)

**Out of Scope:**

- New animations or assets.
- Changes to the combat engine physics or hitboxes (only AI decision making).
- UI changes (Difficulty selection remains the same, just the underlying logic changes).

### Technical Considerations

- **Performance:** Ensure "Input Reading" doesn't cause lag loops, though checking state every frame is standard for this.
- **Balance:** The goal is explicitly _unbalanced_ in favor of the AI for high difficulties.
