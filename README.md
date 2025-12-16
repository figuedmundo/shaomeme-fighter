# Shaomeme Fighter

A personalized mobile web fighting game built with **Phaser 3** and **Vite**, inspired by 90s arcade classics like *Street Fighter II* and *Mortal Kombat*. The game features touch-based controls ("Invisible Combat Zones"), a custom roster of characters, and photo rewards.

## Project Overview

*   **Frontend:** Phaser 3 game engine, bundled with Vite.
*   **Backend:** Node.js/Express server for serving the game and providing an API for photo assets.
*   **Platform:** Optimized for mobile (iPad/iPhone) with touch controls, but playable on desktop.
*   **Testing:** Vitest for unit and integration testing.

## Prerequisites

*   Node.js (>=16)
*   pnpm (via `corepack enable` or `npm install -g pnpm`)

## Getting Started

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Start Development Server:**
    ```bash
    pnpm run dev
    ```
    This starts the Vite development server for the frontend at `http://localhost:5173` (or the port shown in your terminal).

3.  **Run Tests:**
    ```bash
    pnpm test
    ```
    Runs the Vitest test suite.

## Production

1.  **Build the Game:**
    ```bash
    pnpm run build
    ```
    This compiles the frontend assets into the `dist/` directory.

2.  **Run Production Server:**
    ```bash
    pnpm run server
    ```
    This runs the Node.js/Express server in production mode. It serves the static files from `dist/` and the API at `http://localhost:3000`.

## Project Structure

*   `src/` - Frontend source code (Phaser scenes, components, systems).
    *   `components/` - Game entities (e.g., `Fighter.js`).
    *   `systems/` - Logic systems (e.g., `TouchInputController.js`).
    *   `scenes/` - Phaser scenes (Boot, Preload, MainMenu, Fight).
*   `server/` - Backend Node.js/Express server logic.
*   `tests/` - Vitest unit tests.
*   `photos/` - Directory for storing personal photo rewards (served by the API).
*   `assets/` & `resources/` - Game assets (images, audio).
*   `dist/` - Production build output.

## Code Style

This project follows **Airbnb** ESLint rules and uses **Prettier** for formatting.
*   Lint: `pnpm run lint`
*   Fix: `pnpm run lint:fix`
