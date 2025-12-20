# Spec Requirements: Difficulty & Balance

## Initial Description

From Roadmap 4.3 (Difficulty & Balance):

- AI Difficulty Settings (Easy/Medium/Hard)
- Adaptive AI (Deferred)
- Character Balance Pass (Standardize stats)

## Requirements Discussion

### First Round Questions

**Q1:** Difficulty Implementation?
**Answer:** Focus on **Aggression** (attack frequency) and **Reaction Time** (blocking chance).

- **Easy:** Passive, rarely blocks (10%), attacks slowly.
- **Medium:** Balanced, blocks sometimes (40%), attacks when close.
- **Hard:** Aggressive, blocks often (70%), counters attacks.

**Q2:** Adaptive AI Scope?
**Answer:** Defer. Simple difficulty selection is enough. Focus on predictable fun.

**Q3:** Difficulty Selection?
**Answer:** Global setting. Default to "Medium".

**Q4:** Character Balance?
**Answer:** Centralize stats in `combatConfig` (expand `gameData.json` or new file). Standardize hitboxes and damage.

**Q5:** Exclusions?
**Answer:** Defer Nightmare mode and complex pattern learning.

### Existing Code to Reference

- `src/components/Fighter.js`: Needs an `AIInputController` injection.
- `src/scenes/FightScene.js`: Needs to instantiate AI for P2.
- `src/config/gameData.json`: Already contains `"combat"` section. We will expand this.

### Follow-up Questions

None needed. Scope is simplified to Basic AI + Config expansion.

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **AI Input Controller:**
  - Create `src/systems/AIInputController.js`.
  - Must implement the same interface as `TouchInputController` (returning cursor keys + attack key).
  - Logic loop (update every X ms):
    - Check distance to opponent.
    - Check opponent state (is attacking?).
    - Decide action based on Difficulty Profile (Move Closer, Move Away, Attack, Block).
- **Difficulty Settings:**
  - Add `difficulty` to `gameData.json` or a runtime setting.
  - Define profiles:
    - `EASY`: { attackChance: 0.2, blockChance: 0.1, moveInterval: 1000 }
    - `MEDIUM`: { attackChance: 0.5, blockChance: 0.4, moveInterval: 600 }
    - `HARD`: { attackChance: 0.8, blockChance: 0.7, moveInterval: 300 }
- **Character Balance:**
  - Expand `gameData.json` -> `combat` section to include global Fighter stats:
    - `walkSpeed`: 160 (current hardcoded default)
    - `jumpPower`: -600
    - `attackDamage`: 10
    - `maxHealth`: 100
  - Update `Fighter.js` to read these values from config instead of hardcoding.

### Reusability Opportunities

- Reuse `TouchInputController` interface pattern.
- Reuse `ConfigManager` to serve new combat stats.

### Scope Boundaries

**In Scope:**

- `AIInputController` implementation.
- `EASY/MEDIUM/HARD` profiles.
- Centralized stats in `gameData.json`.
- `Fighter.js` using config values.

**Out of Scope:**

- Machine Learning / DDA.
- UI for changing difficulty (hardcode to "Medium" or "Easy" for now in code, or simple URL param).
- Individual character quirks (all share the same "Balance" stats for now).

### Technical Considerations

- **Determinism:** AI decisions should use `Phaser.Math.Between` for randomness.
- **Performance:** AI logic should not run every frame. Run every 10-30 frames (throttle).
