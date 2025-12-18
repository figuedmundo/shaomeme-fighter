# Combat Audio System - Implementation Guide

## Overview

The Shaomeme Fighter audio system provides dynamic, varied combat sounds with automatic variation selection and spam prevention.

## Architecture

### AudioManager (`src/systems/AudioManager.js`)

Centralized audio system that:

- Manages sound pools for variations
- Prevents sound spam (100ms cooldown)
- Handles volume controls per sound type
- Provides simple API for triggering sounds

### Integration Points

1. **PreloadScene** - Loads audio files and initializes AudioManager in the registry
2. **FightScene** - Retrieves AudioManager and connects it to fighters
3. **Fighter** - Triggers attack sounds (whoosh, grunts)
4. **Combat System** - Triggers impact and hit reaction sounds

---

## Current Implementation (Phase 2.1 Complete ✅)

### ✅ Punch/Kick Variations

- **Status**: IMPLEMENTED
- **Files**: `attack1.mp3` through `attack5.mp3`
- **Triggered**: On successful hit (frame 2 of attack animation)
- **Variations**: 5 different impact sounds randomly selected
- **Volume**: 0.5 (louder for heavy hits: 0.6)

### 🔨 Whoosh Sounds

- **Status**: STUB (ready for sounds)
- **Triggered**: On attack state start (Fighter.setState)
- **Comment**: Currently commented out in Fighter.js line 147

### 🔨 Character Grunts

- **Status**: STUB (ready for sounds)
- **Triggered**: On attack state start (Fighter.setState)
- **Comment**: Currently commented out in Fighter.js line 151

### ✅ Hit Reaction Sounds

- **Status**: IMPLEMENTED (using impact sounds as fallback)
- **Triggered**: When defender takes non-lethal damage
- **Comment**: Ready for dedicated hit reaction sounds

### 🔨 Block Sounds

- **Status**: STUB (no block mechanic yet)
- **Future**: When block state is implemented

### ✅ KO Sound

- **Status**: IMPLEMENTED
- **File**: `KO.mp3`
- **Triggered**: When health reaches 0 (FightScene.checkWinCondition)
- **Volume**: 0.7

---

## How to Add New Sounds

### Step 1: Add Audio Files

Place new audio files in the `resources/` directory:

```
resources/
  whoosh1.mp3
  whoosh2.mp3
  whoosh3.mp3
  grunt1.mp3
  grunt2.mp3
  grunt3.mp3
  hit_reaction1.mp3
  hit_reaction2.mp3
  block1.mp3
  block2.mp3
```

**File Format Requirements:**

- Format: MP3 (for broad browser support)
- Sample Rate: 44100 Hz recommended
- Bitrate: 128-192 kbps (balance quality/size)
- Duration: 0.1-0.5s for impacts, 0.2-0.8s for grunts

### Step 2: Load in PreloadScene

Edit `src/scenes/PreloadScene.js`:

```javascript
// Whoosh sounds (air-cutting)
this.load.audio("whoosh1", "resources/whoosh1.mp3");
this.load.audio("whoosh2", "resources/whoosh2.mp3");
this.load.audio("whoosh3", "resources/whoosh3.mp3");

// Grunt sounds (effort)
this.load.audio("grunt1", "resources/grunt1.mp3");
this.load.audio("grunt2", "resources/grunt2.mp3");
this.load.audio("grunt3", "resources/grunt3.mp3");

// Hit reaction sounds
this.load.audio("hit_reaction1", "resources/hit_reaction1.mp3");
this.load.audio("hit_reaction2", "resources/hit_reaction2.mp3");

// Block sounds
this.load.audio("block1", "resources/block1.mp3");
this.load.audio("block2", "resources/block2.mp3");
```

### Step 3: Register in AudioManager

Edit `src/systems/AudioManager.js` in the `init()` method:

