# Specification: Signature Victory Portrait

## Goal

Replace the generic HUD portrait scaling effect on victory with a unique, stylized "Signature Victory Picture" (dynamic action pose) that slides in from the winner's side of the screen, creating a dramatic visual reward.

## User Stories

- As a player, I want to see a cool, unique image of my character when I win, so the victory feels more rewarding.
- As a player, I want the victory image to appear on my side of the screen (Left/Right) so I clearly know who won.
- As a player, I want to see the in-game characters standing in front of this image, so it feels like part of the scene depth.

## Specific Requirements

**Config & Assets**

- Update `rosterConfig.js` to include a `victoryPath` property for each character, pointing to `/assets/fighters/{id}/victory.png`.
- Ensure this new asset is preloaded (or lazy loaded) alongside other character assets.

**UI Logic: Show Victory**

- Modify `UIManager.showVictory(winnerNum)` to stop scaling the HUD portrait.
- Instead, create a new `Phaser.GameObjects.Image` using the `victoryPath` texture.
- **Positioning:**
  - If P1 wins: Position on the LEFT half of the screen.
  - If P2 wins: Position on the RIGHT half of the screen.
  - Center the image vertically.
- **Scaling:** Scale the image to fit 80-90% of the screen height, maintaining aspect ratio.

**Animation & Transition**

- **Slide In:** The image should start off-screen (Left edge for P1, Right edge for P2) and slide into position using a smooth tween (e.g., `Back.easeOut` or `Power2`).
- Duration: Approx 500-800ms.

**Layering (Depth)**

- The Victory Image must be rendered **behind** the fighters but **in front** of the stage background.
- Set `depth` to a low positive value (e.g., 5 or 10) to ensure it sits below the Fighter sprites (typically depth 100+) and UIManager (depth 1000+).
- Note: `UIManager` usually adds elements to the Scene, but often sets high depth. This element should explicitly set a lower depth.

## Visual Design

- **Style:** "Dynamic Action Pose" (user preference).
- **No Background Dimming:** The game world remains fully lit (or uses existing victory spotlight logic). The image is an additive element.

## Existing Code to Leverage

**`src/config/rosterConfig.js`**

- Add `victoryPath` field to the roster definition.

**`src/systems/UIManager.js`**

- Modify `showVictory` method.
- Reuse `this.scene.add.image` logic.
- Reuse `this.scene.tweens.add` for the animation.

**`src/scenes/LoadingScene.js` (or Preload)**

- Update the asset loader to fetch `victoryPath`.

## Out of Scope

- Creating final high-res artwork (placeholders will be used).
- Changing the post-match "Victory Slideshow" logic (photo rewards).
- Adding new audio specific to this image popup.
