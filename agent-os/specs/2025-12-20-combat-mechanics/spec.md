# Specification: Combat Mechanics (Blocking)

## Goal

Implement a "Hold Back to Block" mechanic to add defensive depth to the combat system without introducing new buttons or complex gestures, adhering to the "Invisible Combat Zones" philosophy.

## User Stories

- As a player, I want to block enemy attacks by simply walking away from them, so I can defend myself intuitively.
- As a player, I want to take reduced damage when blocking, so I can survive longer against aggressive opponents.
- As a player, I want clear visual and audio feedback when I successfully block, so I know my defense is working.

## Specific Requirements

**"Hold Back" Detection Logic**

- Implement detection within `Fighter.update()` loop.
- "Back" is defined dynamically relative to the opponent:
  - If Fighter is to the Left of Opponent: "Back" is moving LEFT.
  - If Fighter is to the Right of Opponent: "Back" is moving RIGHT.
- If Fighter is moving "Back" AND Opponent is in `ATTACK` state (or effectively attacking), transition Fighter to `BLOCK` state.
- Ensure `BLOCK` state overrides `WALK` state but yields to `ATTACK` or `HIT` (if block is broken/low/high - though simple block for now).

**Block State Implementation**

- Update `Fighter.js` state machine to fully utilize the existing `FighterState.BLOCK` enum.
- Ensure the `BLOCK` animation plays while the state is active.
- Stop horizontal movement (velocity = 0) or significantly reduce it (e.g., "slow retreat") while blocking. _Decision: Stop movement to emphasize the "stand ground" feel._

**Damage Mitigation**

- Update `FightScene.checkAttack()` to check if `defender.currentState === FighterState.BLOCK`.
- If blocked:
  - Reduce damage by 80-100% (Chip damage optional, start with 100% negation for simplicity/fun).
  - Prevent `HIT` state transition (no hitstun).
  - Prevent `Knockback` physics.

**Visual Feedback**

- Play `FighterState.BLOCK` animation.
- Flash the defender Blue (tint `0x4444ff` or similar) briefly on impact to signify a successful block.
- Create a specific "Block Spark" effect (different from Hit Spark) using `HitFeedbackSystem`.

**Audio Feedback**

- Play a "Block" sound effect instead of the standard "Impact" sound.
- Use a duller "thud" or "clash" sound.

## Visual Design

No mockups provided.

- **Block Animation:** Use existing placeholder frames (Index 18).
- **Block Effect:** Blue tint flash + Particle spark (white/blue).

## Existing Code to Leverage

**`src/components/Fighter.js`**

- Reuse `FighterState` enum (already contains `BLOCK`).
- Modify `update()` to add the "Back" detection logic.
- Reuse `createAnimations` (Block animation already setup).

**`src/scenes/FightScene.js`**

- Modify `checkAttack()` to inject the damage mitigation logic.

**`src/systems/HitFeedbackSystem.js`**

- Add a `triggerBlockFeedback(defender)` method to handle the visual/audio cues for blocking.

## Out of Scope

- Special Moves (Hadoken, etc.).
- Super Meter / Super Arts.
- Throws / Unblockable Grabs.
- High/Low Block mixups (Crouch blocking matches standing block for now).
- Chip Damage (Block negates 100% damage for now).
- Guard Crush mechanics.
