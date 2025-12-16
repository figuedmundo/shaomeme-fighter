# Specification: Core Combat System

## Goal
Implement a physics-based combat system using Phaser 3's Arcade Physics engine, featuring a robust state machine for fighter actions (Idle, Walk, Attack) and precise hitbox detection, replacing the previous static logic.

## User Stories
- As a developer, I want a `Fighter` class that handles its own physics and state so that I can easily add multiple characters with shared logic.
- As a developer, I want to use standard spritesheets instead of animated WebPs so that I can define precise hitboxes for specific animation frames.
- As a player, I want to move my character (Jump, Walk, Crouch) and perform basic attacks with keyboard controls to verify the combat mechanics.

## Specific Requirements

**Arcade Physics Configuration**
- Enable `arcade` physics in `src/config/gameConfig.js` with `gravity.y: 1000` (adjustable) and `debug: true` (for dev).
- Implement a static "floor" (physics static group) at the bottom of the `FightScene` for fighters to collide with.
- Ensure fighters respect world bounds and cannot walk off-screen.

**Fighter Class & State Machine**
- Create `src/components/Fighter.js` extending `Phaser.Physics.Arcade.Sprite`.
- Implement a State Machine pattern within the class handling states: `IDLE`, `WALK`, `JUMP`, `CROUCH`, `ATTACK`, `BLOCK`, `HIT`, `DIE`.
- Use `update()` method to handle input processing and state transitions (e.g., transition from `WALK` to `IDLE` if no keys pressed).

**Animation & Spritesheets**
- Process provided `refs/` assets (WebP) into standard PNG spritesheets with JSON data.
- Load spritesheets in `PreloadScene.js` for at least two characters (e.g., Ryu and Ken placeholders).
- Define animations in `Fighter.js` (or a helper) corresponding to each state (e.g., `ryu-idle`, `ryu-walk`, `ryu-attack`).

**Input Handling (Keyboard)**
- Map keyboard keys to actions in `src/scenes/FightScene.js` (or passed to Fighter):
  - Arrow Keys: Move Left/Right, Jump (Up), Crouch (Down).
  - Space/Z/F: Attack (Light/Heavy).
- Ensure input is ignored during "commited" states like `ATTACK` or `HIT` (unless implementing cancel logic).

**Hitbox Detection**
- Define a "Hurtbox" (the physics body) that stays relatively consistent to avoid jitter.
- Implement an "Attack Hitbox" that activates ONLY during specific frames of the attack animation.
- Use `scene.physics.add.overlap` to detect when an active Attack Hitbox intersects an opponent's Hurtbox.
- Log "Hit Confirmed" to console upon overlap (visual feedback is secondary for this spec).

## Visual Design

*No visual mockups provided. Using standard placeholder assets.*

## Existing Code to Leverage

**`temp_clone/src/javascript/components/fight.js`**
- logic for damage calculation (if applicable to port) can be referenced, but physics logic will be new.

**`refs/` directory**
- Source images for Ryu, Ken, etc., to be converted into spritesheets.

**`src/systems/CombatSystem.js`**
- Existing `getDamage` method can be adapted or moved into the new `Fighter` class/logic.

## Out of Scope
- Touch controls ("Invisible Combat Zones").
- Complex combo chaining or special moves (Fireballs).
- Sound effects integration.
- UI elements (Health bars, Timers) - focus is strictly on the physics/combat loop.
- Networked multiplayer or AI (Local 2-player or dummy target only).
