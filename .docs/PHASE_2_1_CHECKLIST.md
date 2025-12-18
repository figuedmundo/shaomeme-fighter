# Phase 2.1: Combat Sounds - Completion Checklist

## ✅ Completed Tasks

- [x] **AudioManager System Created**
  - [x] Sound pool management
  - [x] Anti-spam protection (100ms cooldown)
  - [x] Volume control per sound type
  - [x] Random variation selection
  - [x] Simple API for triggering sounds

- [x] **PreloadScene Integration**
  - [x] Load attack1-5.mp3 files
  - [x] Load KO.mp3 file
  - [x] Create and initialize AudioManager
  - [x] Store AudioManager in registry
  - [x] Add TODO comments for future sounds

- [x] **FightScene Integration**
  - [x] Retrieve AudioManager from registry
  - [x] Connect AudioManager to both fighters
  - [x] Trigger impact sounds on successful hit
  - [x] Trigger hit reaction sounds when taking damage
  - [x] Trigger KO sound on knockout

- [x] **Fighter Component Updates**
  - [x] Add audioManager property
  - [x] Add setAudioManager() method
  - [x] Add whoosh sound hook (commented)
  - [x] Add grunt sound hook (commented)

- [x] **Testing**
  - [x] Sound loading verified
  - [x] Random variation working
  - [x] Anti-spam cooldown working
  - [x] Volume levels balanced
  - [x] Sounds sync with animations
  - [x] Registry access from all scenes
  - [x] No performance issues

- [x] **Documentation**
  - [x] Create AUDIO_IMPLEMENTATION.md
  - [x] Create PHASE_2_1_SUMMARY.md
  - [x] Update roadmap.md
  - [x] Create architecture diagrams
  - [x] Create quick reference card
  - [x] Write completion checklist

---

## 🔨 To Complete Phase 2.1 (Final 10%)

### 1. Find/Create Whoosh Sounds

- [ ] Find or create 3 whoosh sound variations
  - **Requirements:**
    - Duration: 0.1-0.2 seconds
    - Format: MP3, 44100 Hz, 128-192 kbps
    - Style: Sharp air-cutting, sword swing-like
    - Variations: Different pitch/intensity
  - **Resources:**
    - Freesound.org - Search "whoosh", "sword", "air"
    - Zapsplat.com - "Whooshes & Swooshes" category
    - Record yourself swinging a stick/towel

- [ ] Add files to `resources/` directory:
  - `resources/whoosh1.mp3`
  - `resources/whoosh2.mp3`
  - `resources/whoosh3.mp3`

- [ ] Update `src/scenes/PreloadScene.js`:

  ```javascript
  // Line ~40 (after attack sounds)
  this.load.audio("whoosh1", "resources/whoosh1.mp3");
  this.load.audio("whoosh2", "resources/whoosh2.mp3");
  this.load.audio("whoosh3", "resources/whoosh3.mp3");
  ```

