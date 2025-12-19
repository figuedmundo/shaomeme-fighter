# Phase 3.2: UI Polish - Integration Guide

## Files Created ✅

All UI component files have been created:

1. **StylizedHealthBar.js** - Smooth depletion health bars
2. **CharacterPortrait.js** - Animated character portraits  
3. **RoundCounter.js** - Visual round indicator
4. **MatchTimer.js** - 99-second countdown with urgency
5. **EnhancedComboDisplay.js** - Professional combo counter
6. **UIManager.js** - Unified UI coordination system

## Integration Steps

### Step 1: Add Files to Project

Copy these files to their locations:
```
src/
├── components/
│   ├── StylizedHealthBar.js       ← NEW
│   ├── CharacterPortrait.js       ← NEW
│   └── EnhancedComboDisplay.js    ← NEW
└── systems/
    ├── RoundCounter.js             ← NEW
    ├── MatchTimer.js               ← NEW
    └── UIManager.js                ← NEW
```

### Step 2: Import UIManager in FightScene ✅ DONE

```javascript
// PHASE 3.2: UI Polish
import UIManager from "../systems/UIManager";
```

### Step 3: Initialize UIManager in FightScene

Add after fighters are created (around line 130):

```javascript
// PHASE 3.2: UI System
this.uiManager = new UIManager(this, {
  p1Character: p1Texture,
  p1Name: this.getCharacterName(p1Texture),
  p2Character: p2Texture,
  p2Name: this.getCharacterName(p2Texture),
  totalRounds: 3,
  matchTime: 99,
  onTimeUp: () => this.handleTimeUp(),
  onLowTime: () => this.handleLowTime()
});

// Start timer after round sequence
logger.debug("FightScene: UI Manager initialized");
```

### Step 4: Replace Old Combo System

Replace the old `ComboOverlay` calls with `UIManager`:

**OLD:**
```javascript
this.comboOverlay = new ComboOverlay(this);
// Later:
this.comboOverlay.updateCombo(this.comboCounter);
```

**NEW:**
```javascript
// In processComboHit():
this.uiManager.updateCombo(this.comboCounter, true); // true = P1 attacking
```

### Step 5: Update Health on Damage

In `Fighter.takeDamage()` or wherever health changes:

```javascript
takeDamage(amount) {
  this.health -= amount;
  
  // Update UI
  const playerNum = this === this.scene.player1 ? 1 : 2;
  if (this.scene.uiManager) {
    this.scene.uiManager.updateHealth(playerNum, this.health);
  }
}
```

### Step 6: Start Timer After Round Intro

In `startRoundSequence()`, add timer start:

```javascript
this.time.delayedCall(2000, () => {
  this.announcerOverlay.showFight();
  if (this.audioManager) this.audioManager.playAnnouncer("fight");

  this.inputEnabled = true;
  if (this.player1) this.player1.setInputEnabled(true);
  if (this.player2) this.player2.setInputEnabled(true);
  
  // PHASE 3.2: Start match timer
  if (this.uiManager) {
    this.uiManager.startTimer();
  }
});
```

### Step 7: Handle Victory

In `checkWinCondition()`:

```javascript
checkWinCondition() {
  if (this.player1.health <= 0 || this.player2.health <= 0) {
    this.isGameOver = true;
    this.physics.pause();

    // PHASE 3.2: Stop timer and show victory UI
    if (this.uiManager) {
      this.uiManager.stopTimer();
      
      const winner = this.player1.health > 0 ? 1 : 2;
      this.uiManager.showVictory(winner);
    }

    // ... rest of victory logic
  }
}
```

### Step 8: Add Helper Method

Add to FightScene:

```javascript
/**
 * Get character display name from texture key
 */
getCharacterName(textureKey) {
  const names = {
    'ann': 'Ann',
    'mom': 'Mom',
    'dad': 'Dad',
    'brother': 'Brother',
    'old_witch': 'Old Witch',
    'fat': 'Fat',
    'fresway_worker': 'Fresway Worker',
    'ryu': 'Ryu',
    'ken': 'Ken'
  };
  return names[textureKey] || textureKey.toUpperCase();
}

/**
 * Handle timer reaching zero
 */
handleTimeUp() {
  if (this.isGameOver) return;
  
  logger.info("Time's up!");
  this.isGameOver = true;
  this.physics.pause();
  
  // Determine winner by health
  const winner = this.player1.health > this.player2.health ? 1 : 2;
  
  if (this.uiManager) {
    this.uiManager.showVictory(winner);
  }
  
  // Continue with victory sequence
  this.time.delayedCall(2000, () => {
    if (this.announcerOverlay) {
      const winnerName = winner === 1 ? 
        this.getCharacterName(this.player1.texture.key) : 
        this.getCharacterName(this.player2.texture.key);
      this.announcerOverlay.showWin(winnerName);
    }
    
    this.time.delayedCall(2000, () => {
      this.slideshow.show(this.city);
    });
  });
}

/**
 * Handle low time warning (10 seconds)
 */
handleLowTime() {
  logger.warn("Low time warning!");
  
  // Play urgency sound if available
  if (this.audioManager && this.audioManager.sound) {
    // this.audioManager.playUrgency();
  }
  
  // Speed up music slightly
  if (this.audioManager) {
    this.audioManager.setMusicRate(1.1);
  }
}
```

