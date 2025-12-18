# Specification: Movement Feel

## Goal

Implement polished movement feedback effects (dust, shadows, squash/stretch, afterimages) to make 3D-rendered characters feel grounded and responsive on mobile devices, enhancing the "game juice" without compromising performance or visual style.

## User Stories

- As a player, I want to see dust when my character lands or dashes so that movements feel weighty and impactful.
- As a player, I want to see a shadow beneath my character so that I can judge their position relative to the ground.
- As a player, I want to see subtle squash and stretch animation so that jumps and hits feel more dynamic and alive.
- As a player, I want to see afterimages during fast moves so that high-speed actions are clearly visible and exciting.

## Specific Requirements

**Dust Particle System**

- Create a `DustSystem` class extending Phaser's particle system or managing multiple emitters.
- Spawn small, dissipating "cloud" sprites (white/gray circles or distinct dust textures).
- Trigger dust burst on: Jump Landing (medium burst), Dash Start (small directional burst), Heavy Knockdown (large burst).
- Ensure dust particles fade out and shrink over 200-400ms.
- Use object pooling to prevent garbage collection stutter.

**Soft Shadow System**

- Implement a `ShadowSystem` that manages a shadow sprite for each fighter.
- Shadow visual: A soft, semi-transparent black radial gradient (blob), not a hard oval.
- Positioning: Lock shadow X to fighter X, lock Y to the "ground" level (ignoring jumps).
- Scaling: Shadow scale scales inversely with fighter height (smaller/fainter when jumping high).
- Visibility: Hide shadow when fighter is "dead" or off-screen if needed.

**Squash and Stretch**

- Extend `Fighter` class or create an `AnimationEnhancer` component.
- Apply `scaleY` and `scaleX` modifications during specific state transitions.
- Jump Takeoff: Stretch Y (1.05), Squash X (0.95) for 100ms.
- Jump Landing: Squash Y (0.9), Stretch X (1.1) for 100ms, then return to normal.
- Heavy Hit/Knockdown: Brief deformation to emphasize impact.
- Use tweens for smooth transitions back to scale 1.0.

**Ghost Afterimages**

- Implement `AfterimageSystem` to spawn static frame copies of the fighter.
- Trigger: During "Dash" state or "Special Move" state.
- Effect: Create a clone sprite at fighter's position with 50% opacity, fade to 0 over 300ms.
- Frequency: Spawn one ghost every 3-5 frames during rapid movement.
- Tint: Optional single-color tint (e.g., blue for dash) to distinguish from active fighter.

**Performance & Integration**

- Create a `MovementFXSystem` manager scene or class to coordinate these effects.
- Hook into `Fighter.js` state changes (e.g., `setState` method) to trigger effects automatically.
- Ensure all particle/sprite pools are pre-allocated in `create()`.
- Destroy/disable effects cleanly on scene shutdown.

## Visual Design

_No specific visual assets provided. Implementation will rely on procedural generation (graphics) or standard placeholder assets matching the 3D sprite aesthetic._

## Existing Code to Leverage

**`src/systems/HitFeedbackSystem.js`**

- Reuse `createHitSparkEmitter` logic for creating the dust particle emitter (texture generation, physics properties).
- Adapt the `HitFeedbackSystem` structure (constructor, destroy, event triggering) for the new `MovementFXSystem`.

**`src/components/Fighter.js`**

- Hook into `setState(newState)` method to detect `JUMP` (takeoff), `IDLE` (landing from jump), and `ATTACK` states.
- Use `this.scene.tweens.add` pattern from `spawnDamageNumber` for handling squash/stretch recovery tweens.
- Use `this.body.blocked.down` check in `update()` to detect the exact frame of landing for dust triggers.

**`src/config/gameConfig.js`**

- Reference global gravity or physics debug settings if needed for shadow positioning logic.

## Out of Scope

- Continuous walking dust trails (clutter).
- Realistic, projected, or light-source-dependent shadows.
- Shader-based motion blur or full-screen blur effects.
- Camera tilts, leans, or dynamic zooms (reserved for other tasks).
- Environment-specific dust colors (e.g., mud vs. concrete) - stick to generic white/gray for now.
- User-facing toggle for these effects (must be always-on and performant).