- [ ] Update `src/systems/AudioManager.js`:

  ```javascript
  // Line ~62 (in init() method)
  // Uncomment:
  for (let i = 1; i <= 3; i++) {
    const key = `whoosh${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.whooshSounds.push(key);
    }
  }
  logger.info(`Loaded ${this.whooshSounds.length} whoosh sounds`);
  ```

- [ ] Update `src/components/Fighter.js`:

  ```javascript
  // Line ~147 (in setState method)
  // Uncomment:
  if (this.audioManager) {
    this.audioManager.playWhoosh();
  }
  ```

- [ ] Test whoosh sounds:
  - [ ] Sounds load without errors
  - [ ] Play on attack start
  - [ ] Different variation each time
  - [ ] Volume is appropriate (0.3)
  - [ ] Don't spam on rapid attacks

---

### 2. Find/Create Character Grunt Sounds

- [ ] Find or create 3 grunt sound variations
  - **Requirements:**
    - Duration: 0.2-0.4 seconds
    - Format: MP3, 44100 Hz, 128-192 kbps
    - Style: Short effort sounds ("Hah!", "Yah!", "Tch!")
    - Variations: Different syllables/intensity
  - **Resources:**
    - GameSounds.xyz - Voice packs
    - Voicy.network - Character voices
    - Record yourself making martial arts sounds

- [ ] Add files to `resources/` directory:
  - `resources/grunt1.mp3`
  - `resources/grunt2.mp3`
  - `resources/grunt3.mp3`

- [ ] Update `src/scenes/PreloadScene.js`:

  ```javascript
  // Line ~43 (after whoosh sounds)
  this.load.audio("grunt1", "resources/grunt1.mp3");
  this.load.audio("grunt2", "resources/grunt2.mp3");
  this.load.audio("grunt3", "resources/grunt3.mp3");
  ```

- [ ] Update `src/systems/AudioManager.js`:

  ```javascript
  // Line ~71 (in init() method)
  // Uncomment:
  for (let i = 1; i <= 3; i++) {
    const key = `grunt${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.gruntSounds.push(key);
    }
  }
  logger.info(`Loaded ${this.gruntSounds.length} grunt sounds`);
  ```

- [ ] Update `src/components/Fighter.js`:

  ```javascript
  // Line ~151 (in setState method)
  // Uncomment:
  if (this.audioManager) {
    this.audioManager.playGrunt();
  }
  ```

- [ ] Test grunt sounds:
  - [ ] Sounds load without errors
  - [ ] Play on attack start
  - [ ] Different variation each time
  - [ ] Volume is appropriate (0.4)
  - [ ] Sync well with whoosh sounds

---

### 3. (Optional) Add Dedicated Hit Reaction Sounds

Currently using impact sounds as fallback. This is optional but recommended.

- [ ] Find or create 2-3 hit reaction variations
  - **Requirements:**
    - Duration: 0.2-0.5 seconds
    - Format: MP3, 44100 Hz, 128-192 kbps
    - Style: Pain sounds ("Ugh!", "Ah!", "Oof!")
    - Variations: Different intensity

- [ ] Add files to `resources/` directory:
  - `resources/hit_reaction1.mp3`
  - `resources/hit_reaction2.mp3`

- [ ] Update `src/scenes/PreloadScene.js`:

  ```javascript
  // Line ~46 (after grunt sounds)
  this.load.audio("hit_reaction1", "resources/hit_reaction1.mp3");
  this.load.audio("hit_reaction2", "resources/hit_reaction2.mp3");
  ```

- [ ] Update `src/systems/AudioManager.js`:

  ```javascript
  // Line ~80 (in init() method)
  // Uncomment:
  for (let i = 1; i <= 2; i++) {
    const key = `hit_reaction${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.hitReactionSounds.push(key);
    }
  }
  logger.info(`Loaded ${this.hitReactionSounds.length} hit reaction sounds`);
  ```

- [ ] Test hit reaction sounds:
  - [ ] Sounds load without errors
  - [ ] Play when taking damage
  - [ ] Different from impact sounds
  - [ ] Volume is appropriate (0.5)

---

## 🎯 Final Testing

Once all audio files are added:

### Sound Loading Test

- [ ] Run `npm run dev`
- [ ] Open browser console
- [ ] Check for "Loaded X whoosh sounds" log
- [ ] Check for "Loaded X grunt sounds" log
- [ ] No audio load errors in console

### In-Game Testing

- [ ] Start a fight
- [ ] Attack with Player 1
  - [ ] Whoosh sound plays immediately
  - [ ] Grunt sound plays with whoosh
  - [ ] Sounds sync with animation
- [ ] Hit Player 2
  - [ ] Impact sound plays (random variation)
  - [ ] Hit reaction sound plays
  - [ ] No audio overlap/spam
- [ ] Attack rapidly
  - [ ] Sounds respect 100ms cooldown
  - [ ] Different variations play
- [ ] Knockout opponent
  - [ ] KO sound plays dramatically
  - [ ] Volume is louder (0.7)

### Volume Balance Test

- [ ] All sounds audible but not overwhelming
- [ ] Impact sounds don't overpower whoosh
- [ ] Grunt sounds don't clash with impacts
- [ ] KO sound stands out clearly
- [ ] No clipping or distortion

### Variation Test

- [ ] Play 10 fights, note sound variations
- [ ] Should hear different impacts each hit
- [ ] Should hear different whooshes
- [ ] Should hear different grunts
- [ ] No obvious repetition patterns

---

## 📋 Documentation Updates

After completing the implementation:

- [ ] Update AUDIO_IMPLEMENTATION.md status table
  - [ ] Change whoosh status to ✅
  - [ ] Change grunt status to ✅
  - [ ] Add file locations and details

- [ ] Update PHASE_2_1_SUMMARY.md
  - [ ] Change "90% complete" to "100% complete"
  - [ ] Update "Final 10%" section
  - [ ] Add completion date

- [ ] Update roadmap.md
  - [ ] Mark all Phase 2.1 tasks as complete
  - [ ] Remove "Ready for audio" notes
  - [ ] Update progress indicators

---

## 🎊 Celebration Checklist

When everything is complete:

- [ ] All sounds working perfectly
- [ ] No console errors
- [ ] Smooth gameplay experience
- [ ] Professional audio quality
- [ ] Documentation updated
- [ ] Code committed to git
- [ ] Roadmap updated

You did it! Time to move to Phase 2.2: Announcer System! 🎉

---

## 📞 Need Help?

### Sound Design Issues

- Check AUDIO_IMPLEMENTATION.md "Sound Design Tips"
- Reference Street Fighter 2 / Mortal Kombat
- Try different search terms on Freesound

### Technical Issues

- Check AUDIO_IMPLEMENTATION.md "Troubleshooting"
- Verify file paths in PreloadScene
- Check browser console for errors
- Ensure file format is MP3

### Volume Problems

- Edit AudioManager.js volumes
- Test on actual device (not just desktop)
- Normalize audio files to -3dB peak
- Use Audacity for volume adjustments

---

**Remember**: The goal is to make every hit feel impactful!  
Audio is 50% of the game experience. Take your time to get it right. 🎵

Good luck! You've got this! 💪
