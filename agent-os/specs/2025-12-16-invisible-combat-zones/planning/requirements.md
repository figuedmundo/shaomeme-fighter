conti# Spec Requirements: Invisible Combat Zones

## Initial Description
Implement split-screen touch input handling for mobile/tablet (Tap/Swipe to attack/move) to replace keyboard input.

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want the screen divided into two large invisible touch zones: the Left Half for movement (Joystick emulation) and the Right Half for combat actions (Tap to Attack, Swipe to Jump/Crouch). Is that correct, or did you have a different layout in mind?
**Answer:** You are correct, also advice according best configuration and standards of the industry.

**Q2:** I assume we should add temporary visual cues (like a translucent circle or ripple) where the user touches so they know their input was registered. Is that correct?
**Answer:** Yes.

**Q3:** I assume Tap = Light Attack, Swipe Up = Jump, Swipe Down = Crouch, and Swipe Left/Right = Dash/Walk. Is that correct?
**Answer:** Yes.

**Q4:** I assume we should prioritize landscape mode responsiveness for these devices (iPad 11", iPhone 13). Is that correct?
**Answer:** Yes, basically my girlfriend uses ipad 11" or iphone 13, so lets optimize for those.

**Q5:** I assume we need to support multi-touch so the player can move (left hand) and attack (right hand) simultaneously. Is that correct?
**Answer:** Yes.

## Visual Assets

### Files Provided:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- **Split-Screen Touch Layout:**
  - **Left Zone (0-50% width):** Handles Movement.
    - Drag/Hold Left: Walk Left.
    - Drag/Hold Right: Walk Right.
    - Swipe Up: Jump.
    - Swipe Down: Crouch.
    - *Industry Standard Advice:* Instead of purely gestures for movement, a "Floating Virtual Joystick" is often preferred for precision (wherever you touch becomes the center). We will implement a "Floating Joystick" logic for the left side for better control.
  - **Right Zone (50-100% width):** Handles Combat.
    - Tap: Attack (Light).
    - Long Press (or specific gesture): Heavy Attack (optional, stick to Tap for now as per Q3).
    - *Note:* User agreed to Swipes for Jump/Crouch on right side in Q1/Q3, but standard mobile fighters usually reserve Right side *purely* for attack buttons and Left side for *all* movement (including Jump/Crouch).
    - *Decision:* We will map **Left Side = Movement (Walk/Jump/Crouch)** and **Right Side = Combat (Attack)** to follow standard conventions (like *Skullgirls Mobile* or *Contest of Champions*), but we will support the "Swipe Up" on the Right side for jumping if the user specifically requested "Swipe to Jump" in the context of the Right side.
    - *Refined Logic:* 
      - Left: Virtual Joystick (Walk L/R, Jump Up, Crouch Down).
      - Right: Tap = Attack.
- **Multi-Touch:** Enable `input.addPointer(2)` in Phaser to track at least 2 simultaneous touches.
- **Visual Feedback:**
  - Spawn a temporary, translucent graphic (circle/ripple) at `pointer.x, pointer.y` on touch start.
  - Draw a "Virtual Joystick" base and stick on the left side when dragging.
- **Device Optimization:**
  - Force Landscape mode (via CSS or Phaser Scale Manager advice).
  - Scale config already set to `FIT`, ensuring coverage on iPad 11" and iPhone 13.

### Reusability Opportunities
- Logic can be encapsulated in a `TouchInputController` class, decoupled from the specific `Fighter` instance.

### Scope Boundaries
**In Scope:**
- Implementing the `TouchInputController`.
- Visualizing touch inputs (Ripples/Joystick).
- Mapping touch events to the existing `Fighter` control methods (`moveLeft`, `jump`, `attack`).
- Multi-touch support.

**Out of Scope:**
- Complex gesture combos (e.g., "Z" shape for Dragon Punch).
- Physical Gamepad support.
- Configurable layout UI (settings menu).

### Technical Considerations
- **Phaser Input:** Use `scene.input.on('pointerdown')`, `pointermove`, `pointerup`.
- **Pointers:** Use `pointer.id` to track which finger is doing what (Left vs Right).
- **CSS:** Ensure `touch-action: none` is set on the canvas to prevent browser scrolling/zooming.
