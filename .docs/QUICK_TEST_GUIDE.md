# Quick Start: Testing Hit Feedback

## 🚀 Start the Game

```bash
pnpm dev
```

Navigate: **Main Menu** → **Character Select** → **Arena Select** → **Fight**

---

## ⌨️ Controls

### Player 1 (Left Fighter)

- **Move:** Arrow keys (←↑↓→)
- **Attack:** SPACE

### Player 2 (Right Fighter) - AI Controlled

- Fights back automatically

### Touch Controls (iPad/Mobile)

- **Left side:** Virtual joystick (move)
- **Right side:** Tap to attack

---

## 👀 What to Watch For

### Every time you land a hit, you should see ALL of these:

1. **⏸️ Brief Freeze** (60ms)
   - Game pauses
   - Everything stops

2. **📳 Screen Shake** (150ms)
   - Whole screen vibrates
   - Quick but noticeable

3. **✨ White Sparks** (300ms)
   - 8 particles burst out
   - Fly and fade with gravity
   - At impact point

4. **💥 Damage Number** (800ms)
   - White "10" appears
   - Floats up and fades
   - Arcade font

5. **⚡ White Flash** (16ms - ONE FRAME)
   - Defender turns white
   - VERY brief
   - Blink and you miss it

---

## ✅ Quick Test Sequence

1. **Start a fight**
2. **Move close to opponent** (use arrow keys)
3. **Press SPACE** to attack
4. **Watch for all 5 effects**

If you see all 5 effects → **IT WORKS!** ✅

---

## 🐛 If Something's Wrong

Check browser console for logs:

```
[Frontend:HitFeedbackSystem] Triggering hit feedback: 10 damage
[Frontend:HitFeedbackSystem] Hit stop for 60ms
[Frontend:HitFeedbackSystem] Screen shake: intensity=4, duration=150ms
...
```

No logs? Check that FightScene initialized the system.

---

## 📊 Run Tests

```bash
pnpm test HitFeedbackSystem
```

All tests should pass:

```
✓ HitFeedbackSystem (10 tests)
  ✓ Initialization
  ✓ triggerHitFeedback
  ✓ hitStop
  ✓ screenShake
  ✓ spawnHitSparks
  ✓ spawnDamageNumber
  ✓ flashFighter
  ✓ destroy
```

---

## 🎯 Success Criteria

- [ ] Hit freeze happens when attack lands
- [ ] Screen shakes on impact
- [ ] Particles appear between fighters
- [ ] Damage number floats up
- [ ] Defender flashes white briefly
- [ ] All effects happen together
- [ ] No console errors
- [ ] Smooth 60fps (except during freeze)

---

## 🎮 Pro Tips

1. **Land multiple hits quickly** to see effects chain together
2. **Watch in slow motion** (if browser supports) to see the flash
3. **Try both fighters** - effects work for both P1 and P2
4. **Check particle colors** - should be pure white (0xffffff)
5. **Listen to your gut** - does it FEEL good? That's what matters!

---

## ✨ That's It!

If everything works, you've successfully implemented professional-grade hit feedback!

**Next:** Move on to Phase 1.2 (Movement Feel) when ready. 🚀

---

**Phase 1, Task 1.1 - COMPLETE** ✅
