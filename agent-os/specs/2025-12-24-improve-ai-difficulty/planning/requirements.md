# Spec Requirements: Improve AI Difficulty

## Initial Description

"the AI fighers are not good, very easy to defeact, we need more challange, make it more fun to play the game, please explore more ideas how to make it fight better"

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should add a **"Nightmare" difficulty** (as mentioned in the roadmap) that is significantly harder than the current "Hard" mode. Is that correct, or should we just re-balance the existing Easy/Medium/Hard?
**Answer:** Yes, add Nightmare mode.

**Q2:** I'm thinking the AI needs to **perform combos** (chaining multiple hits) rather than just single attacks. Should we implement a system where the AI attempts specific 3-hit sequences when an opening is found?
**Answer:** Yes, implement combo logic.

**Q3:** I assume the AI should use **Special Moves** (if/when available). Currently, the AI only presses the basic attack button. Should we build the logic now to input motion commands (like Quarter-Circle-Forward) or simulated "special" inputs?
**Answer:** Yes, but since the Fighter engine currently only supports a single attack state, the AI will prioritize chaining standard attacks and spacing for now. Structure the code to allow special inputs later.

**Q4:** I'm thinking of adding **"Wake-up" options**, where the AI performs a specific action (block or immediate attack) immediately after getting up from a knockdown. Is this a behavior you want?
**Answer:** Yes.

**Q5:** I assume we should implement **Dynamic Difficulty Adjustment (Adaptive AI)** where the AI becomes slightly less aggressive if the player is losing badly, or sharper if the player is dominating. Is that correct, or should difficulty remain static per match?
**Answer:** Yes, adaptive AI is desired.

**Q6:** I'm thinking of improving **spacing logic ("Footsies")**, where the AI intentionally moves in and out of the player's range to bait attacks. Is this too advanced, or exactly what you're looking for?
**Answer:** Yes, implement spacing logic.

### Existing Code to Reference

- `src/systems/AIInputController.js` (Core AI logic to be upgraded)
- `src/components/Fighter.js` (Fighter states and inputs)
- `src/config/gameData.json` (Difficulty configurations)

**Similar Features Identified:**

- No other specific input controllers identified besides `TouchInputController.js`.

### Follow-up Questions

None needed as the user instruction "please continue with your suggestions" was interpreted as an affirmation of all proposed features.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A

## Requirements Summary

### Functional Requirements

- **Nightmare Difficulty**: A new difficulty level in `gameData.json` with extreme aggression, near-zero reaction time, and high blocking rates.
- **Combo System**: The AI should attempt to chain attacks (e.g., 3 rapid hits) when an initial hit lands or is guarded, rather than retreating immediately.
- **Wake-up Logic**: When the AI transitions from `CRUMPLE` or `HIT` (knockdown) back to `IDLE`, it should have a pre-determined "wake-up" decision (e.g., 50% chance to block, 30% to attack immediately, 20% to jump).
- **Spacing/Footsies**: The AI should oscillate just outside the player's attack range to bait missed attacks ("whiffs") and then punish.
- **Adaptive Difficulty**: The AI's `confidence` value (already present in `AIInputController`) should dynamically adjust aggression/reaction time during the match based on the health delta. If the player is dominating (AI health < 30%, Player > 80%), the AI should "cheat" slightly (faster reactions). If the player is struggling, the AI might hesitate more.

### Reusability Opportunities

- Reuse existing `AIInputController.js` structure but significantly refactor the `makeDecision` and `monitorOpponent` methods.
- Reuse `gameData.json` difficulty config structure, adding a new key for `nightmare`.

### Scope Boundaries

**In Scope:**

- Updating `AIInputController.js` logic.
- Updating `gameData.json` config.
- Implementing "Wake-up", "Footsies", and "Combo" behaviors using existing Fighter states (`WALK`, `ATTACK`, `BLOCK`, `JUMP`).

**Out of Scope:**

- Creating new Fighter animations or special moves (Project Phase 4.1).
- Changing the player's input handling.

### Technical Considerations

- The AI must respect the `Fighter.js` state machine (cannot attack while already attacking).
- Performance: The AI decision loop runs frequently; ensure complex logic doesn't cause frame drops on mobile.
- The `confidence` system exists but is currently simple; it needs to be expanded to influence `reactionTime` and `mistakeChance` dynamically.
