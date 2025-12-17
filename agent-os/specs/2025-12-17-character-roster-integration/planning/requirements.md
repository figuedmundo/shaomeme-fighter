# Spec Requirements: Character Roster Integration

## Initial Description
Implement the character selection screen and load custom spritesheets (placeholder or generated) for the specific roster.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we need to implement a new `CharacterSelectScene` that will sit between the Main Menu/Arena Select and the Fight Scene. Is that correct?
**Answer:** Yes: Start -> Character Select -> Arena Select -> Fight

**Q2:** I'm thinking the roster should be defined in a configuration file (e.g., `src/config/rosterConfig.js`) containing character names, display names, and asset paths. Should we start with a fixed list?
**Answer:** Yes, that is a good suggestion, also take into account this kind of game industry standards.

**Q3:** For the spritesheets, should we use the existing Ryu/Ken assets as placeholders?
**Answer:** Please suggest, all the work done before if need you can scrap it. (Accepted suggestion to use standard placeholders for now).

**Q4:** Does the selection screen need to distinguish between "Player Character" (Her) and "Opponent" (Them)?
**Answer:** Let's do a standard arcade "Choose Your Fighter".

**Q5:** Should the selection UI follow the same "Modern Arcade" aesthetic (dark theme, gold accents)?
**Answer:** Yes.

**Q6:** Is there an "Opponent Select" step?
**Answer:** As currently is 1 player game, there is not opponent select screen, later on we can think to add a vs for multiplayer but that is a future idea.

### Follow-up Questions

**Follow-up 1:** Visual Style: Pivot to Street Fighter Alpha 3 style or stick to MK11 style?
**Answer:** I think for the first version we can select the Mk11 style (`mk11_select_player.png`).

**Follow-up 2:** Roster Content: Define specific characters?
**Answer:** Lets define: Ann (my girlfriend), Mom, Dad, Brother, Old Witch, Fat (me hahaha), Fresway Worker.

**Follow-up 3:** Asset Generation: Use standard placeholders + folder structure for drag-and-drop updates?
**Answer:** Sounds good.

**Follow-up 4:** Roster Definition IDs?
**Answer:** Yes, `ann`, `mom`, `dad`, `brother`, `old_witch`, `fat`, `fresway_worker`.

**Follow-up 5:** "Drag-and-drop" meaning?
**Answer:** Clarified: means dropping files into folders updates the game without code changes. User agreed.

**Follow-up 6:** Right side layout (Opponent)?
**Answer:** Show a silhouette. It can be filled up randomly at the moment of fight. Acts as placeholder for future VS feature.

## Visual Assets

### Files Provided:
- `mk11_select_player.png`: Screenshot of Mortal Kombat 11 character select screen.
  - **Layout:**
    - **Grid:** Centered 5x5 (approx) grid of square character portraits.
    - **Portraits:** Large, high-res character models on the Left (Player 1) and Right (Player 2).
    - **Text:** "SHAO KAHN" (Character Name) at the bottom left.
    - **Style:** Dark, gritty, metallic gold borders, high contrast.

### Visual Insights:
- **Design Patterns:** Central grid focused, immediate feedback with large portrait on hover/select.
- **User Flow:** Highlight grid item -> Left Portrait updates -> Click to select.

## Requirements Summary

### Functional Requirements
- **Roster Configuration:** Create `src/config/rosterConfig.js` with 7 characters: Ann, Mom, Dad, Brother, Old Witch, Fat, Fresway Worker.
- **Scene Implementation:** Create `CharacterSelectScene` following the MK11 layout.
- **Data/Assets:**
  - Load `portrait.png` (Large) and `icon.png` (Small) for each character from `assets/fighters/[id]/`.
  - Fallback to default placeholders if files are missing.
- **Interaction:**
  - Arrow keys / Touch to navigate grid.
  - Updating selection updates the **Left Portrait** and **Character Name** text.
  - **Right Portrait** shows a shadow/silhouette (Mystery Opponent).
  - Select confirms character and transitions to `ArenaSelectScene`.
  - Pass selected character ID to next scene.

### Reusability Opportunities
- Reuse `ArenaSelectScene` pattern for background loading and "Modern Arcade" styling (gold borders, dark gradients).
- Reuse `TouchInputController` logic if we want swipe navigation on the grid (or keep it simple tap-to-select for now).

### Scope Boundaries
**In Scope:**
- `CharacterSelectScene.js`
- `rosterConfig.js`
- Asset loader logic for standard folder structure.
- UI Layout: Center Grid, Left Portrait (Active), Right Portrait (Silhouette).
- Navigation: Main Menu -> Character Select -> Arena Select.

**Out of Scope:**
- Opponent selection (Opponent is random CPU).
- Multiplayer VS mode.
- Custom spritesheet generation (using placeholders for in-game combat for now).
- 3D models (using 2D images/portraits).

### Technical Considerations
- **Asset Loading:** Use `this.load.image` dynamically based on the config list.
- **State Passing:** Pass `{ playerCharacter: [id] }` to `ArenaSelectScene`, which then passes it (plus arena info) to `FightScene`.
