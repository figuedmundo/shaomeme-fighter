# Specification: Rose Border Animation

This specification outlines the implementation of a procedural rose border animation for the Credits Scene.

## 1. Objective

Create a visually pleasing, procedurally generated animation of roses growing and blooming along the side borders of the screen during the "Letter" phase of the Credits.

## 2. Visual Design

### The Rose

- **Construction:** Use `Phaser.Graphics`.
- **Petals:** Multiple overlapping circles or ellipses, rotated around a center point.
- **Color:** Deep Red (`0xcc0000`) to Bright Red (`0xff3333`) gradients (simulated with overlapping filled shapes).
- **Bloom Animation:** Start with scale 0.1 (bud) and tween to scale 1.0 (full bloom) while slightly rotating.

### The Stem (Tallo)

- **Construction:** `Phaser.Curves.Spline` or `CubicBezier` drawn via `Graphics`.
- **Color:** Green (`0x006600`).
- **Growth Animation:** Draw the curve progressively over time (using a "percentage complete" variable).
- **Thorns:** Small triangles or lines along the stem (optional for "beauty", maybe skip for simplicity/elegance).

### The Layout

- **Left Border:** Stems grow upwards or meanderingly from bottom-left or mid-left.
- **Right Border:** Mirrored or independent growth along the right side.
- **Loop:**
  1.  Stem starts growing.
  2.  As stem reaches certain points, Rose buds appear.
  3.  Roses bloom.
  4.  Entire vine fades out.
  5.  New vine starts growing (possibly with randomized curve parameters).

## 3. Technical Implementation

### New Component: `RoseGenerator` (or similar helper)

Since this logic might be complex, we'll encapsulate it.

- **File:** `src/components/RoseBorder.js` (New file)
- **Class:** `RoseBorder extends Phaser.GameObjects.Container` (or just a manager class).
- **Methods:**
  - `grow(x, y)`: Starts a growth sequence at origin.
  - `update()`: Handles continuous drawing if needed (though Tweens are preferred).
  - `destroy()`: Cleanup.

### Animation Logic

- Use `Phaser.Tweens` to control:
  - **Stem Progress:** A value from 0 to 1. In `update()`, draw the curve up to this percentage.
  - **Rose Scale:** Scale from 0 to 1.
  - **Alpha:** Fade in/out.

### Integration in `CreditsScene.js`

- Instantiate `RoseBorder` in `create()`.
- Call `roseBorder.start()` when the Letter phase begins.
- Call `roseBorder.stop()` or `fadeOut()` when transitioning to the standard credits.

## 4. Implementation Plan

### Step 1: Create `RoseBorder.js`

- Implement basic `Graphics` setup.
- Implement `drawRose(x, y, scale, rotation)` method.
- Implement `drawStem(points, progress)` method.

### Step 2: Implement Growth Logic

- Create a `grow()` method that generates a random path along the specified side.
- Chain tweens: Stem Growth -> Rose Bloom -> Hold -> Fade Out -> Restart.

### Step 3: Integrate into `CreditsScene`

- Add to the scene during the Letter phase.
- Ensure it sits behind or nicely frames the text (check z-index).

## 5. Verification Plan

### Automated Tests

- Test that `RoseBorder` can be instantiated.
- Test that `start()` creates tweens.
- Test that cleanup works (no memory leaks).

### Manual Verification

- Visual check: Does it look like a rose? Is the motion smooth?
- Performance check: Does it impact FPS? (Graphics redrawing every frame can be heavy; might need optimization like drawing to a RenderTexture if it gets slow, but for simple lines/circles it should be fine).
