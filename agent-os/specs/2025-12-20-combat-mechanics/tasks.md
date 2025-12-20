# Task Breakdown: Combat Mechanics (Blocking)

## Overview

Total Tasks: 4 Groups

## Task List

### Core Game Logic

#### Task Group 1: Fighter State & Input

**Dependencies:** None

- [x] 1.0 Implement "Hold Back to Block" logic
  - [x] 1.1 Write 2-8 focused tests for Blocking Input Logic
    - Create `tests/BlockingMechanic.test.js`
    - Test that moving away from opponent triggers `BLOCK` state
    - Test that `BLOCK` state overrides `WALK` but not `ATTACK`/`HIT`
  - [x] 1.2 Update `Fighter.js` update loop
    - Calculate "Back" direction relative to opponent (passed in or found via scene)
    - Add logic: If moving Back AND Opponent is Attacking (optional optimization) -> State = `BLOCK`
    - Start with simple logic: If moving Back -> State = `BLOCK` (simplest "Street Fighter" style)
  - [x] 1.3 Update `Fighter.js` state machine
    - Ensure `setState(FighterState.BLOCK)` stops velocity (stand ground) or slows it
    - Ensure `BLOCK` state yields to `ATTACK` (if player presses attack)
  - [x] 1.4 Ensure Fighter State tests pass
    - Run `tests/BlockingMechanic.test.js`

**Acceptance Criteria:**

- Fighter enters `BLOCK` state when walking away from opponent
- Fighter plays Block animation (Index 18)
- Movement stops or slows significantly while blocking

### Combat Logic

#### Task Group 2: Damage Mitigation

**Dependencies:** Task Group 1

- [x] 2.0 Implement Block Damage Reduction
  - [x] 2.1 Write 2-8 focused tests for Damage Calculation
    - Update `tests/BlockingMechanic.test.js`
    - Test that damage is 0 (or reduced) when defender is in `BLOCK` state
    - Test that `isHit` flag is NOT set when blocking
  - [x] 2.2 Update `FightScene.checkAttack`
    - Add check: `if (defender.currentState === FighterState.BLOCK)`
    - If true: Apply 0 damage (or 10% chip if desired later, but 0 for now)
    - If true: Skip `takeDamage` call or pass 0
    - If true: Skip `Knockback` physics
  - [x] 2.3 Ensure Combat Logic tests pass
    - Run `tests/BlockingMechanic.test.js`

**Acceptance Criteria:**

- Blocking player takes NO damage from attacks
- Blocking player does not get knocked back
- Blocking player does not enter `HIT` state

### Feedback Systems

#### Task Group 3: Visual & Audio Feedback

**Dependencies:** Task Group 2

- [x] 3.0 Implement Block Feedback
  - [x] 3.1 Write 2-8 focused tests for Feedback Triggers
    - Verify `HitFeedbackSystem` is called with "Block" context
    - Verify `AudioManager` plays block sound
  - [x] 3.2 Update `HitFeedbackSystem.js`
    - Add `triggerBlockFeedback(defender)` method
    - Implement Blue Tint Flash (0x4444ff) on defender
    - Trigger "Block Spark" (use existing spark but maybe different color/scale)
  - [x] 3.3 Update `AudioManager` hooks
    - Add `playBlock()` method (use `playImpact` with different rate or specific file if available, otherwise reuse with lower pitch)
  - [x] 3.4 Integrate into `FightScene.checkAttack`
    - Call `triggerBlockFeedback` on successful block
    - Call `playBlock` on successful block
  - [x] 3.5 Ensure Feedback tests pass
    - Run `tests/BlockingMechanic.test.js`

**Acceptance Criteria:**

- Successful block triggers Blue Flash
- Successful block plays distinct sound (or modified impact sound)
- No "Blood/Hit" particles on block

### Testing

#### Task Group 4: Integration Verification

**Dependencies:** Task Groups 1-3

- [x] 4.0 Final Verification
  - [x] 4.1 Run full feature test suite
    - Run `tests/BlockingMechanic.test.js`
    - Run `tests/FightFlow.test.js` (regression check)
  - [x] 4.2 Manual Polish Check (Self-Verify)
    - Ensure holding back feels responsive
    - Ensure block animation looks correct (not sliding)

**Acceptance Criteria:**

- All tests pass
- No regression in basic combat flow
