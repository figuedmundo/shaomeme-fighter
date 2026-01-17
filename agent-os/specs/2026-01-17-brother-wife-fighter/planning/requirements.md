# Spec Requirements: Brother-Wife Fighter

## Initial Description

Add a new fighter "brother-wife" to the game roster. This is the wife of the existing "brother" (柚子) character.

## Requirements Discussion

### First Round Questions

**Q1:** I assume brother-wife means the wife of the "brother" character (柚子). Is that correct?
**Answer:** Yes, the wife of the brother. The fighter ID should be `brother-wife`.

**Q2:** What should the display name be?
**Answer:** User requested suggestion. Based on family naming pattern (媽媽, 爸爸, 柚子), recommended **嫂嫂** (sister-in-law).

**Q3:** What personality/AI behavior should she have?
**Answer:** `aggressive` - same as other fighters.

**Q4:** Do you have sprite/art assets prepared?
**Answer:** Yes, assets already exist in `public/assets/fighters/brother-wife/`.

**Q5:** Anything unique about this character?
**Answer:** No, standard fighter implementation.

**Q6:** Any exclusions from scope?
**Answer:** No exclusions.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Existing fighters - Path: `src/config/gameData.json` (roster array)
- Components to potentially reuse: Same Fighter.js class, same asset structure
- Backend logic to reference: `ConfigManager.js` for roster access

The `brother` character is the most relevant reference as it's the spouse.

### Follow-up Questions

None required - all requirements are clear.

## Visual Assets

### Files Provided:

Assets verified in `public/assets/fighters/brother-wife/`:

- `sprite.png`: Main 32-frame spritesheet for animations
- `portrait.png`: Character portrait (woman with glasses, blue gi with gold trim, mystical background)
- `fullBody.png`: Full body character display for select screen
- `victory.png`: Victory pose image

### Visual Insights:

- Character: East Asian woman with glasses, friendly smile
- Attire: Blue martial arts gi with gold/tan textured trim
- Style: Mystical/warrior theme with glowing gold runes in background
- Fidelity level: High-fidelity production assets (ready for use)

## Requirements Summary

### Functional Requirements

- Add `brother-wife` to the game roster in `gameData.json`
- Fighter uses existing assets in `public/assets/fighters/brother-wife/`
- Standard fighter behavior with `aggressive` personality
- Should be selectable in Character Select screen
- Can be fought as AI opponent

### Reusability Opportunities

- Exact same implementation pattern as all existing fighters
- No new components needed
- ConfigManager already handles roster dynamically

### Scope Boundaries

**In Scope:**

- Add roster entry to `gameData.json`
- Verify spritesheet follows 32-frame format
- Test character selection and fight functionality

**Out of Scope:**

- No custom mechanics or unique abilities
- No voice lines
- No special animations beyond standard set

### Technical Considerations

- Spritesheet must follow 32-frame layout (idle:6, walk:6, jump:1, crouch:1, attack:3, hit:1, block:1, intro:4, victory:4, crumple:2, die:3)
- Asset paths must match expected format
- No code changes needed beyond JSON configuration
