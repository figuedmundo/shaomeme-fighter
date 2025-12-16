# Task Breakdown: Invisible Combat Zones

## Overview
Total Tasks: 4

## Task List

### Core Input Logic

#### Task Group 1: TouchInputController Class
**Dependencies:** None

- [x] 1.0 Implement Touch Controller Logic
  - [x] 1.1 Create `src/systems/TouchInputController.js`
    - Setup class structure accepting `scene` in constructor.
    - Enable multi-touch: `scene.input.addPointer(2)`.
    - Setup internal state object `{ left: false, right: false, up: false, down: false, attack: false }`.
  - [x] 1.2 Implement Input Listeners
    - `pointerdown`: Detect Left vs Right zone.
      - Left: Init Virtual Joystick center.
      - Right: Trigger Attack (Tap) or record start for Swipe.
    - `pointermove`: Update Joystick delta (Left) or track Swipe direction (Right).
    - `pointerup`: Reset Joystick (Left) or Execute Swipe Action (Right).
  - [x] 1.3 Implement Virtual Joystick Logic
    - Calculate delta X/Y from touch start.
    - Threshold check (e.g., > 20px) to trigger Left/Right/Up/Down state.
  - [x] 1.4 Expose Control Interface
    - Add `getCursorKeys()` method returning an object compatible with Phaser's `createCursorKeys` (isDown properties).
    - Add `getAttackKey()` method returning object with `isDown` property.

**Acceptance Criteria:**
- Controller accurately tracks pointers in Left/Right zones.
- `getCursorKeys` returns correct boolean states based on pointer movement.
- Multi-touch works (Moving Left + Attacking Right).

### Visual Feedback

#### Task Group 2: Touch Visuals
**Dependencies:** Task Group 1

- [x] 2.0 Implement Visual Feedback
  - [x] 2.1 Create Joystick Graphics
    - Draw "Base" (Circle) at touch start position (Left Zone).
    - Draw "Stick" (Small Circle) at current pointer position (clamped to radius).
    - Hide on release.
  - [x] 2.2 Implement Ripple Effect
    - Create a reusable "Ripple" object (Ring) that spawns at `pointerdown` coords (Right Zone).
    - Tween scale up and alpha down, then destroy.

**Acceptance Criteria:**
- Joystick appears under finger on Left side.
- Stick follows finger within limits.
- Taps on Right side spawn visible ripples.

### Integration

#### Task Group 3: Scene Integration
**Dependencies:** Task Group 2

- [x] 3.0 Connect to FightScene
  - [x] 3.1 Update `src/scenes/FightScene.js`
    - Instantiate `TouchInputController`.
    - Detect mobile device (or force enabled for testing).
  - [x] 3.2 Map to Player 1
    - Replace/Augment `this.player1.setControls` to use `touchController.getCursorKeys()` and `touchController.getAttackKey()`.
  - [x] 3.3 CSS Optimization
    - Ensure `canvas` or `body` has `touch-action: none` to prevent scrolling.

**Acceptance Criteria:**
- Player 1 moves and attacks using touch.
- Keyboard controls can still work (optional, or replaced).
- No browser scrolling when dragging on canvas.

### Verification

#### Task Group 4: Touch Verification
**Dependencies:** Task Group 3

- [x] 4.0 Verify Touch Interactions
  - [x] 4.1 Test Virtual Joystick
    - Verify Walk Left/Right, Jump (Up), Crouch (Down).
    - Verify Joystick resets on release.
  - [x] 4.2 Test Combat Gestures
    - Verify Tap triggers Attack.
    - Verify Swipe Up triggers Jump (if implemented as redundant).
  - [x] 4.3 Test Multi-Touch
    - Walk + Attack simultaneously.
    - Jump + Attack simultaneously.

**Acceptance Criteria:**
- Fluid control matching the "Invisible Combat Zones" vision.
- Visuals align with inputs.

## Execution Order
1. TouchInputController Class
2. Touch Visuals
3. Scene Integration
4. Touch Verification
