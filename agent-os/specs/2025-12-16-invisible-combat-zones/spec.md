# Specification: Invisible Combat Zones

## Goal
Implement a split-screen touch input system for mobile devices, replacing keyboard controls with an intuitive virtual joystick on the left for movement and tap/swipe gestures on the right for combat actions, including visual feedback.

## User Stories
- As a mobile player, I want to move my character by dragging my left thumb so that I can control position precisely without looking at buttons.
- As a mobile player, I want to tap the right side of the screen to attack so that I can easily fight while moving.
- As a player, I want to see a visual ripple or joystick where I touch so that I know my input is registered.

## Specific Requirements

**Touch Input Controller**
- Create `src/systems/TouchInputController.js` class.
- Enable `scene.input.addPointer(2)` to support multi-touch (Left thumb move + Right thumb attack).
- Divide screen logic: `x < width / 2` (Left Zone) vs `x > width / 2` (Right Zone).

**Virtual Joystick (Left Zone)**
- **On Touch Start:** Record "Center" position, spawn visual joystick base.
- **On Drag:** Update "Stick" position relative to Center.
- **Logic:**
  - Delta X > Threshold: Walk Right.
  - Delta X < -Threshold: Walk Left.
  - Delta Y < -Threshold: Jump.
  - Delta Y > Threshold: Crouch.
- **On Release:** Reset movement signals to 0/False, hide/reset joystick visual.

**Combat Gestures (Right Zone)**
- **Tap:** Trigger `Attack` action.
- **Swipe Up:** Trigger `Jump` (redundant but requested flexibility).
- **Swipe Down:** Trigger `Crouch` (redundant but requested flexibility).

**Visual Feedback**
- Implement `src/components/TouchVisuals.js` (or internal helper).
- **Joystick:** 2 Circle Graphics (Base + Stick) that appear on touch.
- **Ripple:** Translucent circle tweening scale/alpha at tap location for Right Zone.

**Integration**
- Update `src/scenes/FightScene.js` to instantiate `TouchInputController`.
- Map `TouchInputController` outputs to `Fighter.setControls()` interface (mocking the `cursors` and `keys` structure used by Keyboard).
- Ensure `Fighter.js` can accept these synthetic inputs (boolean flags for up/down/left/right/attack).

## Visual Design
*No mockups provided. Using standard programmatic shapes.*

- **Joystick:** Semi-transparent white circle (Base) + Smaller solid circle (Stick).
- **Ripple:** Cyan/White ring that fades out quickly.

## Existing Code to Leverage

**`src/scenes/FightScene.js`**
- Existing `create()` method initializes inputs. We will replace/augment the Keyboard logic here.
- `Fighter.setControls` expects an object with `isDown` properties. We need to mimic this API.

**`src/components/Fighter.js`**
- `update()` method reads `this.cursors.left.isDown`, etc. Our Touch Controller should produce a compatible state object.

## Out of Scope
- Gamepad/Controller support.
- Configurable settings for sensitivity or left/right swap.
- Complex gestures (Z-motions, quarter-circles).
