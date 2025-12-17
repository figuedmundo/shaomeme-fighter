# Shaomeme Fighter

A personalized mobile web fighting game built with **Phaser 3** and **Vite**, inspired by 90s arcade classics like *Street Fighter II* and *Mortal Kombat*. The game is designed primarily for iPad/iPhone and features touch-based controls ("Invisible Combat Zones"), a custom roster of characters, and "Memory Arenas" where winning unlocks photo slideshows.

## Project Overview

Shaomeme Fighter aims to provide a unique and personalized gaming experience.
*   **Frontend:** The game runs on the **Phaser 3** game engine, utilizing ES Modules, bundled with **Vite** for a fast development experience and optimized production builds.
*   **Backend:** A **Node.js/Express** server (`server/index.js`) serves the static game files and provides a robust API (`/api/photos`) to access personalized photo assets stored on the file system.
*   **Platform:** Optimized for mobile (iPad/iPhone) with intuitive touch controls, but fully playable on desktop browsers.
*   **Testing:** Unit and integration tests are powered by **Vitest** to ensure code quality and functionality.

## Key Features

*   **Invisible Combat Zones:** Intuitive touch-based input system optimized for mobile devices, allowing for dynamic movement and attacks without cluttering the screen with virtual buttons.
*   **Custom Character Roster:** Play with and against a custom set of characters.
*   **Memory Arenas:** Fight in stages based on real-world locations.
*   **Victory Slideshow Reward:** Upon winning a match, players are treated to a cinematic photo slideshow featuring memories from the arena's location, enhanced with "game style" filters and custom audio.
*   **Visual & Audio Polish:** Integrated custom branding, consistent typography, a themed color palette, and responsive UI sounds to deliver a polished arcade feel.

## Prerequisites

To get started with development or to run the game, you'll need:
*   **Node.js** (version 16 or higher)
*   **pnpm** (recommended package manager, enable with `corepack enable` or install globally via `npm install -g pnpm`)

## Getting Started

Follow these steps to set up and run the project:

1.  **Install Dependencies:**
    Navigate to the project root in your terminal and install all required packages:
    ```bash
    pnpm install
    ```

2.  **Prepare Photo Assets (Optional but Recommended):**
    The backend serves photos from the `photos/` directory. To customize, create subfolders within `photos/` (e.g., `photos/paris`, `photos/tokyo`) and place `.jpg`, `.jpeg`, `.png`, `.heic`, `.heif`, or `.webp` image files inside. The game will automatically pick these up for "Memory Arenas" and "Victory Slideshows."

3.  **Start Development Servers:**
    To run the frontend and backend concurrently in development mode:
    ```bash
    # In a separate terminal, start the backend server
    pnpm run server
    # This serves the API at http://localhost:3000

    # In another terminal, start the Vite development server for the frontend
    pnpm run dev
    # This serves the frontend at http://localhost:5173 (or another available port)
    ```
    Open your browser to the frontend URL (e.g., `http://localhost:5173`) to play the game.

## Testing

The project uses **Vitest** for unit and integration testing.

*   **Run All Tests:**
    ```bash
    pnpm test
    ```

*   **Run Specific Tests:**
    You can run tests for a particular file or set of files:
    ```bash
    pnpm test -- tests/Fighter.test.js
    pnpm test -- tests/server.test.js tests/VictorySlideshow.test.js
    ```

## Production Build & Deployment

To create an optimized production build and serve it:

1.  **Build the Game:**
    This compiles the frontend assets (JavaScript, CSS, images) into the `dist/` directory.
    ```bash
    pnpm run build
    ```

2.  **Run Production Server:**
    This starts the Node.js/Express server in production mode. It serves the static files from `dist/` and the API at `http://localhost:3000`.
    ```bash
    pnpm run server
    ```
    Your production-ready game will be accessible at `http://localhost:3000`.

## Project Structure

The codebase is organized as follows:

*   `src/`
    *   `components/` - Reusable game entities and UI components (e.g., `Fighter.js`, `VictorySlideshow.js`).
    *   `systems/` - Core game logic and input handlers (e.g., `TouchInputController.js`, `CombatSystem.js`).
    *   `scenes/` - Phaser game scenes (e.g., `BootScene`, `MainMenuScene`, `FightScene`, `ArenaSelectScene`).
    *   `config/` - Game configuration and constants.
    *   `constants/` - Global constants.
    *   `styles/` - Global and component-specific CSS files.
*   `server/` - Backend Node.js/Express application, including API routes (`index.js`) and image processing utilities (`ImageProcessor.js`).
*   `tests/` - **Vitest** unit and integration tests for frontend logic, backend API, and UI components.
*   `photos/` - User-provided images that are served as "Memory Arenas" rewards. Create subdirectories for different locations (e.g., `photos/paris/`).
*   `assets/` & `resources/` - Static game assets like images, audio files, and fonts. `resources/` is typically preloaded by Phaser.
*   `dist/` - Output directory for the production build of the frontend.
*   `agent-os/` - Contains project documentation, specifications, product roadmap, and development standards.

## Development Standards & Conventions

*   **Code Style:** The project strictly adheres to **Airbnb** ESLint rules and uses **Prettier** for consistent code formatting.
    *   Check for linting errors: `pnpm run lint`
    *   Automatically fix linting and formatting issues: `pnpm run lint:fix`
*   **Architecture:** Follows a component-based architecture for Phaser with clear separation of concerns between game logic, rendering, and data fetching.
*   **Documentation:** Detailed product specifications, roadmap, and technical standards are maintained within the `agent-os/` directory.
*   **Git Hooks:** Pre-commit hooks are configured to automatically run linting and formatting checks (`pnpm run lint:fix`) before commits.

## Troubleshooting

*   **Port Conflicts:** If `pnpm run dev` or `pnpm run server` fail due to port conflicts, you might need to change the port in `vite.config.js` (for frontend) or `server/index.js` (for backend).
*   **Missing Assets:** Ensure all image and audio files referenced in the code exist in the `resources/` or `assets/` directories.
*   **Phaser Asset Loading:** If Phaser assets don't load, verify their paths in the scene's `preload()` methods and check if `PreloadScene.js` loads necessary global assets.

## Contributing

Please ensure you run `pnpm run lint:fix` before committing any changes. This helps maintain code quality and consistency across the project.
New features or significant changes should ideally be accompanied by relevant tests.