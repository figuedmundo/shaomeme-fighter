# Spec Requirements: AI Attack Intelligence

## Initial Description

Improve the AI attack to give it some intelligence. Right now, it is too boring to fight against the AI.

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming we want to move away from fixed decision intervals (e.g., 500ms) towards a more reactive system that can respond to player actions frame-by-frame (or with a much smaller reaction window). Is that correct?
**Answer:** Yes, follow the suggestions.

**Q2:** Should the AI have "Personalities"? For example, some characters being more aggressive (approaching more), while others are more defensive (waiting for the player to attack)?
**Answer:** Yes, follow the suggestions.

**Q3:** The current system only uses one attack key. If we implement "Special Moves" or "Combos" later, should this AI improvement already consider a "Sequence" of inputs?
**Answer:** Yes, follow the suggestions.

**Q4:** Should the AI utilize jumping (Up key)?
**Answer:** Yes, follow the suggestions.

**Q5:** I'm thinking of adding a "Stamina" or "Confidence" meter for the AI that affects its aggression. Would this fit the game's feel?
**Answer:** Yes, follow the suggestions.

**Q6:** Are there any specific "boring" behaviors you've noticed?
**Answer:** Yes, follow the suggestions.

## Existing Code to Reference

- `src/systems/AIInputController.js` - Current AI implementation.
- `src/components/Fighter.js` - Character physics and state machine.
- `src/config/gameData.json` - Difficulty and roster settings.

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **High Reactivity:** AI should respond to player actions within a dynamic reaction window (based on difficulty).
- **AI Personalities:** Different characters should exhibit different behaviors (Aggressive, Defensive, Balanced).
- **Dynamic Aggression:** AI aggression should scale based on its own health and performance (Confidence system).
- **Expanded Movement:** AI should use jumping and better positioning (avoiding getting cornered).
- **Input Sequences:** Framework for AI to execute multi-step actions (Combo/Special move prep).
- **Proactive Defense:** AI should try to bait attacks or block more intelligently instead of just standing still.

### Reusability Opportunities

- Extend `AIInputController` to handle complex states.
- Reference `Fighter.js` state machine to ensure AI inputs are valid.

### Scope Boundaries

**In Scope:**

- Refactoring `AIInputController` for better reactivity and state management.
- Adding "Personality" traits to characters in `gameData.json` or a separate config.
- Implementing a "Confidence" system for dynamic aggression.
- Adding jump logic to AI movement.

**Out of Scope:**

- Implementing actual "Special Moves" (this is a separate roadmap item, but we will provide the _framework_ for AI to use them).
- Machine learning or neural network AI (keep it heuristic-based for performance and simplicity).

### Technical Considerations

- **Performance:** Avoid expensive calculations every frame; use efficient distance checks and state transitions.
- **Maintainability:** Keep personality definitions data-driven.
- **Testing:** Ensure AI doesn't become "unbeatable" on Hard/Nightmare through frame-perfect reactions.
