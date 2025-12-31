# Specification: Randomized Victory Music

## Goal

Replace the static, repetitive victory music with a randomized soundtrack system. Winning a match will trigger a random song from a global pool of audio tracks during the photo slideshow, providing variety and a better "gift" experience.

## User Stories

- As a player, I want to hear different songs when I win matches so that the reward phase feels fresh and surprising each time.
- As a content manager (user), I want to simply drop new MP3/M4A/WAV files into a folder and have them automatically appear in the game without editing code or config files.
- As a developer, I want to decouple victory music from specific arenas to simplify the configuration and maintenance.

## Specific Requirements

**Backend: Soundtracks API**

- Create a new API endpoint `/api/soundtracks` in `server/index.js`.
- The endpoint must scan the directory `public/assets/audio/soundtracks` (create if missing).
- It must return a JSON array of filenames (e.g., `["song1.mp3", "track2.m4a"]`).
- Supported file extensions: `.mp3`, `.m4a`, `.wav`, `.ogg` (case-insensitive).
- Logging should be integrated to track the number of tracks found.

**Frontend: Asset Loading**

- In `PreloadScene` (or `BootScene`), fetch the list of available soundtracks from `/api/soundtracks`.
- Dynamically load these audio files into the Phaser Cache with unique keys (e.g., `victory_track_1`, `victory_track_2`).
- Handle the case where the API returns an empty list (ensure game doesn't crash).

**Frontend: Randomized Playback**

- In `VictorySlideshow` scene, remove any logic that plays arena-specific victory music.
- Implement logic to select one random track from the loaded victory keys.
- Play the selected track using `AudioManager`.
- Ensure the track loops if the slideshow is longer than the song.
- Stop the previous stage music before playing the victory track (if not already handled).

**Configuration Cleanup**

- Remove the `victoryMusic` field from all arena entries in `src/config/gameData.json`.
- Update TypeScript interfaces or JSDoc types (if any) to reflect this removal.

## Visual Design

N/A - This is an audio-only feature.

## Existing Code to Leverage

**`server/index.js` (Photo Scanning Logic)**

- The existing `/api/photos` endpoint uses `fs.readdir` and filters by extension. Replicate this pattern for `/api/soundtracks`.

**`src/systems/AudioManager.js`**

- Reuse `playMusic(key, config)` for playback.
- Reuse `stopMusic(fadeDuration)` to transition from fight music.

**`src/scenes/PreloadScene.js` (or similar)**

- Reuse the existing asset loading pattern (`this.load.audio(...)`) to load the dynamic list of files.

## Out of Scope

- **Per-Arena Playlists:** We are explicitly removing the ability for arenas to have specific songs. It is global randomization only.
- **UI Management:** No UI for uploading or selecting songs; file system operations only.
- **Metadata Display:** We will not display the song title/artist on screen.
