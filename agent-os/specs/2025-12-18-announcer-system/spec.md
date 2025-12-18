# Specification: Announcer/System (Task 2.2)

## Goal

Implement a cohesive "Arcade Style" audio-visual announcer system that handles Round Start/End sequences, Combo feedback, and Character Selection voiceovers to increase the game's production value and immersion.

## User Stories

- As a player, I want to hear "Round 1... Fight!" before combat starts so I get pumped up and know exactly when to begin.
- As a player, I want to see and hear dramatic feedback when I land a big combo ("3 Hit Combo!", "Excellent!") so I feel skilled and powerful.
- As a player, I want to hear the announcer scream my character's name when I pick them so the selection feels impactful.
- As a player, I want a clear "KO!" and "You Win" sequence so the end of the match feels conclusive and rewarding.

## Specific Requirements

**Announcer Audio System**

- Extend `AudioManager` to handle a new "Announcer" channel (separate from SFX/Music) to ensure voice lines cut through the mix.
- Implement a queueing system or "interrupt" priority so "KO" isn't cut off by a late "Combo" callout.
- Preload all announcer assets in `PreloadScene`.

**Round Start Sequence**

- In `FightScene`, freeze player input at the start.
- Display "ROUND [X]" text using the `Mortal Kombat 4` font.
- Play "round\_[x].mp3" audio.
- Wait 1 second, then display "FIGHT!" text and play "fight.mp3".
- Enable player input immediately on "FIGHT!".

**Combo System (Audio & Visuals)**

- Track consecutive hits in `FightScene` (reset counter if time > 2 seconds since last hit).
- Display "X HIT COMBO" text on screen for any combo >= 2 hits.
- Play announcer audio ONLY on milestones:
  - 3 Hits: "combo_3.mp3" (e.g., "Good!")
  - 5 Hits: "combo_5.mp3" (e.g., "Dominating!")
  - 7+ Hits: "combo_ultra.mp3" (e.g., "Ultra Combo!")

**Character Select Voice**

- In `CharacterSelectScene`, trigger specific character name audio (e.g., "dad.mp3") immediately upon confirming a selection.
- Prevent rapid-fire overlapping if the user moves the cursor quickly (debounce audio).

**Match End Sequence**

- On HP 0, freeze game (slow-mo handles itself) and display huge "KO" text.
- Play "ko.mp3" (already exists, ensure volume boost).
- After delay, display "YOU WIN" / "YOU LOSE" text.
- Play "you_win.mp3" or "you_lose.mp3".

## Visual Design

**Fonts**

- Use the **Mortal Kombat 4** font (`MK4.woff`) for all Announcer text overlays.
- Fallback to `Impact` or `Verdana` if font fails to load.
- Text should have a heavy drop shadow (black) and a gradient fill (Gold/Orange) to pop against complex backgrounds.

**HUD Overlay**

- Center screen for "Round/Fight/KO".
- Side/Corner placement for "Combo" text (so it doesn't obscure the fighters).

## Existing Code to Leverage

**`src/systems/AudioManager.js`**

- Already has a structure for `playRandomVariation` and volume control.
- **Action:** Add `playAnnouncer(key)` method that handles the priority/volume logic.

**`src/scenes/FightScene.js`**

- Already has `checkAttack` and `checkWinCondition`.
- **Action:** Add `comboCounter` state and `lastHitTime` tracking here.
- **Action:** Integrate the "Round Start" sequence into the `create()` method (using `this.scene.pause` / `resume` or just input locking).

**`src/components/Fighter.js`**

- Already detects hits.
- **Action:** Ensure it correctly reports "successful hit" back to the Scene to increment the combo counter.

**`refs/mortal-kombat-webfont/`**

- Contains the font files.
- **Action:** Copy `MK4.woff` to `public/fonts/` and register it in CSS.

## Out of Scope

- Recording unique dialogue lines for characters (e.g., "I'm the best!").
- "Perfect" round special animation (just audio is fine for now).
- Complex "inter-character" banter.
- Dynamic localized text (English only).
