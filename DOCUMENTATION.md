# Shaomeme Fighter — Technical Documentations

## 1. Project Overview

**Shaomeme Fighter** is a personalized, mobile-first fighting game built with **Phaser 3** and **Vite**. It recreates the _feel_ of 90s arcade fighters (Street Fighter, Mortal Kombat) while leveraging modern web technologies and a unique, emotionally driven reward system called **Memory Arenas**.

This document is **authoritative**. It defines what the project _is_, what it _is not_, and the constraints under which all development—human or AI—must operate.

---

## 2. Vision and Core Pillars

### Vision

Deliver an arcade-quality fighting experience on mobile web that prioritizes **feel, immediacy, and emotional payoff** over complexity or realism.

### Core Pillars

- **Personalization**
  Fighters represent real people. Arenas are tied to real locations and unlock personal photo memories.

- **Mobile-First Design**
  Designed explicitly for iPhone and iPad in landscape mode. Touch-driven input replaces traditional button-heavy layouts.

- **Memory Reward System**
  Winning a fight unlocks a cinematic slideshow of personal photos, transforming victory into an emotional reward rather than a numeric score.

---

## 3. Non-Goals (Explicitly Out of Scope)

The following are **intentionally not part** of Shaomeme Fighter:

- Online or networked multiplayer
- Keyboard, mouse, or gamepad–first controls
- Complex combo trees or frame-perfect execution systems
- RPG mechanics (levels, stats, equipment, skill trees)
- 3D rendering, Three.js, or WebGL scene graphs
- Desktop-first UX optimizations

Any proposal affecting these areas must be explicitly approved and documented.

---

## 4. Technical Stack

- **Game Engine:** Phaser 3.90.0 (Arcade Physics)
- **Bundler / Dev Server:** Vite 7.3.0
- **Backend:** Node.js + Express 5.2.1
- **Image Processing:** Sharp (WebP conversion) + heic-convert (iPhone photos)
- **Logging:** Pino with a custom UnifiedLogger abstraction
- **Testing:** Vitest (Unit, Integration, and E2E simulations)
- **Package Manager:** pnpm

---

## 5. Repository Structure

```text
shaomeme-fighter/
├── assets/                # High-res character spritesheets and portraits
│   └── fighters/          # Per-character folders (ann, mom, dad, etc.)
├── resources/             # Static assets (UI, audio, fonts)
│   ├── api/               # Legacy or mock API data
│   └── PressStart2P.ttf   # Core arcade font
├── photos/                # Raw source photos (city-based)
├── cache/                 # Server-generated, optimized WebP images
├── server/
│   ├── index.js           # Express server & API routes
│   └── ImageProcessor.js  # HEIC → WebP processing logic
├── src/
│   ├── index.js           # Game entry point & Phaser config
│   ├── components/        # Game entities (Fighter, VictorySlideshow)
│   ├── scenes/            # Phaser scenes
│   ├── systems/           # Input, combat, and game logic systems
│   ├── utils/             # Shared utilities (UnifiedLogger)
│   └── styles/            # CSS (layout, transitions, effects)
├── tests/                 # Vitest test suites
└── index.html             # Entry HTML & orientation handling
```

---

## 6. Game Lifecycle (Current Implementation)

The game follows a strict, linear scene-based state machine:

1. **HTML Entry (`index.html`)**
   - Full-screen black container
   - CSS-based portrait orientation block

2. **BootScene**
   - Validates landscape orientation using Phaser Scale Manager
   - Clears initialization overlays
   - Requests fullscreen on first user interaction

3. **PreloadScene**
   - Loads fighter spritesheets defined in `rosterConfig.js`
   - Loads essential audio assets
   - Displays arcade-style loading feedback

4. **MainMenuScene**
   - Displays game logo and a single START action

5. **CharacterSelectScene**
   - Cinematic background with responsive scaling
   - Mortal Kombat 11 style grid with vertical rectangular portraits
   - Metallic border effects and dynamic selection glows
   - Stable portrait scaling to avoid visual jitter

6. **ArenaSelectScene**
   - Fetches available cities from the backend
   - Dynamically preloads one preview image per city

7. **FightScene**
   - Core gameplay loop

---

## 7. Input System — Invisible Combat Zones (Current Implementation)

To avoid screen clutter, all controls are touch-driven and invisible.

### Left Zone — Movement

- First touch defines a dynamic joystick origin
- Distance and angle simulate a directional pad
- Drives fighter states: `WALK`, `JUMP`, `CROUCH`

### Right Zone — Actions

- Any tap triggers `ATTACK`
- Fully supports multi-touch

### Visual Feedback

- Dynamic joystick visualization (left)
- Ripple feedback on action taps (right)

No physical or on-screen buttons are assumed.

---

## 8. Combat Mechanics (Current Implementation)

- **State Machine:** `IDLE`, `WALK`, `JUMP`, `ATTACK`, `HIT`, `DIE`
- **Hit Registration:** Occurs on animation frame 3 if range and facing are valid
- **Physics:** Phaser Arcade Physics with high gravity (`1200`) for a heavy, grounded feel

### Rationale

Arcade Physics was chosen for predictability, performance, and ease of tuning on mobile devices. More complex physics engines were intentionally avoided.

---

## 9. Victory Slideshow & Photo Service

### Backend Photo Service (Current Implementation)

- Watches the `photos/` directory
- Automatically converts `.heic` files to optimized `.webp`
- Stores processed images in `cache/` for instant reuse

### VictorySlideshow Component

When an opponent is defeated:

1. Physics pauses after death animation
2. Photos are fetched from the backend
3. A cinematic slideshow is displayed
   - Sepia and contrast filters
   - Smoke-style border overlay
   - Music transition from combat to ambient

4. Slideshow loops until user interaction

---

## 10. Backend API Contracts

### GET `/api/cities`

Response:

```json
{
  "cities": ["dublin", "paris"]
}
```

### GET `/api/photos?city={city}`

Response:

```json
{
  "city": "dublin",
  "photos": ["/cache/dublin/01.webp", "/cache/dublin/02.webp"]
}
```

---

## 11. Performance Targets

- Target FPS: 60 on iPhone 12 and newer
- Initial load time: < 3 seconds on 4G
- Sprite size guideline: avoid >2048px unless justified
- Slideshow images: WebP, ≤ 300 KB each

Performance regressions must be treated as defects.

---

## 12. Key Architectural Decisions

- **Landscape Enforcement:** Dual-layer (CSS + Phaser) to guarantee layout integrity
- **Scaling Strategy:** `Phaser.Scale.FIT` with `expandParent: true` for high–aspect ratio devices
- **Unified Logging:** Abstracted logger to handle browser and Node environments consistently
- **Multi-Touch:** `activePointers = 3` to enable simultaneous movement and attacks

All decisions prioritize mobile stability, simplicity, and player feel.

---

## 13. Relationship to AGENTS.md

- **DOCUMENTATION_v2.md** defines _what the project is_
- **AGENTS.md** defines _how agents must work within it_

If conflicts arise, they must be explicitly resolved and documented.

---

## 14. Final Principle

> If a feature does not improve fun, responsiveness, or emotional payoff on mobile, it does not belong in Shaomeme Fighter.
