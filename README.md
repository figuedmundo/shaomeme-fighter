# Shaomeme Fighter

A personalized mobile web fighting game built with **Phaser 3** and **Vite**, inspired by 90s arcade classics like _Street Fighter II_ and _Mortal Kombat_. The game is designed primarily for iPad/iPhone and features touch-based controls ("Invisible Combat Zones"), a custom roster of characters, and "Memory Arenas" where winning unlocks photo rewards.

## Project Overview

Shaomeme Fighter aims to provide a unique and personalized gaming experience.

- **Frontend:** The game runs on the **Phaser 3** game engine, utilizing ES Modules, bundled with **Vite** for a fast development experience and optimized production builds.
- **Backend:** A **Node.js/Express** server (`server/index.js`) serves the static game files and provides a robust API (`/api/photos`) to access personalized photo assets and manage custom notes.
- **Platform:** Optimized for mobile (iPad/iPhone) with intuitive touch controls, but fully playable on desktop browsers.
- **Testing:** Unit and integration tests are powered by **Vitest** to ensure code quality and functionality.

## Key Features

- **Invisible Combat Zones:** Intuitive touch-based input system optimized for mobile devices, allowing for dynamic movement and attacks without cluttering the screen with virtual buttons.
- **Nightmare AI Overhaul:** A relentless AI system featuring "Input Reading" for instant blocks/counters, "Whiff Punishing," and zero "mercy" logic.
- **Memory Arenas:** Fight in stages based on real-world locations visited during travels.
- **Victory Slideshow Reward:** Upon winning, players view a cinematic slideshow with handwriting date stamps and custom memories (notes) stored in `notes.json`.
- **Visual & Audio Polish:** Cinematic filters, screen shake, hit stop, parallax backgrounds, and responsive UI sounds.

## Prerequisites

- **Node.js** (version 16 or higher)
- **pnpm** (Workspace support enabled)

## Getting Started

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Prepare Photo Assets:**
    - Place photos in `photos/[city_name]/`.
    - **Rename:** Run `node scripts/rename_photos.js` to standardize names to `YYYY-MM-DD_HH-MM-SS.jpg`.
    - **Optimize:** Run `pnpm optimize` to compress images and fix orientation.

3.  **Start Development Servers:**
    To run the full environment concurrently:

    ```bash
    # Terminal 1: Backend Server (Handles API and Images)
    pnpm run server
    # Runs at http://localhost:3000

    # Terminal 2: Game Frontend
    pnpm run dev
    # Runs at http://localhost:5173

    # (Optional) Terminal 3: Photo Manager Tool
    pnpm manager
    # Runs at http://localhost:5174
    ```

## Tools & Utilities

### Visual Photo Manager

A standalone React tool located in `tools/photo-manager/` for managing memories.

- **Master-Detail View:** Select photos from a list and edit notes in a large side-panel.
- **Real-time Preview:** See exactly how the photo, date, and note will look in the game's Polaroid frame.
- **Run:** `pnpm manager` (Ensure the main server is running).

### CLI Scripts

- `scripts/rename_photos.js`: Scans folders and renames files based on EXIF/mtime.
- `scripts/optimize-assets.js`: Compresses large assets while preserving orientation.
- `scripts/update_photo_date.js`: Manually corrects internal or filesystem timestamps.
- `scripts/add_photo_note.js`: Adds a quick annotation to a photo from the CLI.

## Testing

The project uses **Vitest** for unit and integration testing.

- **Run All Tests:**
  ```bash
  pnpm test
  ```
- **Run Specific Tests:**
  ```bash
  pnpm test -- tests/AIController.test.js
  ```

## Production Build & Deployment

1.  **Build the Game:**
    ```bash
    pnpm run build
    ```
2.  **Run Production Server:**
    Starts the Express server which serves the `dist/` folder.
    ```bash
    pnpm run server
    ```

## Project Structure

- `src/`
  - `components/` - Game entities (Fighter, VictorySlideshow).
  - `systems/` - Core logic (Input, AI, UIManager, HitFeedback).
  - `scenes/` - Phaser scenes (Boot, Preload, Fight, etc.).
  - `styles/` - Global and component CSS.
- `server/` - Node.js/Express API and `ImageProcessor.js`.
- `tools/` - Standalone React utilities.
- `tests/` - Vitest test suites (280+ tests).
- `photos/` - Source images and `notes.json` sidecar files.
- `assets/` & `public/` - Static assets, fonts, and character sprites.
- `agent-os/` - Product specifications, roadmap, and development standards.

## Development Standards

- **Code Style:** Strictly adheres to **Airbnb** ESLint rules and Prettier.
- **Architecture:** Component-based Phaser structure with clear logic/render separation.
- **Git Hooks:** `simple-git-hooks` runs linting and formatting before every commit.

## Troubleshooting

- **Port Conflicts:** Ensure ports 3000, 5173, and 5174 are available.
- **Missing Previews:** The backend server (`pnpm server`) must be active for the Manager tool to show images.
- **Date Discrepancies:** The system uses a chain: Filename > EXIF > mtime. If a date is wrong, use `scripts/update_photo_date.js`.

---

For more detailed technical documentation, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.
