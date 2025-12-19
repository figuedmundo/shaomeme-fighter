# Specification: Animations Enhancement

## Goal

Implement Phase 3.3 of the roadmap to enhance visual fidelity through smooth idle breathing, cinematic intro walk-ins, unique victory poses, and a multi-stage knockdown system for defeats.

## User Stories

- As a player, I want to see characters breathing while idle so that the game feels alive and expressive.
- As a player, I want to see a dramatic intro sequence at the start of each match so that I feel immersed in the arcade fighting experience.
- As a winner, I want to see my character perform a victory pose so that my win feels rewarding and impactful.

## Specific Requirements

**Asset Pipeline Expansion**

- Update `generate_placeholders.py` to increase total frames from 18 to 32 per spritesheet.
- Re-generate all character assets in `assets/fighters/` to match the new 32-frame layout.
- Define new frame indices for Intro (4), Victory (4), Crumple (2), and expanded Idle (6).

**Smooth Idle Breathing**

- Increase Idle frame count to 6 frames for a more fluid "breathing" effect.
- Update `Fighter.createAnimations` to map the new 6-frame range for the `idle` state.

**Cinematic Intro Sequence**

- Implement a `walk-in` sequence in `FightScene.startRoundSequence`.
- Characters start off-screen and walk to their designated starting positions (P1: 300, P2: width-300).
- Play a 4-frame `intro` animation once they reach their positions before the "Round 1" announcement.
- Lock player input during the entire intro sequence.

**Unique Victory Poses**

- Implement a 4-frame `victory` animation state in `Fighter.js`.
- Trigger the victory animation for the winning character in `FightScene.checkWinCondition` after the KO announcement.
- Ensure the losing character remains in their final defeat state during the winner's pose.

**Multi-stage Defeat (Knockdown)**

- Replace the immediate transition to the `DIE` frame with a multi-stage sequence.
- **Stage 1: Knockdown**: If lethal damage is taken, apply a small vertical and horizontal knockback velocity.
- **Stage 2: Crumple**: Play a 2-frame "impact/crumple" animation when the character hits the floor.
- **Stage 3: Flat-out**: Transition to the final "Lying Flat" frame (previously `DIE`) after the crumple animation completes.

**Fighter State Machine Update**

- Add `INTRO`, `VICTORY`, and `CRUMPLE` states to the `FighterState` enum.
- Ensure these states are "committed" (cannot be interrupted by movement or attacks) except for `HIT` or `DIE` if applicable.

**Match Flow Integration**

- Refactor `FightScene.startRoundSequence` to accommodate the walk-in and intro stance timing.
- Refactor `FightScene.checkWinCondition` to time the victory pose with the announcer and slideshow.

## Existing Code to Leverage

**`generate_placeholders.py`**

- Modify the `actions` array and `total_frames` constant to include new animation states.
- Re-run the script to update all placeholder assets in the project.

**`src/components/Fighter.js`**

- Extend the `FighterState` enum and `createAnimations` mapping logic.
- Utilize the `animationcomplete` listener to transition from `CRUMPLE` to the final death frame.

**`src/scenes/FightScene.js`**

- Use `this.time.delayedCall` and character movement logic in `startRoundSequence` to orchestrate the intro.
- Leverage existing winner detection in `checkWinCondition` to trigger victory animations.

## Out of Scope

- Taunt animation (deferred per user request).
- Character-specific special move animations (reserved for Phase 4.1).
- Complex physics-based ragdoll effects (sticking to frame-based animations).
- Custom intro/victory animations per character (placeholders will be uniform for now).
