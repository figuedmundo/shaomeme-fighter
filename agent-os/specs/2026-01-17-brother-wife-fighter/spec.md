# Specification: Brother-Wife Fighter

## Goal

Add a new fighter "brother-wife" (嫂嫂) to the game roster using existing assets and configuration patterns.

## User Stories

- As a player, I want to select "brother-wife" from the character select screen so that I can play as her.
- As a player, I want to fight against "brother-wife" as an opponent so that I can experience her "aggressive" personality in combat.

## Specific Requirements

**Roster Configuration**

- Add new entry to `roster` array in `src/config/gameData.json`.
- Set ID to `brother-wife`.
- Set Display Name to `嫂嫂` (Sister-in-law).
- Set Personality to `aggressive`.
- Define asset paths to point to `/assets/fighters/brother-wife/`.

**Asset Verification**

- Ensure `sprite.png` follows the standard 32-frame layout (Idle:6, Walk:6, Jump:1, Crouch:1, Attack:3, Hit:1, Block:1, Intro:4, Victory:4, Crumple:2, Die:3).
- Ensure `portrait.png`, `fullBody.png`, and `victory.png` exist and load correctly.

## Visual Design

**`public/assets/fighters/brother-wife/portrait.png`**

- East Asian woman with glasses and blue gi.
- Used for HUD and Character Select grid.

**`public/assets/fighters/brother-wife/fullBody.png`**

- High-res full character view.
- Used for Character Select close-up.

**`public/assets/fighters/brother-wife/victory.png`**

- Signature victory pose.
- Displayed on Victory Screen.

## Existing Code to Leverage

**`src/config/gameData.json`**

- Central configuration file for the game.
- We will append the new fighter object to the existing `roster` list.

**`src/config/ConfigManager.js`**

- Logic that reads and exposes the roster data.
- Will automatically pick up the new entry without code changes.

**`src/components/Fighter.js`**

- Core fighter class that handles state and animation creation.
- Will procedurally generate animations for `brother-wife` based on the spritesheet.

## Out of Scope

- Creating new code components.
- Adding custom voice lines (unless file exists).
- Implementing unique special moves or mechanics.
- Modifying the 32-frame spritesheet format.