```javascript
init() {
  // ... existing impact sounds ...

  // Load whoosh sounds
  for (let i = 1; i <= 3; i++) {
    const key = `whoosh${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.whooshSounds.push(key);
    }
  }

  // Load grunt sounds
  for (let i = 1; i <= 3; i++) {
    const key = `grunt${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.gruntSounds.push(key);
    }
  }

  // Load hit reaction sounds
  for (let i = 1; i <= 2; i++) {
    const key = `hit_reaction${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.hitReactionSounds.push(key);
    }
  }

  // Load block sounds
  for (let i = 1; i <= 2; i++) {
    const key = `block${i}`;
    if (this.scene.cache.audio.exists(key)) {
      this.blockSounds.push(key);
    }
  }

  logger.info(`Loaded ${this.whooshSounds.length} whoosh sounds`);
  logger.info(`Loaded ${this.gruntSounds.length} grunt sounds`);
  logger.info(`Loaded ${this.hitReactionSounds.length} hit reaction sounds`);
  logger.info(`Loaded ${this.blockSounds.length} block sounds`);
}
```

### Step 4: Uncomment Trigger Points

Edit `src/components/Fighter.js`:

```javascript
// Line ~147-152: Uncomment these lines
if (newState === FighterState.ATTACK) {
  // Play whoosh sound on attack start
  if (this.audioManager) {
    this.audioManager.playWhoosh(); // ← Uncomment
  }

  // Play grunt sound when attacking
  if (this.audioManager) {
    this.audioManager.playGrunt(); // ← Uncomment
  }
  // ...
}
```

---

## Volume Tuning

Edit `src/systems/AudioManager.js` constructor:

```javascript
this.volumes = {
  impact: 0.5, // Punch/kick impact
  whoosh: 0.3, // Air-cutting sounds
  grunt: 0.4, // Effort sounds
  hitReaction: 0.5, // Pain sounds
  block: 0.4, // Block sounds
  ko: 0.7, // KO announcement
  music: 0.3, // Background music
};
```

You can also adjust volumes at runtime:

```javascript
audioManager.setVolume("whoosh", 0.5); // Increase whoosh volume
```

---

## Sound Design Tips

### Impact Sounds (Punch/Kick)

- **Heavy impacts**: Deep thud with bass, slower decay
- **Light impacts**: Sharp crack, quick decay
- **Variation**: Mix different frequencies, attack times
- **Reference**: Street Fighter 2, Mortal Kombat

### Whoosh Sounds (Air-Cutting)

- **Fast attacks**: High-pitched, short (0.1-0.2s)
- **Heavy attacks**: Lower pitch, longer (0.2-0.4s)
- **Variation**: Different tails, pitch bends
- **Reference**: Samurai sword swings, anime fights

### Character Grunts (Effort)

- **Male voices**: "Hah!", "Tch!", "Yah!"
- **Female voices**: "Hya!", "Tah!", "Hai!"
- **Keep short**: 0.2-0.4s max
- **Variation**: Different syllables, intensities

### Hit Reactions (Pain)

- **Light hits**: Short grunts "Ugh!", "Ah!"
- **Heavy hits**: Longer gasps "Aaahh!", "Oof!"
- **Critical**: Intense cries "Argh!", "Gah!"
- **Keep expressive**: These sell the impact

### Block Sounds

- **Guard stance**: Dull thud, absorbed impact
- **Perfect block**: Sharp metallic ping
- **Broken block**: Cracking/shattering sound

---

## Free Sound Resources

### Sound Effect Libraries

- **Freesound.org** - Huge library, CC-licensed
- **Zapsplat.com** - Professional quality, free tier
- **Sonniss.com** - Annual GDC bundle (free)
- **OpenGameArt.org** - Game-focused assets

### Voice Clips

- **GameSounds.xyz** - Character voice packs
- **Voicy.network** - Voice line collections
- **Record yourself** - Most authentic for characters

### Processing Tools

- **Audacity** - Free audio editor
- **Ocenaudio** - Simple, fast editing
- **REAPER** - Professional DAW (free trial)

---

## Testing Checklist

- [ ] All sound files load without errors
- [ ] Variations play randomly (not same sound twice)
- [ ] Sounds don't spam (100ms cooldown works)
- [ ] Volume levels balanced (no clipping)
- [ ] Sounds sync with animations
- [ ] No audio during death animation spam
- [ ] KO sound plays on exact knockout
- [ ] Sounds work on mobile devices
- [ ] No audio lag/stuttering

---

## Performance Notes

### Sound Pooling

Phaser automatically handles audio pooling. No manual pooling needed.

### Mobile Considerations

- Keep files under 100KB for quick loading
- Use MP3 for universal support
- Test on actual devices (WebAudio API varies)
- Consider audio sprites for many short sounds

### Browser Compatibility

- MP3: Universal support
- OGG: Better quality, Firefox/Chrome
- WebM: Modern browsers only
- Stick to MP3 for best compatibility

---

## Future Enhancements (Phase 2.2-2.3)

### Announcer System

- "Round 1... FIGHT!"
- "Perfect!"
- "K.O.!"
- "Ultra Combo!"
- Character name callouts

### Character-Specific Voices

- Each character has unique voice lines
- Victory quotes
- Taunt sounds
- Select screen voice

### Dynamic Music

- Stage-specific themes
- Music speeds up at low health
- Transitions between calm/intense
- Victory/defeat stingers

---

## Troubleshooting

### Sounds Not Playing

1. Check browser console for load errors
2. Verify file paths in PreloadScene
3. Check AudioManager.init() logs
4. Confirm sound keys match in all locations

### Sounds Playing Too Often

- Adjust `minTimeBetweenSounds` in AudioManager (default: 100ms)
- Check for multiple trigger points firing

### Volume Too Loud/Quiet

- Normalize audio files to -3dB peak
- Adjust volumes in AudioManager constructor
- Use dynamic volume for heavy hits

### Audio Lag

- Reduce file sizes (128kbps MP3)
- Preload in BootScene for critical sounds
- Consider audio sprites for many sounds

---

## Code Examples

### Adding a New Sound Type

```javascript
// 1. In AudioManager.js constructor
this.myNewSounds = [];
this.volumes.myNew = 0.4;
this.lastPlayTime.myNew = 0;

