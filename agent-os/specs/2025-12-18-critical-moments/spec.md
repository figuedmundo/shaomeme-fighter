# Specification: Critical Moments

## Goal

Enhance dramatic impact and tension through cinematic effects during key gameplay events: round start, low health state, and the final knockout blow.

## User Stories

- As a player, I want the camera to zoom in before the round starts so I feel focused on the confrontation.
- As a player, I want a visual indicator when my health is critically low so I feel the urgency to fight back.
- As a player, I want the game to freeze and slow down when I land a knockout blow so I can savor the victory.
- As a player, I want a dramatic pause on the final hit so the impact feels heavier than normal hits.

## Specific Requirements

**Round Start Zoom**

- Camera starts at **1.25x zoom**, centered between fighters during "READY".
- Smoothly zooms out to **1.0x** over **600ms** immediately when "FIGHT!" appears.
- Must ensure fighters remain on screen even at 1.25x zoom (clamp bounds if necessary).
- Must handle window resizing gracefully during the zoom.

**Low Health Visuals (Danger Pulse)**

- Global red vignette overlay (using a Graphics object or HUD image) covering the screen edges.
- Triggered when **any** fighter's health drops below **20%**.
- **Pulse Behavior**: Alpha oscillates between 0.0 and 0.3.
- **Dynamic Frequency**:
  - 20% - 5% HP: Slow pulse (1.5s period).
  - < 5% HP: Fast, frantic pulse (0.6s period).
- Must sit above the game world but below the HUD/UI layer.

**Lethal Hit Freeze (Super Hit Stop)**

- Detect when a hit will reduce opponent HP to ≤ 0.
- Trigger a **500ms full pause** (physics & animations) immediately on impact.
- This overrides the standard hit stop (which is usually ~60-100ms).

**Slow Motion Final Hit**

- Immediately following the "Lethal Hit Freeze", set the game time scale to **0.3 (30% speed)**.
- Maintain slow motion for **2.0 seconds**.
- Return time scale to **1.0** automatically before the Victory Slideshow begins.
- Audio pitch should remain normal (if possible) or strictly ignored for now.

## Visual Design

No visual assets provided.

- **Red Vignette**: Procedural radial gradient (transparent center, red edges) created via Phaser `Graphics`.

## Existing Code to Leverage

**`src/systems/HitFeedbackSystem.js`**

- Reuse `hitStop()` logic: Extend it to accept a custom duration for the lethal freeze.
- Reuse `flashFighter()`: Can be triggered during the lethal freeze for extra impact.

**`src/scenes/FightScene.js`**

- Use `this.cameras.main` for the Zoom effects.
- Use `update()` loop to check `player1.health` and `player2.health` for the Danger Pulse.
- Use `checkWinCondition()` or `checkAttack()` to trigger the Lethal Hit logic.

**`src/systems/MovementFXManager.js`**

- Reference this for how to organize the new "CriticalMomentsManager" system to keep `FightScene` clean.

## Out of Scope

- Character-specific cinematic intros or super move camera cuts.
- Audio pitch shifting during slow motion.
- "Shattered glass" or complex shader effects for the KO.
- Replays or "Instant Replay" functionality.
- Changes to the actual fighting mechanics (damage values, frame data).
