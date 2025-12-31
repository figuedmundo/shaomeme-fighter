# Spec Requirements: randomized-victory-music

## Initial Description

right now the arena has a music victory that is declared in gamedata json, but that makes the gift a little all the time the same, i want intrduce some randominized , with the music, I mean we can create a folder for soundtracks, and I can put there many soundtracks and the game reward will randomically load a soundtrack with the slideshow starts

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want a global folder for these victory tracks (e.g., `public/assets/audio/music/victory/`) where the game picks one at random for the slideshow. Is that correct, or should different arenas have their own specific "playlists"?
**Answer:** yes, lets make public/assets/audio/soundtracks

**Q2:** I'm thinking we should update the logic so that if `gameData.json` has a specific victory track defined for an arena, it uses that, but if we enable a "randomize" flag (or if the field is empty), it pulls from this new folder. Should we prioritize the specific track or always randomize?
**Answer:** no, lets remove all the victory tracks from gamedata.json, lets play random always, I have been testing, and playing the game and all the time the same music , at the end is tiring, so I will add many soundtracks, and they need to randomically play, makes sense ?

**Q3:** I assume this music should strictly play during the _Victory Slideshow_ phase (the photo reward), replacing whatever stage music was playing. Is that correct?
**Answer:** yes, as I said, we will not more set the music reward to the arena

**Q4:** Do you want to be able to add new MP3 files to this folder and have the game automatically detect them (requires a server-side scan similar to the photo scanner), or will you manually list them in a config file?
**Answer:** please suggest [Accepted suggestion in follow-up: Auto-detection via API]

### Existing Code to Reference

No specific similar features identified by user, but the project has:

- `PhotoService` (Backend scanning pattern)
- `AudioManager` (Frontend audio handling)

### Follow-up Questions

**Follow-up 1:** Recommendation for Q4 (Auto-Detection): Since you want to just "drop files in," I suggest we add a simple backend scanner (similar to how we handle Photos). We'll create a new API endpoint: `/api/soundtracks`. The game calls this on startup to get the list of available songs. Does this sound good?
**Answer:** yes

**Follow-up 2:** File Formats: I assume we should stick to MP3 for compatibility, but should we also support OGG or WAV?
**Answer:** mp3 m4a wav ogg

**Follow-up 3:** Cleanup: You mentioned removing victory tracks from `gameData.json`. Should I also have the agent remove the `victoryMusic` field entirely from the JSON structure to keep it clean?
**Answer:** yes

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A

## Requirements Summary

### Functional Requirements

- Create directory `public/assets/audio/soundtracks`.
- Implement backend API endpoint `/api/soundtracks` that scans this directory.
- Supported audio formats: .mp3, .m4a, .wav, .ogg.
- Remove `victoryMusic` field from `gameData.json` and its associated types/interfaces.
- Update `VictorySlideshow` scene to:
  1. Fetch the list of soundtracks from `/api/soundtracks`.
  2. Select one random track from the list.
  3. Play it during the slideshow (stopping previous stage music).

### Reusability Opportunities

- Reuse `ImageProcessor` or `PhotoService` scanning logic for the backend (Node.js `fs` scanning).
- Reuse `AudioManager` for playing the audio file on the frontend.

### Scope Boundaries

**In Scope:**

- Backend API for audio scanning.
- Frontend logic for random selection.
- Cleanup of `gameData.json`.
- Support for multiple audio formats.

**Out of Scope:**

- Per-arena specific music playlists (removed per user request).
- UI for managing soundtracks (file system only).

### Technical Considerations

- Backend: Node.js/Express.
- Frontend: Phaser 3.
- Ensure audio files are accessible via the public static file server.
- Handle case where folder is empty (fallback or silence).
