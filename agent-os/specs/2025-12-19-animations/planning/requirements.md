# Spec Requirements: Animations Enhancement

## Initial Description

Implement Phase 3.3 of the roadmap: Idle Breathing, Victory Poses, Defeat Animations, and Intro Animations.

## Requirements Discussion

### First Round Questions

**Q1:** Asset Strategy (New Frames)
**Answer:** The user wants to create new frames and update the sprite generation pipeline to support more expressive animations.

**Q2:** Idle Breathing
**Answer:** The user prefers creating new sprite frames for breathing rather than just procedural code-based scaling.

**Q3:** Taunt Input
**Answer:** The user decided to defer the Taunt mechanic for now.

**Q4:** Intro Sequence
**Answer:** Proposed a "Walk-in" sequence where characters move from off-screen to starting positions and perform a unique intro stance.

**Q5:** Defeat Logic
**Answer:** Proposed a "Knockdown" sequence: Airborne Hit -> Ground Crumple -> Lying Flat.

### Existing Code to Reference

- `src/components/Fighter.js`: Core state machine and animation creation logic.
- `src/scenes/FightScene.js`: Match flow (start/end) where intro and victory sequences will be triggered.
- `generate_placeholders.py`: Needs to be expanded from 18 frames to a 32-frame layout to support the new animations.

## Visual Assets

No visual assets provided. Using industry standards (Street Fighter, Guilty Gear) as mental models for animation states.

## Requirements Summary

### Functional Requirements

- **Dynamic Intro**: Characters walk into the arena before the "Fight!" announcement.
- **Improved Idle**: Smooth breathing animation (4-6 frames).
- **Victory Poses**: Unique win animation played at the end of the match.
- **Multistage Defeat**: KO'd character goes through a hit -> crumple -> flat-out sequence.

### Reusability Opportunities

- Update the `Fighter` state machine to include `INTRO`, `VICTORY`, and possibly separate `CRUMPLE` states.
- Re-use `FightScene` match flow timers to insert intro/victory beats.

### Scope Boundaries

**In Scope:**

- Updating `generate_placeholders.py` for 32 frames.
- Implementing Intro, Victory, and enhanced Defeat logic.
- Adding Idle Breathing frames.

**Out of Scope:**

- Taunt animation (deferred).
- Complex character-specific special move animations (Phase 4.1).

### Technical Considerations

- **Asset Compatibility**: Must ensure all existing characters are re-generated with the new 32-frame layout.
- **State Locking**: Ensure Intro/Victory states correctly disable player input.
