# Specification: Character Roster Integration

## Goal
Implement a "Character Selection" scene featuring a predefined roster of personal characters (Ann, Mom, Dad, Brother, Old Witch, Fat, Fresway Worker). The screen will allow the player to choose their fighter using an MK11-inspired UI (grid + large portraits) and transition to the Arena Select screen.

## User Stories
- As a player, I want to see a roster of my family and friends so I can choose who I want to play as.
- As a player, I want to see a large, high-quality photo/portrait of the character I'm highlighting so I can clearly see who it is.
- As a player, I want the selection screen to feel like a modern, polished arcade game (dark theme, gold accents) consistent with the rest of the app.

## Specific Requirements

**Roster Configuration**
- Create `src/config/rosterConfig.js` exporting an array of character objects.
- Each object should contain: `id` (e.g., 'ann'), `displayName` (e.g., 'Ann'), `portraitPath` (path to large image), `iconPath` (path to small icon), and `spritesheetPath` (placeholder for now).
- Initial Roster: Ann, Mom, Dad, Brother, Old Witch, Fat, Fresway Worker.

**Scene Implementation**
- Create `src/scenes/CharacterSelectScene.js`.
- Register the scene in `src/index.js` and `src/config/gameConfig.js`.
- Update `MainMenuScene` to transition to `CharacterSelectScene` instead of `ArenaSelectScene`.

**Data & Asset Loading**
- In `preload`, load assets defined in `rosterConfig.js`.
- Implement a fallback mechanism: check if file exists (if possible via simple pre-check or just handle load errors gracefully), otherwise use a default "Silhouette" or "Question Mark" placeholder.
- **Folder Structure:** `assets/fighters/[id]/portrait.png` and `assets/fighters/[id]/icon.png`.

**UI Layout (MK11 Style)**
- **Central Grid:** A centered grid (e.g., 3 rows) of character icons/thumbnails.
- **Left Portrait (Player 1):** A large, full-height image of the currently highlighted character on the left side.
- **Right Portrait (Opponent):** A silhouette/shadow figure on the right side (placeholder for opponent).
- **Character Name:** Large text displaying the name of the highlighted character.
- **Styling:** Dark background, gold borders for selected items, high contrast text.

**Interaction Logic**
- Clicking/Tapping a grid item highlights it (updates Left Portrait and Name).
- Double-clicking or pressing "SELECT" confirms the choice.
- **Transition:** Upon confirmation, start `ArenaSelectScene`, passing `{ playerCharacter: [selectedId] }` as scene data.

**State Passing**
- Ensure `ArenaSelectScene` receives the `playerCharacter` data and passes it along to `FightScene` eventually (though `FightScene` logic update is out of scope, the data chain must be maintained).

## Visual Design
**`planning/visuals/mk11_select_player.png`**
- **Grid:** Compact, centered grid of square icons.
- **Portraits:** Dominant, high-resolution figures flanking the grid.
- **Typography:** Uppercase, bold, sans-serif fonts with metallic/gradient fills.
- **Selection:** "P1" indicator or bright border on the active grid item.

## Existing Code to Leverage

**`src/scenes/ArenaSelectScene.js`**
- Reuse the "Hero Background" logic for the Portraits (using `Phaser.GameObjects.Image`).
- Reuse the "Grid" generation logic (adapt from bottom-row to center-block).
- Reuse button styling and `setInteractive` patterns.

**`src/config/fighterConfig.js`**
- Reference this for the structure of fighter stats/config, but create a new `rosterConfig.js` focused on the *selection* metadata (UI assets) to keep concerns separated (or merge if it makes sense, but separation is cleaner for now).

## Out of Scope
- Opponent selection logic (Opponent remains random or hardcoded in `FightScene` for now).
- Generating custom pixel-art spritesheets (we will use placeholders for the actual combat sprites).
- Multiplayer functionality.
