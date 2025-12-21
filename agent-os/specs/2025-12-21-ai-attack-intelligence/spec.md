# Specification: AI Attack Intelligence

## Goal

Transform the AI from a boring, predictable opponent into a dynamic, engaging adversary by introducing character-specific personalities, frame-reactive decision-making, and adaptive aggression levels.

## User Stories

- As a player, I want the AI to react to my jumps and attacks so that the fight feels like a real competition rather than hitting a sandbag.
- As a player, I want different characters to fight with unique styles so that I have to adapt my strategy for each opponent.
- As a player, I want the AI's difficulty to feel "human" with occasional mistakes and fluctuating aggression so that the game remains challenging but fair.

## Specific Requirements

**Reactive Decision Engine**

- Transition from fixed-interval polling (e.g., every 500ms) to a frame-aware system with variable reaction windows.
- AI should detect critical player state changes (Start of Jump, Start of Attack, Entering Hitstun) within a few frames.
- Reaction delay should be randomized based on difficulty (e.g., Hard: 100-200ms, Easy: 600-1000ms) to simulate human response time.

**Character Personalities**

- **Aggressive:** Prefers approaching and constant pressure; high attack frequency, low block rate.
- **Defensive:** Prefers blocking and counter-attacking; stays mid-range, waits for player to miss.
- **Zoner:** Tries to maintain maximum distance; uses retreat often, jumps back when player gets close.
- **Balanced:** Adapts behavior based on health and distance; standard mix of all actions.

**Confidence System (Dynamic Aggression)**

- Aggression level fluctuates based on "Confidence" score (0 to 1).
- Confidence increases when landing hits or having higher HP; decreases when taking damage or being cornered.
- High confidence increases aggression and reduces reaction time; low confidence increases block rate and retreat frequency.

**Improved Movement & Spacing**

- AI should use Jumps to avoid ground attacks or to perform "jump-in" attacks when approaching.
- Implementation of "Anti-Corner" logic: AI should prioritize jumping over or dashing past the player if trapped against a screen boundary.
- Spacing awareness: AI tries to stay within its "Optimal Range" defined by its personality.

**Action Commitment (Sequences)**

- Framework to allow AI to "commit" to a multi-input sequence (e.g., "Jump Forward" -> "Attack" or "Retreat" -> "Wait").
- Prevents erratic "jittery" behavior by ensuring certain actions finish before a new decision is made.

**Mistake Injection**

- Introduce "Whiff" chance: AI occasionally attacks when out of range or fails to block a predictable attack.
- "Panic" state: Low confidence AI might jump randomly or spam retreat when pinned down.

## Existing Code to Leverage

**`src/systems/AIInputController.js`**

- Refactor the existing `update` and `makeDecision` methods to use the new reactive and personality-driven logic.
- Reuse the `cursorKeys` and `attackKey` output structure for compatibility with `Fighter.js`.

**`src/components/Fighter.js`**

- Reference `FighterState` to accurately detect player and opponent states (e.g., `ATTACK`, `JUMP`).
- Use the existing `Fighter` physics and movement methods.

**`src/config/gameData.json`**

- Extend character definitions to include a `personality` property.
- Update the `difficulty` section to provide more granular parameters for the new AI systems.

## Out of Scope

- Implementing "Special Moves" or complex QCF (Quarter-Circle Forward) inputs (will be handled in a separate spec).
- Neural network training or complex learning algorithms.
- 2v1 or Tag-team AI logic.
- Pathfinding for complex environments (game is on a 2D plane).
