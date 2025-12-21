# Spec Requirements: Scene Transitions

## Initial Description

From Roadmap Phase 5.1:

- **Screen Wipes** — Stylish transitions between scenes
- **Loading Screens** — Character tips or lore during loads
- **Victory Screen** — Stats, replay, and photo unlock prompt
- **Continue Screen** — Arcade-style countdown after loss

## Requirements Discussion

### First Round Questions

**Q1:** I assume the **Victory Screen** should be an intermediate step before the Photo Slideshow.
**Answer:** Yes, proceed with suggestion. Flow: Fight End -> Victory Screen (Stats) -> "View Reward" Button -> Victory Slideshow.

**Q2:** For the **Continue Screen** (on loss):
**Answer:** Yes, proceed with suggestion. Classic 10s arcade countdown. Yes = Rematch, No = Game Over -> Menu.

**Q3:** For **Loading Screens**:
**Answer:** Proceed with generic `LoadingScene` that intercepts scene changes. Keep it cohesive with game style.

**Q4:** I found `src/utils/SceneTransition.js`... Should we strictly use this utility?
**Answer:** Yes, verify it is correct and ensure everything is cohesive with the game style.

**Q5:** For **Screen Wipes**, do you have a preference?
**Answer:** Proceed with suggestions (using the presets defined in the utility) to ensure cohesion.

### Existing Code to Reference

- **`src/utils/SceneTransition.js`**: comprehensive transition system (fades, wipes, curtains) already implemented.
- **`src/components/VictorySlideshow.js`**: existing post-match reward logic.
- **`src/scenes/FightScene.js`**: current fight flow control.
- **`src/scenes/MainMenuScene.js`**: simple scene entry point to upgrade.

**Similar Features Identified:**

- `AnnouncerOverlay` for UI styling reference (large arcade text).
- `VictorySlideshow` for visual overlay style.

### Follow-up Questions

No follow-up questions needed. User confirmed suggestions and emphasized cohesion.

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

1.  **System-Wide Transitions**: Replace all raw `this.scene.start()` calls with `SceneTransition.transitionTo()` using appropriate presets.
2.  **Loading Scene**:
    - Create `LoadingScene.js`.
    - Display "LOADING..." with arcade font.
    - Optional: Show random character portrait or "VS" logo.
    - Handle async asset loading if needed (though mostly preloaded, this acts as a buffer).
3.  **Victory Screen**:
    - Create `VictoryScene.js` (or overlay in `FightScene` if easier, but Scene is cleaner for transitions).
    - Display Stats: Winner Name, Remaining Health, Max Combo, Time Taken.
    - "CLAIM REWARD" button -> triggers `VictorySlideshow`.
    - "MAIN MENU" button (optional, small).
4.  **Continue Screen**:
    - Create `ContinueScene.js`.
    - Triggered on Player Loss (vs AI).
    - Large 10 -> 0 countdown.
    - Visual urgency (pulsing, red tint).
    - Input: "Tap to Continue".
5.  **Game Over**:
    - If timer hits 0 on Continue screen -> "GAME OVER" text -> Fade to Main Menu.

### Reusability Opportunities

- Use `SceneTransition.js` for all actual visual transition effects.
- Reuse `AudioManager` for countdown beeps and transition swooshes.
- Reuse `TouchVisuals` or simple buttons for "Continue" interaction.

### Scope Boundaries

**In Scope:**

- Replacing scene navigation in `BootScene`, `MainMenuScene`, `CharacterSelectScene`, `ArenaSelectScene`, `FightScene`.
- New Scenes: `LoadingScene`, `VictoryScene`, `ContinueScene`.
- Updating `VictorySlideshow` to be triggered manually from `VictoryScene`.

**Out of Scope:**

- Networked multiplayer lobby.
- Complex "Story Mode" specific transitions.
- Generating new assets (will use existing fonts/sounds).

### Technical Considerations

- **Cohesion**: Ensure fonts match `PressStart2P` or `MK4` (Mortal Kombat style).
- **Performance**: Transitions must be smooth (60fps) on mobile. Avoid heavy DOM manipulations during the actual wipe animation.
- **State Management**: Pass data (winner, stats, selected chars) correctly between `FightScene` -> `VictoryScene` -> `VictorySlideshow`.
