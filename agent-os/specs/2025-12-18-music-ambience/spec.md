# Specification: Music & Ambience

## Goal

Create an immersive audio experience by implementing background music for different game states (Menu, Select, Fight) and adding audio feedback for UI interactions.

## User Stories

- As a player, I want to hear high-energy music during fights that is different from the menu music, so I feel the intensity of combat.
- As a player, I want the music to speed up or intensify when my health is low, adding dramatic tension to the final moments of a round.
- As a player, I want distinct sound effects when I navigate menus and select options, confirming my actions.
- As a player, I want each arena to ideally have its own track (or a fallback), giving each location a unique vibe.

## Specific Requirements

**AudioManager Enhancements**

- Extend `AudioManager.js` to handle background music tracks with start, stop, fade-in, and fade-out capabilities.
- Implement a `playUi(key)` method for interface sounds (navigation, selection).
- Add `setMusicRate(rate)` to allow dynamic speed adjustment (e.g., 1.2x speed).
- Ensure music volume respects the global configuration in `AudioManager`.

**Asset Loading**

- Load existing music files: `soundtrack_walking_on_cars.mp3` (Menu), `vs.mp3` (Select), `arena.mp3` (Fight Default).
- Load UI sound placeholders (or new assets): `ui_move`, `ui_select`, `ui_back`.
- Update `PreloadScene.js` to include these assets.

**Menu Music Integration**

- **MainMenuScene**: Play `soundtrack_walking_on_cars` on start.
- **CharacterSelectScene**: Play `vs.mp3` (or maintain menu theme) and play `ui_move`/`ui_select` on interactions.
- **ArenaSelectScene**: Play UI sounds on interaction.

**Dynamic Fight Music**

- **FightScene**: Play `arena.mp3` (or stage-specific track if available) on start.
- **Low Health Logic**: Monitor player health in `update()`. If either player < 20%, increase music playback rate to 1.1x or 1.2x.
- **Round End**: Fade out music on KO/Victory.

**Stage-Specific Logic**

- In `FightScene`, check `this.city`. If a specific track exists (e.g., `resources/music/{city}.mp3`), play it. Otherwise, play `arena.mp3`.
- (Note: Since we might not have all tracks yet, implement the fallback logic robustly).

## Visual Design

N/A (Audio focused)

## Existing Code to Leverage

**`src/systems/AudioManager.js`**

- Already handles sound pools and volumes.
- Has `volumes.music` config.
- Needs extension for Music specific methods (looping, fading).

**`src/scenes/FightScene.js`**

- `init(data)` receives `city`. Use this for track selection.
- `update()` loop already checks health for `CriticalMomentsManager`. Add music rate trigger here.

**`src/systems/CriticalMomentsManager.js`**

- Already detects "Low Health" state (pulsing vignette). Can emit an event or be polled to trigger music change.

**`src/scenes/PreloadScene.js`**

- Existing loader pattern. Add music files here.

## Out of Scope

- Dynamic music composition (stems/layers). We are just using rate/pitch shifting or track switching.
- Complex audio occlusion or 3D spatial audio.
- User-customizable playlists.
