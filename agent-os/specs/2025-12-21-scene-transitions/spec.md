# Specification: Scene Transitions

## Goal

Implement a cohesive transition system and intermediate screens (Loading, Victory, Continue) to polish the game loop and provide a professional arcade experience.

## User Stories

- As a player, I want stylish wipe transitions between screens so the game feels like a polished arcade cabinet.
- As a player, I want to see my stats on a Victory Screen before claiming my reward so I can reflect on my performance.
- As a player, I want an exciting "Continue?" countdown when I lose so I feel the urge to try again immediately.
- As a player, I want engaging Loading Screens with tips or lore so wait times don't feel boring.

## Specific Requirements

**System-Wide Transitions**

- Replace all raw `this.scene.start()` calls with `SceneTransition.transitionTo()`.
- Use specific presets from `SceneTransition.js` for different contexts (e.g., `WIPE_RADIAL` for Menu -> Select).
- Ensure transitions handle audio cleanup and setup smoothly.
- Ensure the transition overlay is always at the highest depth.

**Loading Scene**

- Create a generic `LoadingScene` that can be used as an intermediary.
- Display "LOADING..." text in `Press Start 2P` font with a pulsing effect.
- Optional: Display a random tip or character portrait if assets are available/loaded.
- Handle a minimum display time (e.g., 1-2s) to prevent flickering if loading is too fast.

**Victory Scene**

- Create `VictoryScene` to receive data from `FightScene` (Winner, Health, Combo, Time).
- Display "PLAYER [1/2] WINS!" in large arcade font.
- List stats: "Time: XXs", "Max Combo: XX", "Remaining HP: XX%".
- Primary Action: "CLAIM REWARD" button (pulsing) that triggers `VictorySlideshow`.
- Secondary Action: "MAIN MENU" button (smaller/subtle).

**Continue Scene**

- Create `ContinueScene` triggered when the player loses (Player vs AI context).
- Display a large, central countdown number (10 -> 0).
- Visuals: Red tint/overlay, pulsing text, "CONTINUE?" prompt.
- Interaction: Tap anywhere to Restart (Transition back to `FightScene` with same setup).
- Timeout: If 0 is reached, display "GAME OVER" -> Fade to `MainMenuScene`.

**Victory Slideshow Integration**

- Refactor `VictorySlideshow` to be callable from `VictoryScene` instead of auto-triggering.
- Ensure the slideshow exit transitions smoothly back to `ArenaSelectScene` or `MainMenuScene`.

**Visual Consistency**

- Use `Press Start 2P` font for all text to match existing UI.
- Use the existing color palette (Red/Black/White/Gold) defined in `AnnouncerOverlay` or CSS.
- Ensure text sizes are readable on mobile devices.

## Visual Design

**`No visual assets provided`**

- Use the existing game aesthetic (Arcade/Retro).
- Reference `AnnouncerOverlay` for text styles (gradients, strokes).

## Existing Code to Leverage

**`src/utils/SceneTransition.js`**

- Use `transitionTo`, `wipeHorizontal`, `wipeRadial`, `curtain` methods.
- Use `TransitionPresets` for consistency.

**`src/components/AnnouncerOverlay.js`**

- Reuse font styles, colors, and potential animation tweens (e.g., scale up/down).

**`src/components/VictorySlideshow.js`**

- Reuse the core slideshow logic, but modify the entry/trigger point.

**`src/scenes/BootScene.js`**

- Update the initial transition to use the new `LoadingScene` or a wipe effect.

**`src/scenes/FightScene.js`**

- Update the end-of-match logic to pass data to `VictoryScene` or `ContinueScene` instead of showing the slideshow directly.

## Out of Scope

- Networked multiplayer lobby transitions.
- "Story Mode" specific cutscenes or transitions.
- New asset generation (images/sounds) - use existing only.
- Complex database-driven tips/lore (use hardcoded list if any).
- Leaderboard integration.
