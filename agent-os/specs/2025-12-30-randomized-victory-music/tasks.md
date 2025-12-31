# Task Breakdown: Randomized Victory Music

## Overview

Total Tasks: 4 Groups

## Task List

### Backend Implementation

#### Task Group 1: API & Filesystem

**Dependencies:** None

- [x] 1.0 Implement Backend Soundtrack API
  - [x] 1.1 Write 2-8 focused tests for `/api/soundtracks`
    - Create `tests/server.soundtracks.test.js`.
    - Test: returns JSON array, scans correct directory, filters for valid extensions (.mp3, .m4a, .wav, .ogg), handles empty directory gracefully.
  - [x] 1.2 Implement `/api/soundtracks` endpoint in `server/index.js`
    - Create `public/assets/audio/soundtracks` directory if missing.
    - Implement `fs.readdir` logic similar to `/api/photos`.
    - Filter files by allowed extensions.
    - Log count of tracks found using `UnifiedLogger`.
  - [x] 1.3 Ensure backend tests pass
    - Run ONLY `tests/server.soundtracks.test.js`.

**Acceptance Criteria:**

- Endpoint returns list of audio files.
- Tests pass for empty and populated folders.
- Server logs startup/access info.

### Frontend Implementation

#### Task Group 2: Audio Loading & Playback

**Dependencies:** Task Group 1

- [x] 2.0 Implement Frontend Logic
  - [x] 2.1 Write 2-8 focused tests for Victory Logic
    - Create `tests/VictorySlideshow.Audio.test.js` (or similar).
    - Test: `fetch` is called for soundtracks, `AudioManager.playMusic` is called with random key, `stopMusic` is called for previous track.
  - [x] 2.2 Update `src/scenes/PreloadScene.js` (or `BootScene`)
    - Fetch from `/api/soundtracks`.
    - Dynamic asset loading: `this.load.audio('victory_track_X', url)`.
    - Store the list of keys in the Registry or Game Config for access.
  - [x] 2.3 Update `src/scenes/VictorySlideshow.js`
    - Remove logic looking for `arena.victoryMusic`.
    - Retrieve soundtrack keys list.
    - Pick random key using `Phaser.Math.RND.pick()`.
    - Call `audioManager.stopMusic(500)` (fade out stage music).
    - Call `audioManager.playMusic(randomKey)`.
  - [x] 2.4 Ensure frontend tests pass
    - Run ONLY `tests/VictorySlideshow.Audio.test.js`.

**Acceptance Criteria:**

- Game loads without error even if no soundtracks exist.
- Slideshow plays random music from the folder.
- Stage music stops correctly.

### Refactoring

#### Task Group 3: Configuration Cleanup

**Dependencies:** Task Group 2

- [x] 3.0 Cleanup `gameData.json`
  - [x] 3.1 Write 2-8 focused tests for Config integrity
    - Update `tests/ConfigManager.test.js` (or create new focused test).
    - Verify `gameData` loads and _does not_ contain `victoryMusic` field (optional, mostly ensures no regression).
  - [x] 3.2 Remove `victoryMusic` from `src/config/gameData.json`
    - Iterate through all arenas and delete the key.
  - [x] 3.3 Update Types/Interfaces (if applicable)
    - Check `src/config/ConfigManager.js` or JSDoc types for `Arena` definition and remove `victoryMusic`.
  - [x] 3.4 Ensure config tests pass
    - Run `tests/ConfigManager.test.js`.

**Acceptance Criteria:**

- `gameData.json` is clean.
- No runtime errors due to missing field.

### Testing

#### Task Group 4: Test Review & Gap Analysis

**Dependencies:** Task Groups 1-3

- [x] 4.0 Review and Fill Gaps
  - [x] 4.1 Review tests from Groups 1-3
    - Verify backend API tests.
    - Verify frontend playback tests.
  - [x] 4.2 Analyze coverage gaps
    - Is the "no music files" case handled gracefully in the UI?
    - Does it handle non-MP3 files if supported?
  - [x] 4.3 Write up to 10 additional strategic tests
    - Add integration test: Full flow from Win -> Slideshow -> Audio Start.
  - [x] 4.4 Run feature-specific tests
    - Run `tests/server.soundtracks.test.js`, `tests/VictorySlideshow.Audio.test.js`, and new integration tests.

**Acceptance Criteria:**

- All feature tests pass.
- Randomization verified (manual or mock check).
- Clean transition verified.

## Execution Order

1. Backend Implementation (Group 1)
2. Frontend Implementation (Group 2)
3. Configuration Cleanup (Group 3)
4. Test Review (Group 4)
