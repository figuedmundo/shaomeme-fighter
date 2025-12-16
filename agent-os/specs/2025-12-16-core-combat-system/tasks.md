# Task Breakdown: Core Combat System

## Overview
Total Tasks: 4

## Task List

### Assets & Config

#### Task Group 1: Physics Config & Asset Prep
**Dependencies:** None

- [x] 1.0 Prepare Assets and Physics
  - [x] 1.1 Configure Arcade Physics
    - Update `src/config/gameConfig.js` to enable `arcade` physics.
    - Set gravity y: 1000.
    - Enable debug mode: `true` (for hitbox visibility).
  - [x] 1.2 Generate/Mock Spritesheets
    - Create/Source spritesheets for Ryu and Ken (using `refs/` logic as base or placeholders).
    - Ensure standard frame sizes for: Idle, Walk, Crouch, Jump, Attack, Hit, Die.
    - Create JSON atlas or simple frame config.
  - [x] 1.3 Load Assets in PreloadScene
    - Update `src/scenes/PreloadScene.js` to load the new fighter spritesheets.

**Acceptance Criteria:**
- Physics system active (debug boxes visible).
- Spritesheets loaded without errors in console.

### Core Logic

#### Task Group 2: Fighter Class & State Machine
**Dependencies:** Task Group 1

- [x] 2.0 Implement Fighter Logic
  - [x] 2.1 Create `src/components/Fighter.js`
    - Extend `Phaser.Physics.Arcade.Sprite`.
    - Add properties: `velocity`, `jumpPower`, `health`, `state`.
  - [x] 2.2 Implement State Machine
    - Define states: `IDLE`, `WALK`, `JUMP`, `CROUCH`, `ATTACK`, `BLOCK`, `HIT`.
    - Create `setState(newState)` method to switch animations and logic.
    - Implement `update()` method to handle transitions (e.g., ground detection).
  - [x] 2.3 Implement Controls Integration
    - Map keyboard inputs (Cursor keys + Space/Z/F) to state changes.
    - Handle movement (velocity.x) and jumping (velocity.y).

**Acceptance Criteria:**
- Fighter spawns in scene.
- Fighter can Idle, Walk, Jump, and Crouch with correct animations.
- State transitions work (no walking while crouching, etc.).

### Game Loop

#### Task Group 3: Scene Integration & Collision
**Dependencies:** Task Group 2

- [x] 3.0 Integrate into FightScene
  - [x] 3.1 Setup FightScene Geometry
    - Create a static physics group for the "floor" (invisible or placeholder graphic).
    - Set world bounds.
    - Add colliders between Fighters and Floor.
  - [x] 3.2 Instantiate Fighters
    - Spawn Player 1 (Right facing) and Player 2 (Left facing).
    - Enable collision between players (pushing each other).
  - [x] 3.3 Implement Basic Attacks & Hitboxes
    - Define "Attack Hitbox" relative to fighter (offset/size).
    - Activate hitbox only during attack frames.
    - Use `physics.overlap` to detect hits.
    - Log "Hit Confirmed" to console.

**Acceptance Criteria:**
- Fighters stand on ground (don't fall through).
- Fighters collide with each other.
- Attacks register in console when overlapping opponent.

### Testing

#### Task Group 4: Combat Verification
**Dependencies:** Task Group 3

- [x] 4.0 Verify Combat Mechanics
  - [x] 4.1 Test Movement
    - Verify jumping physics (gravity feel).
    - Verify walking speed.
  - [x] 4.2 Test State Locking
    - Ensure player cannot walk while attacking.
    - Ensure player cannot jump while crouching.
  - [x] 4.3 Test Hit Detection
    - Verify attack box only hits when extended.
    - Verify hit log appears.

**Acceptance Criteria:**
- Fluid movement resembling a 90s fighting game.
- Accurate state locking (no animation glitching).
- Reliable hit detection logs.

## Execution Order
1. Physics Config & Asset Prep
2. Fighter Class & State Machine
3. Scene Integration & Collision
4. Combat Verification
