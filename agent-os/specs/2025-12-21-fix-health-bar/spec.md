# Specification: Smooth Health Bar Fix

## Goal

Fix the issue where health bars do not visually decrease when characters are hit and ensure the depletion animation is smooth and impactful.

## User Stories

- As a player, I want to see a character's health bar decrease immediately when they are hit so I have instant feedback on my attack's impact.
- As a player, I want the health bar decrease to be smooth (ghost bar effect) so the combat feels professional and polished.

## Specific Requirements

**Fix Health Bar Visual Update**

- Ensure `UIManager.update()` is called within `FightScene.update()` to enable the frame-by-frame lerping of health bars.
- Guarantee that health bars are redrawn every time `update()` detects a change in health or ghost health.

**Enable Smooth Ghost Bar Effect**

- Use the existing "ghost bar" (white/damage lag bar) logic to show the original health level before it was hit.
- Implement a smooth lerp (linear interpolation) of the ghost bar down to the new current health value.
- The ghost bar should start its descent after a very brief delay (e.g., during or immediately after hit stop) to make damage feel "heavy".

**Immediate Feedback Redraw**

- Modify `UIManager.updateHealth()` to trigger an immediate `drawHealthBars()` call.
- This ensures the colored health bar (green/yellow/red) updates instantly on impact, while the white ghost bar begins its smooth depletion.

**Visual Polish and Consistency**

- Maintain the slanted, arcade-style design of the health bars.
- Ensure the color transitions (Green > 50%, Yellow > 20%, Red <= 20%) occur correctly as the health bar depletes.
- Verify that portraits shake correctly on hit as part of the health update feedback.

**Testing and Performance**

- Ensure the health bar updates don't cause performance drops (60 FPS target).
- Verify that health bars behave correctly for both Player 1 and Player 2 (AI).

## Existing Code to Leverage

**`src/systems/UIManager.js`**

- Already contains `update()`, `updateHealth()`, and `drawHealthBars()` methods.
- Includes the `p1GhostHealth` and `p2GhostHealth` properties and the logic to lerp them using `Phaser.Math.Linear`.

**`src/scenes/FightScene.js`**

- The main update loop where `this.uiManager.update()` must be added.
- The place where `takeDamage` is called on fighters, which in turn calls `uiManager.updateHealth()`.

**`src/components/Fighter.js`**

- The `takeDamage` method which updates the internal health state and informs the `UIManager`.

## Out of Scope

- Adding new UI elements like mana bars or special meters.
- Redesigning the health bar shapes or positions.
- Modifying the damage calculation logic itself.
