# Specification: Improve AI Difficulty

## Goal

Enhance the AI opponent to provide a significantly deeper challenge by implementing "Nightmare" difficulty, combo chaining, wake-up options, spacing ("footsies") logic, and adaptive difficulty adjustments.

## User Stories

- As a **Veteran Player**, I want a "Nightmare" difficulty mode so that I can feel genuinely challenged by the CPU.
- As a **Player**, I want the AI to punish my mistakes with combos so that the fight feels more dangerous and realistic.
- As a **Player**, I want the AI to react intelligently when getting up from a knockdown (Wake-up) so that I can't just spam attacks to win.
- As a **Casual Player**, I want the AI to ease up slightly if I'm losing badly so that I don't get completely discouraged (Adaptive Difficulty).

## Specific Requirements

**Nightmare Difficulty Configuration**

- Add `nightmare` object to `src/config/gameData.json` under `difficulty`.
- Set aggressive parameters: `aggression` > 0.9, `blockRate` > 0.9, `mistakeChance` < 0.02.
- Set `reactionTime` to extreme lows (e.g., 100-200ms) for near-human-limit reactions.

**Combo Logic Implementation**

- Modify `AIInputController` to support multi-step `actionQueue` instead of single `currentAction`.
- Implement `executeCombo()` method that queues 2-3 standard attacks with specific timing delays.
- Trigger combos when an attack successfully hits (confirm) or when the opponent is in `CRUMPLE` state.

**Wake-up Options (Okizeme Defense)**

- Detect when AI transitions from `CRUMPLE` or `HIT` (knockdown) to `IDLE`.
- Implement a decision fork on wake-up: `BLOCK` (safe), `ATTACK` (reversal), or `JUMP` (escape).
- Weight decisions based on difficulty (e.g., Nightmare prefers Reversal or Block).

**Spacing & Footsies Logic**

- Update `makeDecision()` to include a "Spacing" behavior: oscillate movement just outside player's attack range (approx. 100-150px).
- Implement "Whiff Punish": If player attacks and misses (whiffs) while AI is spacing, immediately trigger `APPROACH` + `ATTACK`.

**Adaptive Difficulty (Dynamic Adjustment)**

- Enhance `calculateConfidence()` to affect `reactionDelay` and `mistakeChance` in real-time.
- If AI Health < 30% AND Player Health > 80% (Desperation): Decrease reaction time by 20%, increase aggression.
- If AI Health > 80% AND Player Health < 30% (Mercy): Increase reaction delay, slightly lower block rate (unless in Nightmare mode).

## Visual Design

No visual assets provided. Logic changes only.

## Existing Code to Leverage

**`src/systems/AIInputController.js`**

- Reuse the existing class structure, specifically `monitorOpponent` and `update` loop.
- Extend `actionCommitmentTimer` to handle multi-step combo sequences.
- Utilize the existing `personality` system to weight Wake-up and Spacing choices (e.g., 'Aggressive' prefers Wake-up Attack).

**`src/config/gameData.json`**

- extend the `difficulty` object to include the new `nightmare` settings structure.

**`src/components/Fighter.js`**

- Reference `FighterState` constants (imported or accessed via instance) to detect `CRUMPLE`, `ATTACK`, and `IDLE` states accurately.

## Out of Scope

- Adding new animations or sprite assets.
- Creating "Special Moves" (fireballs, uppercuts) - AI will use standard attacks only for now.
- Changing player input handling or touch controls.
- Multiplayer/Networked AI.
