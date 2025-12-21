# Product Roadmap

1. [x] **Project Initialization & Phaser Setup** — Set up Phaser 3 with Vite, create basic scene structure (Boot, MainMenu, Fight), and ensure the Node.js backend serves the app. `XS`
2. [x] **Core Combat System (Phaser Port)** — Port physics, hitboxes, and state machine (Idle, Walk, Attack, Hit) from `temp_clone` to Phaser 3 sprites. `M`
3. [x] **Invisible Combat Zones (Touch Controls)** — Implement split-screen touch input handling for mobile/tablet (Tap/Swipe to attack/move) to replace keyboard input. `S`
4. [x] **Photo Asset Service** — Implement Node.js backend endpoint `/api/photos` to scan and serve images from the `photos/` directory structure. `S`
5. [x] **Dynamic Arena Selector** — Create a scene to select arenas based on available folders in `photos/`, stylizing the selection UI. `M`
6. [x] **Character Roster Integration** — Implement the character selection screen and load custom spritesheets (placeholder or generated) for the specific roster. `M`
7. [x] **Victory Slideshow Reward** — Implement the post-match sequence that fetches and displays a photo slideshow from the arena's location upon winning. `M`
8. [x] **Visual Polish & Branding** — Integrate the new "Shaomeme Fighter" logos, add UI sounds, and apply "game style" filters to background photos. `S`
9. [x] **System-Wide Logging** — Implement a comprehensive logging system across frontend and backend using Pino for improved observability. `S`

> Notes
>
> - **Foundation**: Items 1 & 2 establish the game engine and core loop.
> - **Input**: Item 3 is critical for the target device (iPad).
> - **Personalization**: Items 4, 5, 6, & 7 implement the unique "Personalized Gift" aspect.
> - **Polish**: Item 8 ties it all together visually.

## Phase 1: Game Feel (The "Juice") 🎮

_Make every hit feel impactful_

### 1.1 Hit Feedback ✅ COMPLETE

- [x] **Hit Stop/Freeze Frames** — Pause the game for 50-100ms when attacks land (like Street Fighter) `XS`
- [x] **Screen Shake** — Subtle camera shake on impacts, stronger on heavy hits `XS`
- [x] **Hit Sparks/Particles** — Spawn particle effects at impact points (different colors for light/heavy) `S`
- [x] **Damage Numbers** — Floating damage numbers that bounce and fade `S`
- [x] **Flash/Blink** — Hit character flashes white for 1 frame on impact `XS`

### 1.2 Movement Feel

- [x] **Dust Particles** — Spawn dust clouds when landing, dashing, or turning `S`
- [x] **Character Shadows** — Dynamic oval shadows beneath fighters `XS`
- [x] **Squash & Stretch** — Slight deformation on jumps/lands for more life `S`
- [x] **Motion Blur Trails** — On fast movements/special attacks `S`

### 1.3 Critical Moments

- [x] **Slow Motion Final Hit** — Time slows to 30% when KO blow lands `S`
- [x] **Victory Freeze** — Dramatic pause before victory pose `XS`
- [x] **Round Start Zoom** — Camera zooms in on fighters before "Fight!" `M`
- [x] **Low Health Visual** — Screen edges pulse red when HP < 20% `S`

---

## Phase 2: Audio Design 🔊

_Professional sound brings it to life_

### 2.1 Combat Sounds ✅ IMPLEMENTED (Partial)

- [x] **Punch/Kick Variations** — 3-5 different impact sounds per attack type `S` ✅
- [x] **Hit Reaction Sounds** — Sound when taking damage `S` ✅
- [x] **KO Sound** — Plays on knockout `XS` ✅
- [ ] **Character Grunts** — Attack effort sounds + hit reaction sounds `M` 🔨 (Ready for audio)
- [ ] **Whoosh Sounds** — Air-cutting sounds on swings `S` 🔨 (Ready for audio)
- [ ] **Block Sounds** — Distinct sound for blocked attacks `XS` 🔨 (Future)

