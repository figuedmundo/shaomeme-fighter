# Specification: Difficulty & Balance

## Goal

Implement an AI system with adjustable difficulty and centralize combat statistics to ensure a fair and consistent experience.

## User Stories

- As a player, I want to choose a difficulty level (Easy/Medium/Hard) so I can enjoy the game at my own skill level.
- As a player, I want the AI to behave intelligently (blocking, attacking when close) rather than just moving randomly.
- As a developer, I want to tweak damage and speed values in one place so I can easily balance the game.

## Specific Requirements

**AI Input Controller**

- Create `src/systems/AIInputController.js` class.
- Implement `getCursorKeys()` and `getAttackKey()` to match `TouchInputController` interface.
- Implement an `update(time, delta)` method to be called from the game loop.
- Logic:
  - Calculate distance to opponent.
  - State Machine: `IDLE` -> `APPROACH` -> `ATTACK` or `RETREAT` / `BLOCK`.
  - Use `difficulty` settings to determine probability of blocking and attacking.
  - Implement reaction delay (AI shouldn't react instantly to every frame).

**Difficulty Configuration**

- Add `difficulty` section to `src/config/gameData.json`.
- Profiles:
  - `easy`: { aggression: 0.2, blockRate: 0.1, reactionTime: 1000 }
  - `medium`: { aggression: 0.5, blockRate: 0.4, reactionTime: 500 }
  - `hard`: { aggression: 0.8, blockRate: 0.7, reactionTime: 200 }
- Default to `medium`.

**Centralized Combat Stats**

- Update `src/config/gameData.json` -> `combat` with:
  - `walkSpeed`: 160
  - `jumpPower`: -600
  - `attackDamage`: 10
  - `maxHealth`: 100
- Update `src/components/Fighter.js` to use `ConfigManager.getCombatConfig()` for these values.

**FightScene Integration**

- In `FightScene.create()`, instantiate `AIInputController` for Player 2.
- Pass the AI controller to Player 2 via `setControls`.
- Call `aiController.update()` in `FightScene.update()`.

## Visual Design

No UI changes for this iteration (Difficulty set via code/default).

## Existing Code to Leverage

**`src/systems/TouchInputController.js`**

- Reference for input interface structure.

**`src/config/ConfigManager.js`**

- Use to retrieve combat stats and difficulty settings.

**`src/components/Fighter.js`**

- Update constructor to read stats from config.

## Out of Scope

- UI for difficulty selection (Settings Menu).
- Adaptive AI (dynamic difficulty adjustment).
- Unique stats per character (all use global defaults for now).
- Complex combos for AI.
