# Spec Requirements: Movement Feel

## Initial Description

Task 1.2 from roadmap:

- Dust Particles: Spawn dust clouds when landing, dashing, or turning
- Character Shadows: Dynamic oval shadows beneath fighters
- Squash & Stretch: Slight deformation on jumps/lands for more life
- Motion Blur Trails: On fast movements/special attacks

## Requirements Discussion

### First Round Questions

**Q1:** Should dust appear only on landings/dashes, or also while walking?
**Answer:** No continuous walking dust. Dust remains event-based only (jump landing, dash start, abrupt direction change, heavy ground attacks). Continuous dust would obscure 3D sprites and overload small screens.

**Q2:** Classic oval or more realistic drop shadow?
**Answer:** Neither. Use a modern soft contact shadow blob. 3D-rendered sprites rule out primitive ovals and realistic drop shadows (lighting mismatch). This ensures symbolic grounding and lighting-agnostic consistency.

**Q3:** 5–10% deformation? Apply to everything or only heavy moves?
**Answer:** Yes, 5–10%. Apply only to force-based actions (jump takeoff/landing, heavy attacks, knockdowns). Selective use preserves the "solid" 3D illusion. Never apply to idle, walk, or light punches.

**Q4:** Ghosting afterimages vs shader blur?
**Answer:** Ghosting afterimages only. Shader blur conflicts with pre-lit 3D sprites and hurts mobile performance. Afterimages preserve silhouette clarity and feel arcade-authentic.

**Q5:** Toggle effects off, or keep always-on?
**Answer:** Always on. Internally scalable (auto-reduce particle count, shadow opacity, etc.) but no user-facing toggle. 3D sprites demand visual cohesion.

**Q6:** Any other movement-related visual effects that you specifically don’t want?
**Answer:** Explicitly excluded: Directional lighting, screen tilt/camera lean, wind streaks, shader-based blur, dynamic shadows, and environment-reactive lighting. These belong to combat impact, not movement juice.

### Existing Code to Reference

- **HitFeedbackSystem.js**: Reference for particle implementation and timing patterns.
- **Fighter.js**: Reference for state machine hooks to trigger movement effects.

### Follow-up Questions

No follow-up questions were required.

## Visual Assets

### Files Provided:

No visual files found.

### Visual Insights:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Dust System**: Spawn particle clouds on landing, dashing, and abrupt turns.
- **Shadow System**: Implement a soft, semi-transparent blob shadow that tracks the fighter's X position but stays grounded.
- **Deformation System**: Apply subtle scale-based squash and stretch (5-10%) during high-impact movement frames.
- **Afterimage System**: Create fading ghost trails behind characters during fast movements (dashes/heavy attacks).

### Reusability Opportunities

- Reuse particle patterns from `HitFeedbackSystem.js`.
- Leverage existing state machine in `Fighter.js` to detect movement transitions.

### Scope Boundaries

**In Scope:**

- Event-based dust particles (landing, dash, turn).
- Soft contact shadow blobs (grounded).
- Selective squash and stretch (force-based).
- Ghosting afterimages for high-velocity moves.
- Automated performance scaling for mobile.

**Out of Scope:**

- Continuous walking dust.
- Realistic or dynamic light-based shadows.
- Shader-based motion blur.
- Camera-based movement effects (tilt/lean).
- Environment-reactive lighting.

### Technical Considerations

- **Mobile First**: All effects must be optimized for iPad Safari.
- **3D Aesthetic**: Effects must complement the 3D-rendered sprite style without breaking the illusion of solidity.
- **Performance**: Use object pooling for particles and afterimages to avoid GC spikes.