> **📝 Implementation Notes:**
>
> - Created `AudioManager` system with sound pooling and variation selection
> - 5 impact sounds (attack1-5.mp3) randomly play on hits
> - Anti-spam protection (100ms cooldown between sounds)
> - Volume control per sound type (impact: 0.5, KO: 0.7)
> - Registry-based system accessible from any scene
> - Whoosh/grunt hooks ready in Fighter.js - just need audio files
> - Full documentation in `AUDIO_IMPLEMENTATION.md`

### 2.2 Announcer/System ✅ IMPLEMENTED

- [x] **Fight Announcer** — "Round 1... Fight!", "KO!", "Perfect!", "You Win!" `M` ✅
- [x] **Combo Callouts** — "3 Hit Combo!", "Ultra Combo!" `S` ✅
- [x] **Character Select Voice** — Each character says their name when selected `M` ✅
- [x] **Victory Quote** — Winner's voice line after match `M` ✅

### 2.3 Music & Ambience ✅ COMPLETE

- [x] **Stage-Specific Music** — Different track per arena (upbeat, looping) `M`
- [x] **Menu Music** — Title screen and character select themes `S`
- [x] **Dynamic Music** — Speeds up at low health or final round `M`
- [x] **UI Sounds** — Menu navigation, button presses, selection confirmations `S`

---

## Phase 3: Visual Fidelity 🎨

_Make it look premium_

### 3.1 Stage Enhancement ✅ COMPLETE

- [x] **Parallax Backgrounds** — Multi-layer scrolling backgrounds for depth `M`
- [x] **Animated Backgrounds** — Moving clouds, swaying trees, ambient characters `L`
- [x] **Dynamic Lighting** — Stage lighting that reacts to time/attacks `M`
- [x] **Weather Effects** — Rain, snow, or fog on certain stages `M`

### 3.2 UI Polish ✅ COMPLETE

- [x] **Stylized Health Bars** — Smooth depleting animation with delayed red bar `S`
- [x] **Character Portraits** — Animated expressions during fight (idle/hit/victory) `M`
- [x] **Round Counter** — Visual indicator of current round (1 of 3) `XS`
- [x] **Match Timer** — 99-second countdown with urgency effects `S`
- [x] **Combo Counter** — On-screen display with flashy animations `S`

### 3.3 Animations

- [x] **Idle Breathing** — Subtle up-down motion when standing `S`
- [x] **Victory Poses** — Unique win animations per character `M`
- [x] **Defeat Animations** — Stumble/fall animations on KO `M`
- [x] **Intro Animations** — Character entrances at round start `L`
- [ ] **Taunt Animation** — Mid-match showboating (risky but fun) `S`

---

## Phase 4: Gameplay Depth ⚔️

_Add strategic layers_

### 4.1 Combat System

- [ ] **Special Moves** — Unique signature moves per character (QCF motion) `L`
- [ ] **Super Meter** — Fills with attacks taken/given, enables super moves `M`
- [x] **Block Mechanic** — Hold back to reduce damage `S`
- [ ] **Throw System** — Close-range unblockable grabs `M`
- [ ] **Juggle System** — Launch attacks that enable air combos `M`

### 4.2 Feedback Systems

- [ ] **Combo Counter** — Track consecutive hits with scaling bonuses `S`
- [ ] **Perfect Round Bonus** — Extra reward for no-damage victories `S`
- [ ] **First Attack Bonus** — Advantage for landing opening hit `XS`
- [ ] **Comeback Mechanic** — Slight damage boost when behind `M`

### 4.3 Difficulty & Balance

- [x] **AI Difficulty Settings** — Easy/Medium/Hard/Nightmare modes `M`
- [ ] **Adaptive AI** — Learns player patterns over time `L`
- [x] **Character Balance Pass** — Ensure fair matchups `M`

---

## Phase 5: Presentation & UX ✨

