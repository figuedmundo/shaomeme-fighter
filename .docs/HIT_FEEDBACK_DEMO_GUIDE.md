# Hit Feedback System - Visual Demo Guide

This guide shows you what to look for when testing the new hit feedback system.

## Testing the System

### Starting a Fight

1. Run the game: `pnpm dev`
2. Navigate through: Main Menu → Character Select → Arena Select → Fight
3. Land hits by pressing SPACE or tapping the right side of the screen

---

## What You Should See

### 1. Hit Stop/Freeze Frame ⏸️

**When:** The moment an attack lands
**What to look for:**

- Everything freezes for ~60ms (barely noticeable but VERY impactful)
- Both fighters stop mid-animation
- No movement happens during this brief pause
- Game resumes smoothly after

**Feel:** Like the game is "acknowledging" your hit with weight and impact

---

### 2. Screen Shake 📳

**When:** Immediately after hit lands
**What to look for:**

- Camera shakes slightly (4 pixels for normal hits)
- Movement is quick but noticeable (~150ms)
- Stronger shakes for potential heavy hits (8 pixels, 200ms)
- Returns to center position smoothly

**Feel:** The impact ripples through the entire game world

---

### 3. Hit Sparks ✨

**When:** At the point of impact between fighters
**What to look for:**

- White particles burst out from the impact point
- 8 particles for normal hits, 12 for heavy
- Particles fly outward in all directions
- They fade and fall with gravity
- Heavy hits have orange/yellow sparks (0xffaa00)

**Look at:** The space between the two fighters when a hit connects

**Feel:** A visual "explosion" confirming the hit location

---

### 4. Damage Numbers 💥

**When:** Every hit that lands
**What to look for:**

- White number appears at impact point (showing "10")
- Uses arcade font (Press Start 2P)
- Black outline for visibility
- Floats upward 80 pixels
- Scales up to 1.5x size while fading out
- Takes 800ms to complete animation

**Look at:** Just above the defender's head/chest area

**Feel:** Clear feedback on how much damage you dealt

---

### 5. White Flash ⚡

**When:** The exact frame the hit connects
**What to look for:**

- Defender turns pure white for ONE FRAME (16ms)
- Very brief but noticeable
- Returns to normal color immediately
- Classic 2D fighting game effect

**Look closely:** This is FAST - blink and you might miss it!

**Feel:** Instant visual "ping" that the hit registered

---

## Combined Effect Timeline

Here's what happens in sequence when you land a hit:

```
Frame 0:  Attack animation frame 3 (hit detection)
          ↓
Frame 1:  - White flash on defender (1 frame)
          - Hit stop begins (freeze all)
          - Screen shake starts
          - Particles spawn
          - Damage number spawns
          ↓
Frames 2-4: (Everything frozen ~60ms)
          ↓
Frame 5:  - Freeze ends, game resumes
          - Screen shake continues
          - Particles flying/fading
          - Damage number floating up
          - Defender enters HIT state
          ↓
Frames 6-10: - Screen shake ends (~150ms)
             - Particles continue falling
             - Damage number still floating
             ↓
Frames 11-48: - Damage number finishes animation (800ms total)
              - Particles fully faded
              - Defender recovers from hitstun (300ms)
```

---

## Testing Different Scenarios

### Normal Hit (Current Implementation)

- Press SPACE at close range
- All effects at normal intensity
- Damage: 10

### Future: Heavy Hit

- Currently not implemented (always uses normal values)
- Will trigger with special moves/combos
- Longer freeze (100ms vs 60ms)
- Stronger shake (8px vs 4px)
- More sparks (12 vs 8)
- Orange particles instead of white
- Damage: 20+

---

## Debugging Tips

### Check Console Logs

Look for these log messages:

```
[Frontend:HitFeedbackSystem] Triggering hit feedback: 10 damage
[Frontend:HitFeedbackSystem] Hit stop for 60ms
[Frontend:HitFeedbackSystem] Screen shake: intensity=4, duration=150ms
[Frontend:HitFeedbackSystem] Hit sparks spawned at (200, 210), count=8, heavy=false
[Frontend:HitFeedbackSystem] Damage number spawned: 10 at (200, 210)
[Frontend:HitFeedbackSystem] Fighter flash triggered for ken
[Frontend:HitFeedbackSystem] Hit stop ended
```

### No Effects Showing?

**Problem:** Hit stop not working

- Check: Are animations continuing during hits?
- Fix: Verify physics.pause() and anims.pauseAll() are being called

**Problem:** No particles

- Check: Do you see particles at all? (Even when not hitting)
- Fix: Check browser console for texture generation errors

**Problem:** No damage numbers

- Check: Is the Press Start 2P font loaded?
- Fix: Verify font is in resources folder and loaded in PreloadScene

**Problem:** No white flash

- Check: Is defender briefly turning white?
- Fix: Verify setTint/clearTint are working on Fighter sprites

**Problem:** No screen shake

- Check: Is the entire canvas moving?
- Fix: Verify camera.shake() intensity is > 0

---

## Performance Monitoring

The system is optimized for 60fps, but watch for:

1. **Frame drops during hit stop** → Expected, this is intentional
2. **Frame drops after hit stop** → Not expected, investigate particle count
3. **Memory leaks** → Check if particles are being properly destroyed
4. **Multiple hit stops overlapping** → Should be prevented by `isHitStopActive` flag

---

## Comparison with Other Games

### Street Fighter III: Third Strike

- Heavy hit stop (our 100ms setting)
- Dramatic screen shake
- Particle effects on every hit
- Damage numbers in competitive mode

### Guilty Gear Strive

- Extreme hit stop on counter hits
- Explosive particle effects
- Screen flash effects
- Dramatic slow motion on final blow

### Mortal Kombat 11

- Medium hit stop
- Blood particles (we use sparks)
- X-ray damage numbers
- Dramatic camera movement

**Shaomeme Fighter hits that sweet spot between arcade classic and modern polish!**

---

## Next Steps

Once you've verified all effects work:

1. ✅ Test on iPad (target device)
2. ✅ Verify 60fps is maintained
3. ✅ Try rapid consecutive hits
4. ✅ Test with both fighters attacking simultaneously
5. ✅ Confirm all effects feel "juicy" and satisfying

Then move on to **Phase 1, Task 1.2: Movement Feel**! 🎮

---

**Remember:** The goal is to make every single hit feel AMAZING. These small details compound to create that "arcade magic" feeling! ✨
