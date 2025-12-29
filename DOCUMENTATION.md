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
- Keyboard, mouse, or gamepad–first controls (Touch is the primary target)
- Complex combo trees or frame-perfect execution systems
- RPG mechanics (levels, stats, equipment, skill trees)
- 3D rendering, Three.js, or WebGL scene graphs
- Desktop-first UX optimizations

---

## 4. Technical Stack

- **Game Engine:** Phaser 3.90.0 (Arcade Physics)
- **Bundler / Dev Server:** Vite 7.3.0
- **Backend:** Node.js + Express 5.2.1
- **Image Processing:** Sharp (WebP conversion + orientation fixing) + heic-convert
- **Logging:** Pino with a custom UnifiedLogger abstraction
- **Testing:** Vitest (Unit, Integration, and E2E simulations)
- **Package Manager:** pnpm (Workspace support for tools)

---

## 5. Repository Structure

```text
shaomeme-fighter/
├── agent-os/              # Project specs, roadmap, and standards
├── assets/                # High-res character spritesheets and portraits
│   └── fighters/          # Per-character folders (ann, mom, dad, etc.)
├── resources/             # Static assets (UI, audio, fonts)
│   ├── api/               # Legacy or mock API data
│   └── PressStart2P.ttf   # Core arcade font
├── photos/                # Raw source photos (city-based)
│   └── [city]/            # Images and notes.json sidecar
├── cache/                 # Server-generated, optimized WebP images
├── server/
│   ├── index.js           # Express server & API routes
│   └── ImageProcessor.js  # HEIC → WebP & Date logic
├── src/
│   ├── index.js           # Game entry point & Phaser config
│   ├── components/        # Game entities (Fighter, VictorySlideshow)
│   ├── scenes/            # Phaser scenes
│   ├── systems/           # Input, AI, Combat, and UI systems
│   ├── utils/             # Shared utilities (Logger, Transitions)
│   └── styles/            # CSS (layout, transitions, effects)
├── tests/                 # Vitest test suites (280+ tests)
├── tools/                 # Standalone development utilities
│   └── photo-manager/     # Visual Master-Detail React tool
└── index.html             # Entry HTML & orientation handling
```

---

## 6. Game Lifecycle

The game follows a strict, linear scene-based state machine:

1. **BootScene**
   - Validates landscape orientation using Phaser Scale Manager.
   - Clears initialization overlays and requests fullscreen on first interaction.

2. **PreloadScene**
   - Loads fighter spritesheets defined in `rosterConfig.js`.
   - Uses **Lazy Loading**: Only loads spritesheets for the selected fighters during transition.
   - Loads global assets (UI sounds, Announcer, common fonts).

3. **SplashScene**
   - Displays game logo and custom branding animations.

4. **MainMenuScene**
   - Displays game logo and a single START action.

5. **CharacterSelectScene**
   - Cinematic background with responsive scaling.
   - Mortal Kombat 11 style grid with metallic borders and dynamic selection glows.
   - Stable portrait scaling to avoid visual jitter during "silhouette-to-reveal" logic.

6. **ArenaSelectScene**
   - Fetches available cities from `/api/cities`.
   - Dynamically preloads one preview image per city folder.

7. **FightScene**
   - The core gameplay loop involving physics, state management, and AI.

---

## 7. Input System — Invisible Combat Zones

To avoid screen clutter, all controls are touch-driven and invisible.

### Left Zone — Movement

- **Dynamic Origin:** First touch defines the joystick center point.
- **Directional Pad:** Distance and angle from origin simulate a D-pad.
- **Drives States:** Controls `WALK`, `JUMP`, and `CROUCH`.

### Right Zone — Actions

- **Tap to Attack:** Any tap in the right half triggers `ATTACK`.
- **Multi-Touch:** Fully supports simultaneous movement and action (`activePointers = 3`).

### Visual Feedback

- **Joystick:** Dynamic ring visualization appears under the thumb on the left.
- **Ripple:** Visual tap feedback on the right for attack confirmation.