_Professional polish_

### 5.1 Scene Transitions

- [x] **Screen Wipes** — Stylish transitions between scenes `S`
- [x] **Loading Screens** — Character tips or lore during loads `S`
- [x] **Victory Screen** — Stats, replay, and photo unlock prompt `M`
- [x] **Continue Screen** — Arcade-style countdown after loss `S`

### 5.2 Character Select

- [x] **Stage Preview** — Inprove arena preview when selected `S`
- [x] **Zoom Camera** — Close-up on selected character `S`
- [x] **Voice Lines** — Characters speak when selected `M`

### 5.3 Photo Reward Polish

- [ ] **Photo Transitions** — Elegant fade/slide between photos `S`
- [ ] **Caption Overlays** — Date/location info on photos `S`
- [ ] **Ken Burns Effect** — Slow zoom/pan on photos `S`
- [ ] **Background Music** — Soft music during slideshow `S`
- [ ] **Skip Option** — Tap to skip to next photo `XS`

### 5.4 Accessibility & QoL

- [ ] **Touch Control Tutorial** — First-time overlay explaining controls `S`
- [ ] **Pause Menu** — Access settings mid-fight `S`
- [ ] **Rematch Option** — Quick replay without going to menu `XS`
- [ ] **Practice Mode** — Fight with infinite health to learn combos `M`
- [ ] **Gesture Indicators** — Subtle visual hints for touch zones `S`

---

## Phase 6: Final Touches 🎁

_The gift wrapping_

### 6.1 Branding

- [ ] **Splash Screen** — Animated logo on startup `S`
- [ ] **Credits Screen** — "Made with love for [GF Name]" `XS`
- [ ] **Easter Eggs** — Hidden references to your relationship `S`

### 6.2 Performance

- [ ] **Optimize Assets** — Compress images/audio without quality loss `S`
- [ ] **60 FPS Lock** — Ensure smooth gameplay on iPad `M`
- [ ] **Memory Management** — Proper cleanup between scenes `S`
- [ ] **Load Time Optimization** — Lazy load non-critical assets `M`

### 6.3 Testing

- [ ] **Device Testing** — Test on target iPad/iPhone `M`
- [ ] **Full Playthrough** — Beat arcade mode with each character `M`
- [ ] **Bug Hunt** — Edge cases, softlocks, visual glitches `M`
- [ ] **Balance Testing** — Ensure no character is overpowered `M`

---

## Prioritized Implementation Order

### Week 1: Immediate Impact (Must-Have)

1. Hit stop + screen shake + hit sparks
2. Combat sounds (punches, grunts)
3. Announcer ("Fight!", "KO!")
4. Victory/defeat animations ✅
5. Health bar smooth depletion

### Week 2: Professional Feel (Should-Have)

6. Stage music
7. Combo counter
8. Character portraits
9. Parallax backgrounds
10. Special moves framework

### Week 3: Premium Details (Nice-to-Have)

11. Slow motion final hit
12. Animated backgrounds
13. Super meter system
14. Victory screen polish
15. Photo slideshow enhancements

---

## Key Principles

**Feel Over Features**

- It's better to have fewer mechanics that feel amazing than many that feel flat
- Spend extra time on hit feedback—it's the core loop

**Audio is 50% of the Experience**

- Even placeholder sounds make a huge difference
- Free resources: Freesound.org, Zapsplat.com

**Steal Shamelessly**

- Watch frame-by-frame videos of Street Fighter/Guilty Gear
- Notice the freeze frames, particle timing, camera movements

**Test on Real Device**

- Touch controls feel different on actual iPad vs browser
- Performance matters—maintain 60fps

**Iterate the Core Loop First**

- Polish the basic punch → hit reaction → recovery cycle
- Everything else is icing

---

_"A delayed game is eventually good, but a rushed game is forever bad." — Shigeru Miyamoto_

Make it feel like you spent $60 on it. She's worth it. 💝
