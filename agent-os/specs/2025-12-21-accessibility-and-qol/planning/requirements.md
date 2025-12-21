# Spec Requirements: Accessibility & QoL

## Initial Description

From Roadmap:

- **Touch Control Tutorial** — First-time overlay explaining controls `S`
- **Pause Menu** — Access settings mid-fight `S`
- **Rematch Option** — Quick replay without going to menu `XS`
- **Practice Mode** — Fight with infinite health to learn combos `M`
- **Gesture Indicators** — Subtle visual hints for touch zones `S`

## Requirements Discussion

### First Round Questions

**Q1:** I assume a static image overlay that appears on the very first fight launch (dismissible by tap) is sufficient for the 'S' size estimate. Is that correct?
**Answer:** User requested suggestions; proceeding with static overlay approach as proposed.

**Q2:** I'm thinking a simple overlay accessed via a pause button (top right?) containing: "Resume", "Audio Settings", and "Quit to Menu". Should we include a "Moves List"?
**Answer:** User requested suggestions; proceeding with Resume, Audio Settings, and Quit. Moves List deferred to keep scope small.

**Q3:** I assume this should be a new "Training" button on the Main Menu...
**Answer:** User explicitly removed this from scope: "lets don't do it , is pointless".

**Q4:** I'm thinking of subtle, semi-transparent overlays on the left/right sides of the screen to indicate touch zones. Should these be always-on, or only fade in when the user touches the screen?
**Answer:** User requested suggestions; proceeding with always-on subtle indicators that can potentially be toggled in settings later, or just simple semi-transparent zones for now to guide the player.

**Q5:** I assume this is a "Rematch" button added to the Victory/Defeat screen that immediately restarts the current fight with the same characters and arena. Correct?
**Answer:** User requested suggestions; proceeding with standard Rematch button integration in post-match UI.

### Existing Code to Reference

No specific similar existing features identified for reference by user.

- Will need to check `src/scenes` for existing UI overlay patterns (e.g., `MainMenu.js` or `VictoryScene.js` for button styles).

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

1.  **Touch Control Tutorial**:
    - Display a one-time overlay on the first match start.
    - Show instructions for Tap (Attack), Hold (Block), Swipe (Move).
    - Dismissible by tapping anywhere.
    - Store "tutorial seen" state in local storage/registry so it doesn't show every time.

2.  **Pause Menu**:
    - Add a Pause Button (UI layer, top-right or distinct location).
    - Pause game logic (physics, timer, AI) when active.
    - Menu Options:
      - **Resume**: Close menu, unpause.
      - **Quit**: Exit to Main Menu.
      - _(Optional/Nice-to-have)_: Audio toggle if easy to hook into existing `AudioManager`.

3.  **Rematch Option**:
    - Add "Rematch" button to `VictoryScene` (and Defeat/Game Over screen if separate).
    - Action: Reload `FightScene` with the _same_ configuration (Fighters, Arena) immediately.

4.  **Gesture Indicators**:
    - Visual feedback for the invisible touch zones.
    - Left 50% screen: Movement zone hints.
    - Right 50% screen: Attack zone hints.
    - Visuals should be unobtrusive (low opacity).

### Reusability Opportunities

- Reuse `Button` components from `MainMenu` or `CharacterSelect`.
- Reuse `AudioManager` for UI sounds.
- Reuse standard font styles (`PressStart2P` or similar arcade fonts used in project).

### Scope Boundaries

**In Scope:**

- Tutorial Overlay.
- Pause functionality and UI.
- Rematch workflow.
- Visual Touch Zone indicators.

**Out of Scope:**

- Practice/Training Mode (Explicitly removed).
- Complex "Moves List" in Pause Menu.
- Keybinding/Control remapping.

### Technical Considerations

- **Phaser Scene Handling**: Pausing a scene in Phaser (`this.scene.pause()`) and launching a separate `PauseScene` overlay is a common robust pattern.
- **State Persistence**: Need to persist "tutorial seen" flag.
- **Input Handling**: Ensure touch inputs don't "bleed through" the pause menu (i.e., tapping "Quit" shouldn't also trigger a punch).
