# Specification: Aggressive AI Overhaul

## Goal

Overhaul the AI decision-making logic to create a significantly more difficult and aggressive challenge for the player, removing any "mercy" mechanics and implementing "input reading" behaviors for high-difficulty settings to ensure the AI prioritizes winning over fairness.

## User Stories

- As a hardcore player, I want the "Nightmare" difficulty to feel unfair and nearly impossible to beat so that I am truly challenged.
- As a player, I want the AI to punish my mistakes instantly (e.g., whiffed attacks) so that I'm forced to play carefully.
- As a player, I want the AI to be relentless and aggressive, giving me very little time to breathe or reset.

## Specific Requirements

**Input Reading Implementation**

- Modify `AIInputController` to directly inspect the opponent's input state (cursors/attack keys) or immediate animation state frame-by-frame.
- Implement a 0-frame reaction time path for "Nightmare" difficulty that bypasses the simulated `reactionDelay`.
- Allow the AI to "counter-react" instantly (e.g., if player inputs Jump, AI inputs Anti-Air/Jump Attack immediately).

**Removal of Mercy Logic**

- Remove all logic that lowers `confidence`, `aggression`, or increases `mistakeChance` when the AI is winning (health advantage).
- Ensure `calculateConfidence` returns maximum confidence when the AI is winning, reinforcing aggressive behavior.

**Aggressive Tuning**

- Refactor `monitorOpponent` to prioritize "Whiff Punish" logic with near 100% probability on Hard/Nightmare.
- Implement "Wake-up Pressure" logic: when the player is knocked down (`CRUMPLE`/`HIT`), the AI must position itself for a guaranteed attack (meaty attack) as the player stands up.
- Reduce `moveInterval` (decision tick rate) for Hard/Nightmare to make the AI feel more responsive and "twitchy".

**State-Perfect Defense**

- Implement perfect blocking for Nightmare mode: if the player attacks and the AI is within range and not committed to an action, strictly force a BLOCK state.
- Override `mistakeChance` to exactly 0% for Nightmare, and < 5% for Hard.

**Configuration Updates (`gameData.json`)**

- Update `difficulty` presets:
  - **Hard**: `aggression` 0.9, `reactionTime` 150-250ms, `mistakeChance` 0.05.
  - **Nightmare**: `aggression` 1.0, `reactionTime` 0-50ms, `mistakeChance` 0.0.
- Update all roster entries to ensure they leverage the "aggressive" personality type effectively (or add a new "relentless" personality if needed, though tuning "aggressive" is preferred).

## Visual Design

No visual assets provided. Logic changes only.

## Existing Code to Leverage

**`src/systems/AIInputController.js`**

- Reuse the class structure, `update`, and `executeAction` methods.
- Refactor `makeDecision`, `monitorOpponent`, and `calculateConfidence` to implement the new aggressive logic.

**`src/config/gameData.json`**

- Reuse the existing JSON structure for `difficulty` and `roster` to apply the new tuning values.

**`src/components/Fighter.js`**

- Monitor `fighter.currentState` constants (`FighterState.ATTACK`, `FighterState.JUMP`, etc.) to trigger AI counter-actions.

## Out of Scope

- Adding new animations, sprites, or sounds.
- Changing the physics engine or hitboxes.
- Modifying the UI/Menus (e.g., Character Select or Difficulty Select screens).
- Networked multiplayer features.
