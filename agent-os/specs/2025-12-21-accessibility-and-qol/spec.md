# Specification: Accessibility & QoL

## Goal

Implement essential "quality of life" features to improve player onboarding and session flow, specifically focusing on mobile usability and rapid replayability.

## User Stories

- As a **new player**, I want to see a **tutorial overlay** on my first match so that I understand the invisible touch controls.
- As a **player**, I want to **pause the game** mid-fight so that I can take a break or adjust settings without losing progress.
- As a **competitive player**, I want to **instantly rematch** after a fight so that I can try again without navigating the full menu.
- As a **mobile player**, I want to see **visual indicators** for touch zones so that I know where to place my thumbs.

## Specific Requirements

**Touch Control Tutorial**

- **Trigger**: Display automatically ONLY on the very first start of `FightScene` (check `localStorage` key `has_seen_tutorial`).
- **Visuals**: Full-screen semi-transparent black overlay (0.8 alpha) with white text/icons.
- **Content**:
  - Left side: "SWIPE to Move / Jump / Crouch" icon/text.
  - Right side: "TAP to Attack", "HOLD Back to Block" icon/text.
  - Bottom: "Tap anywhere to Start".
- **Behavior**: Pauses the underlying scene. Dismisses on any screen tap. Sets `localStorage` flag.

**Pause Menu**

- **Trigger**: Small "Pause" icon/button in the top-right corner of the HUD (z-index high).
- **Mechanism**: specific Phaser command `this.scene.pause('FightScene')` and `this.scene.launch('PauseScene')`.
- **UI**: Centered modal box with "Press Start 2P" font.
- **Options**:
  - **Resume**: Closes menu, resumes `FightScene`.
  - **Audio**: Toggle switch (Mute/Unmute) affecting global Phaser sound.
  - **Quit**: Exits to `MainMenuScene`.
- **Safety**: Ensure inputs (punches/kicks) are blocked when interacting with the pause menu.

**Rematch Option**

- **Location**: `VictoryScene` (and any future Game Over screen).
- **UI**: Button labeled "REMATCH" styled similarly to "CLAIM REWARD" but distinct (e.g., Blue or Orange).
- **Behavior**: Immediately restarts `FightScene` with the _exact same_ configuration (Fighters, Arena, CPU difficulty) as the previous match.
- **Transition**: Fast fade-out/fade-in (faster than standard menu transition).

**Gesture Indicators**

- **Visuals**: Two subtle, vertical gradient overlays on the left and right edges of the screen (width ~15-20% of screen).
- **Style**:
  - Left (Move): Blue tint, very low opacity (0.1).
  - Right (Combat): Red tint, very low opacity (0.1).
- **Feedback**: "Always on" for now to guide thumb placement.
- **Layering**: Rendered behind the HUD but above the game world (if possible) or part of the HUD scene.

## Visual Design

_No mockups provided. Using existing "Arcade" aesthetic._

## Existing Code to Leverage

**`src/scenes/MainMenuScene.js`**

- Reuse the `Button` text creation logic (hover effects, styling with "Press Start 2P" font).

**`src/scenes/VictoryScene.js`**

- Reuse the scene transition logic (`transition.transitionTo`) for the Rematch and Quit functions.

**`src/systems/TouchInputController.js`**

- Reference the touch zones logic (left < width/2, right > width/2) to align the **Gesture Indicators** perfectly with actual active zones.

**`src/systems/AudioManager.js`**

- Reuse `audioManager.playUi('ui_select')` for button clicks in the Pause and Tutorial menus.

## Out of Scope

- **Interactive Tutorial**: No playable "do this to continue" steps; just a static image.
- **Practice Mode**: Explicitly removed from scope.
- **Moves List**: No complex move list in the Pause Menu.
- **Key Remapping**: Controls are fixed.
