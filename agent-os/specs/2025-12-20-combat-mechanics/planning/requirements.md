# Spec Requirements: Combat Mechanics

## Initial Description

From Roadmap 4.1 (Combat System):

- Special Moves
- Super Meter
- Block Mechanic
- Throw System
- Juggle System

## Requirements Discussion

### First Round Questions

**Q1:** Special Moves Input: Adapt QCF to touch gestures?
**Answer:** Defer. Keep controls simple (movement + tapping). No special moves for now.

**Q2:** Block Mechanic: Walk backwards to block?
**Answer:** Yes. "Hold Back to Block" using the existing virtual joystick. No separate buttons.

**Q3:** Throw System: Context-sensitive swipe?
**Answer:** Defer. Keep combat loop clean.

**Q4:** Super Move Activation: UI trigger?
**Answer:** Defer. Don't clutter UI.

**Q5:** Juggle Limits: Simple juggles?
**Answer:** Defer.

**Q6:** Super Meter Visuals?
**Answer:** Defer. No new UI visuals needed.

### Existing Code to Reference

- `src/systems/TouchInputController.js`: Existing virtual joystick logic.
- `src/components/Fighter.js`: Attack state management.

### Follow-up Questions

None needed. Scope is significantly simplified to focus on Blocking.

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Block Mechanic:**
  - Detect when player is holding "Back" (away from opponent) using `TouchInputController`.
  - If holding Back AND opponent is attacking, enter "Block" state.
  - Reduce or negate damage when blocking.
  - Play "Block" sound (from Phase 2.1 wishlist).
  - Show visual feedback (e.g., blue flash or distinct pose) for blocking.
- **Attack Variations (Optional/Implicit):**
  - Continue using random attack variations or simple logic (Forward + Attack) if applicable, but primary focus is Blocking.

### Reusability Opportunities

- Reuse `TouchInputController` joystick state.
- Reuse `Fighter` state machine (add `BLOCK` state).

### Scope Boundaries

**In Scope:**

- "Hold Back to Block" logic.
- Block state implementation in `Fighter.js`.
- Block visual/audio feedback.

**Out of Scope:**

- Special Moves.
- Super Meter / Super Moves.
- Throws / Grappling.
- Juggles / Air Combos.

### Technical Considerations

- **State Machine:** Need to add a defensive state that overrides idle/walk but is interrupted by attacking.
- **Direction:** "Back" is relative to opponent position. Need to check `fighter.x` vs `opponent.x`.
