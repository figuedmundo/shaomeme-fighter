# Shaomeme Fighter

## Project Overview

Shaomeme Fighter is a personalized mobile web fighting game built with **Phaser 3** and **Vite**, inspired by 90s arcade classics. The game is designed primarily for iPad/iPhone and features touch-based controls ("Invisible Combat Zones"), a custom roster of characters, and "Memory Arenas" where winning unlocks photo slideshows.

The project consists of:
*   **Frontend:** A Phaser 3 game utilizing ES Modules, bundled with Vite.
*   **Backend:** A Node.js/Express server that serves the static game files and provides an API (`/api/photos`) to access photo assets stored on the file system.
*   **Testing:** Unit tests powered by **Vitest**.

## Building and Running

### Prerequisites
*   Node.js (>=16)
*   pnpm

### Key Commands

*   **Install Dependencies:**
    ```bash
    pnpm install
    ```

*   **Start Development Server:**
    ```bash
    pnpm run dev
    ```
    Starts the Vite development server for the frontend.

*   **Run Tests:**
    ```bash
    pnpm test
    ```
    Runs the Vitest unit tests.

*   **Build for Production:**
    ```bash
    pnpm run build
    ```
    Compiles the frontend assets using Vite.

*   **Start Backend Server:**
    ```bash
    pnpm run server
    ```
    Runs the Node.js/Express server (located in `server/index.js`).

*   **Linting & Formatting:**
    ```bash
    pnpm run lint
    pnpm run lint:fix
    ```
    Checks and fixes code style issues using ESLint (Airbnb config) and Prettier.

## Development Conventions

*   **Code Style:** The project strictly follows **ESLint** (Airbnb) and **Prettier** rules. Always run `pnpm run lint:fix` before committing.
*   **Architecture:**
    *   **Game Logic:** Located in `src/components/` (Entities like `Fighter.js`) and `src/systems/` (Logic like `TouchInputController.js`).
    *   **Scenes:** Phaser scenes are managed in `src/scenes/` (e.g., `BootScene`, `MainMenuScene`, `FightScene`).
    *   **Configuration:** Game constants and settings are in `src/config/`.
    *   **Backend:** Server-side logic resides in the `server/` directory.
*   **Documentation:** Detailed product specifications (Mission, Roadmap, Tech Stack) and coding standards are maintained in the `agent-os/` directory.
*   **Assets:** Game assets (images, audio) are in `resources/` and `assets/`, while personal photos for the game rewards are in `photos/`.