// 2. In AudioManager.init()
for (let i = 1; i <= 3; i++) {
  const key = `mynew${i}`;
  if (this.scene.cache.audio.exists(key)) {
    this.myNewSounds.push(key);
  }
}

// 3. In playRandomVariation() switch
case 'myNew':
  soundPool = this.myNewSounds;
  defaultVolume = this.volumes.myNew;
  break;

// 4. Add convenience method
playMyNew() {
  this.playRandomVariation('myNew');
}
```

### Playing Sounds in Game Code

```javascript
// In any scene with registry access
const audioManager = this.registry.get("audioManager");

// Simple play
audioManager.playImpact();

// With heavy hit
audioManager.playImpact(true);

// Custom volume
audioManager.playRandomVariation("whoosh", 0.8);
```

---

## Quick Reference

| Sound Type   | Files Needed        | Trigger Point  | Status    |
| ------------ | ------------------- | -------------- | --------- |
| Impact       | attack1-5.mp3       | Successful hit | ✅ Done   |
| Whoosh       | whoosh1-3.mp3       | Attack start   | 🔨 Ready  |
| Grunt        | grunt1-3.mp3        | Attack start   | 🔨 Ready  |
| Hit Reaction | hit_reaction1-2.mp3 | Take damage    | ✅ Done   |
| Block        | block1-2.mp3        | Block state    | 🔨 Future |
| KO           | KO.mp3              | Health = 0     | ✅ Done   |

---

**Next Steps:**

1. Find/create whoosh sound effects
2. Record or find character grunt sounds
3. Add dedicated hit reaction sounds
4. Implement block mechanic + sounds
5. Move to Phase 2.2: Announcer System

_"Audio is 50% of the experience!"_ 🔊
