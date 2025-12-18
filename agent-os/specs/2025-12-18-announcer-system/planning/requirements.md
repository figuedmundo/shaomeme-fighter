# Spec Requirements: Announcer/System

## Initial Description

- Fight Announcer: "Round 1... Fight!", "KO!", "Perfect!", "You Win!"
- Combo Callouts: "3 Hit Combo!", "Ultra Combo!"
- Character Select Voice: Each character says their name when selected
- Victory Quote: Winner's voice line after match

## Requirements Discussion

### First Round Questions

**Q1: Voice Strategy**
**Answer:** Use a single "Epic Announcer" (Deep, dramatic male voice) for consistency across all system calls and names.

**Q2: Character Select Voice**
**Answer:** The Announcer will say the character's name dramatically (e.g., "DAD!") when selected.

**Q3: Victory Quote**
**Answer:** Visual text on screen for the quote; Audio will be the Announcer saying "YOU WIN" or character-specific laughter.

**Q4: Combo Callouts**
**Answer:** Visual text for every combo > 2 hits. Audio triggers only on milestones (3, 5, 7+ hits) to prevent spam.

**Q5: Fonts & Visuals**
**Answer:** Use the Mortal Kombat style font (found in `refs/mortal-kombat-webfont/`) for "FIGHT!", "KO!", and Combo text.

### Existing Code to Reference

- **src/systems/AudioManager.js**: Extend to handle announcer/UI channels.
- **src/components/Fighter.js**: Hook into hit detection for combo counting.
- **src/scenes/FightScene.js**: Manage the "Round Start" sequence and HUD triggers.

### Visual Assets

No visual files provided by user; will use MK font and existing HUD patterns.

## Requirements Summary

### Functional Requirements

- **Round Sequence:** "Round X" -> "FIGHT!" overlay with audio.
- **Combo System:** Track consecutive hits; display "X HIT COMBO" and play announcer sound at milestones.
- **Character Select:** Play character name audio when selected in `CharacterSelectScene`.
- **Match End:** "KO!" sequence followed by "YOU WIN" announcer call.

### Scope Boundaries

**In Scope:**

- Announcer audio for rounds, combos, and names.
- Visual overlays for combat status.
- UI sound integration for selection.

**Out of Scope:**

- Recording unique dialogue for every character (using text for quotes instead).
- Advanced AI announcer variations.

### Technical Considerations

- Must handle audio loading in `PreloadScene`.
- Ensure announcer audio has a dedicated volume channel.
- Performance: Overlays must be lightweight to maintain 60FPS on iPad.
