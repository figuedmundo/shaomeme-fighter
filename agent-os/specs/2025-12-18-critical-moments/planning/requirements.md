# Spec Requirements: Critical Moments

## Initial Description

Enhance the game's dramatic impact with effects like Slow Motion Final Hit, Victory Freeze, Round Start Zoom, and Low Health Visuals.

## Requirements Discussion

### First Round Questions & Suggested Defaults

**Q1: Slow Motion timing?**
**Answer:** Drop game speed to 30% for 2 seconds upon lethal blow landing, then return to normal for victory pose.

**Q2: Victory Freeze placement?**
**Answer:** A 500ms "Super Hit Stop" (full freeze) immediately on the impact of the final blow, preceding the slow motion.

**Q3: Round Start Zoom intensity?**
**Answer:** Zoom to 1.25x during "READY", smoothly zoom back to 1.0x over 600ms when "FIGHT!" starts.

**Q4: Low Health Visual behavior?**
**Answer:** Procedural red vignette/border pulse. Frequency increases as health drops (1.5s period at 20% HP, 0.6s at 5% HP).

**Q5: Local or Global?**
**Answer:** Global screen effect triggered if either fighter is in the danger zone (<20% HP).

**Q6: Exclusions?**
**Answer:** Exclude character-specific cinematic zooms or camera rotations for this phase.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Hit Feedback - Path: `src/systems/HitFeedbackSystem.js` (Reference for `hitStop` and camera shake).
- Feature: Movement FX - Path: `src/systems/MovementFXManager.js` (Reference for system coordination).
- Feature: Fight Scene - Path: `src/scenes/FightScene.js` (Reference for camera control and health tracking).

## Visual Assets

No visual assets provided. Procedural effects (Phaser Graphics/Tweens) will be used for the red vignette.

## Requirements Summary

### Functional Requirements

- **KO Slowdown**: Modify time scale or use a custom slow-motion timer on lethal hits.
- **Lethal Hit Freeze**: Extend existing hit-stop logic for a longer "impact" pause on the final blow.
- **Dynamic Camera Zoom**: Programmatic camera zoom in/out during round start sequence.
- **Danger Pulse**: UI overlay (vignette) that modulates alpha based on health thresholds.

### Reusability Opportunities

- Use `HitFeedbackSystem` as a base for the lethal hit freeze.
- Use `FightScene`'s existing update loop to monitor health for the pulse effect.

### Scope Boundaries

**In Scope:**

- Slow motion on KO.
- Extended freeze on lethal hit.
- Round start camera zoom.
- Low health red pulse overlay.

**Out of Scope:**

- Special move cinemantics.
- Camera rotations or field-of-view changes.
- Player-specific HUD shaking (staying with global effects).

### Technical Considerations

- Phaser 3 `cameras.main.zoom` for the zoom effects.
- Tweening `timeScale` or using `scene.time` delayed calls for the slow motion.
- `Graphics` or `Image` object pinned to the camera for the vignette.