---

## 8. Combat Mechanics & AI Behavior

- **State Machine:** `IDLE`, `WALK`, `JUMP`, `ATTACK`, `HIT`, `DIE`, `BLOCK`, `CRUMPLE`.
- **Hit Registration:** Occurs exactly on frame 3 of the attack animation if range (<80px) and facing are valid.
- **Physics:** Arcade Physics with high gravity (`1200`) for a heavy, grounded feel.

### AI Logic (`AIInputController.js`)

The AI uses an adaptive state machine with difficulty-specific behaviors:

- **Nightmare Mode (Default):** Features "Input Reading" to trigger frame-perfect blocks or anti-air counters.
- **Whiff Punishing:** AI detects missed player attacks and responds with guaranteed counter-attacks.
- **No Mercy:** Removal of all "mercy" logic; AI maintains 100% aggression even when winning.
- **Personality Modifiers:** Aggressive personalities get a +20% boost to attack frequency.

---

## 9. Victory Slideshow & Photo Service

### Backend Photo Service

- **Auto-WebP:** Sharp-based backend converts `.heic` and high-res files to optimized `.webp`.
- **Orientation:** Auto-rotates images based on EXIF tags during optimization.
- **Caching:** Stores processed images in `cache/` for instant reuse.

### Robust Date Chain

Dates are determined via a prioritized fallback:

1. **Filename:** Parsed if format matches `YYYY-MM-DD_HH-MM-SS`.
2. **EXIF:** Reads `DateTimeOriginal` or `CreateDate` (Fixed for JS parsing).
3. **mtime:** Modification time (captured if manual fixes were applied).
4. **birthtime:** Creation time fallback.

### Annotation System (Sidecar JSON)

Custom memories are stored in `notes.json` within each city folder.

- **Consistency:** The game and the Photo Manager share the same extraction logic in `ImageProcessor.js`.
- **Manager Tool:** A standalone React app (`tools/photo-manager/`) provides a Master-Detail interface with real-time Polaroid rendering.

---

## 10. Backend API Contracts

### GET `/api/cities`

Returns city folders with photo counts.

```json
[
  { "name": "dublin", "photoCount": 5 },
  { "name": "paris", "photoCount": 12 }
]
```

### GET `/api/photos?city={city}`

Returns merged photo data and identifies orphans.

```json
{
  "photos": [
    {
      "url": "/cache/dublin/img1.webp",
      "filename": "img1.jpg",
      "date": "May 21, 2023",
      "note": "Amazing sunset!"
    }
  ],
  "orphanedNotes": []
}
```

### POST `/api/notes`

Saves custom annotations to the city's `notes.json` file.

---

## 11. Performance Targets

- **Target FPS:** 60 on iPhone 12 and newer.
- **Initial Load Time:** < 3 seconds on 4G.
- **Sprite size guideline:** avoid >2048px unless justified.
- **Slideshow images:** WebP format, ≤ 300 KB each.

---

## 12. Key Architectural Decisions

- **Landscape Enforcement:** Dual-layer (CSS + Phaser) to guarantee layout integrity.
- **Scaling Strategy:** `Phaser.Scale.FIT` with `expandParent: true` for high–aspect ratio devices.
- **Unified Logging:** Abstracted logger handles browser, Vite, and Node environments consistently.
- **Black Curtain Strategy:** Used in post-match transitions to mask main-thread blocking during heavy resource cleanup.
- **UI Isolation:** `UIManager` uses a dedicated camera fixed at 1x zoom to isolate HUD elements from world camera effects.

---

## 13. Relationship to AGENTS.md

- **DOCUMENTATION.md** defines _what the project is_.
- **AGENTS.md** defines _how agents must work within it_.
- Conflicts must be resolved explicitly and documented.

---

## 14. Final Principle

> If a feature does not improve fun, responsiveness, or emotional payoff on mobile, it does not belong in Shaomeme Fighter.