### Step 9: Cleanup in shutdown()

```javascript
shutdown() {
  logger.info("FightScene: Shutting down...");
  
  // Existing cleanup...
  if (this.hitFeedback) this.hitFeedback.destroy();
  if (this.movementFX) this.movementFX.destroy();
  if (this.criticalMoments) this.criticalMoments.destroy();
  
  // PHASE 3.2: Cleanup UI
  if (this.uiManager) {
    this.uiManager.destroy();
    this.uiManager = null;
  }
  
  // PHASE 3.1 cleanup...
  // ...
}
```

## Testing Checklist

After integration:

- [ ] Health bars appear at top
- [ ] Portraits show character images
- [ ] Health depletes smoothly when hit
- [ ] Red delayed bar follows health drop
- [ ] Portrait flashes on damage
- [ ] Round counter shows at top center
- [ ] Timer counts down from 99
- [ ] Timer turns yellow at 30s
- [ ] Timer turns red and pulses at 10s
- [ ] Combo counter appears on hits
- [ ] Combo changes color with size
- [ ] Milestone text shows (GOOD, GREAT, etc.)
- [ ] Victory shows spotlight on winner
- [ ] KO portrait becomes grayscale
- [ ] Time up triggers correctly
- [ ] All UI cleans up on scene end

## UI Layout

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [P1 Portrait]         [ROUND 1]         [P2 Portrait]  │
│  [══════════]            [99]            [══════════]    │
│                                                          │
│                      GAMEPLAY AREA                       │
│                                                          │
│                    [5 HITS]                              │
│                    GREAT!                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Key Features

### Health Bars
- ✅ Smooth depletion animation
- ✅ Delayed red bar (damage indicator)
- ✅ Color changes (green → yellow → orange)
- ✅ Flash on damage
- ✅ Pulse on low health
- ✅ Stylized borders

### Portraits
- ✅ Character-specific images
- ✅ Animated expressions (idle, hit, victory, KO)
- ✅ Flash on damage
- ✅ Breathing animation when idle
- ✅ Grayscale when KO'd
- ✅ Name display

### Round Counter
- ✅ Shows current round
- ✅ Visual indicators for wins
- ✅ P1 wins (left) vs P2 wins (right)
- ✅ Animations on round change
- ✅ Flash effects

### Match Timer
- ✅ Counts from 99 to 0
- ✅ Color progression (green → yellow → red)
- ✅ Pulse animation at 10s
- ✅ Faster pulse at 5s
- ✅ Time up callback

### Combo Display
- ✅ Large animated numbers
- ✅ Color progression with combo size
- ✅ Milestone callouts
- ✅ Particle effects
- ✅ Smooth fade in/out
- ✅ Positioned by attacker side

## Performance Notes

All UI components are optimized:
- Uses object pooling where applicable
- Efficient tween reuse
- Minimal draw calls
- Proper cleanup
- Expected impact: < 1ms per frame

## Customization

### Adjust Health Bar Size
In UIManager.create():
```javascript
const healthBarWidth = 400; // Change this
const healthBarHeight = 30;  // Or this
```

### Change Timer Starting Value
In UIManager constructor config:
```javascript
matchTime: 99 // Change to 60, 90, etc.
```

### Modify Combo Colors
In EnhancedComboDisplay.getComboColor():
```javascript
if (count >= 10) return '#ff00ff'; // Change these
else if (count >= 7) return '#ff0000';
// etc.
```

### Portrait Size
In UIManager.create():
```javascript
const portraitSize = 100; // Change this
```

## Next Steps

1. ✅ Copy all files
2. ✅ Import UIManager
3. [ ] Initialize UIManager in create()
4. [ ] Replace combo system
5. [ ] Update health on damage
6. [ ] Start timer after intro
7. [ ] Handle victory UI
8. [ ] Add helper methods
9. [ ] Add cleanup
10. [ ] Test everything!

---

**Phase 3.2 will transform your UI from basic to professional fighting game quality!** 🎮✨
