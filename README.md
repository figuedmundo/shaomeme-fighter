# Shaomeme Fighter

A personalized mobile web fighting game built with **Phaser 3** and **Vite**. The game features touch-based controls, a custom roster of characters, and photo rewards.

## Project Overview

*   **Frontend:** Phaser 3 game engine, bundled with Vite.
*   **Backend:** Node.js/Express server for serving the game and providing an API for photo assets.
*   **Platform:** Optimized for mobile (iPad/iPhone) but playable on desktop.

## Prerequisites

*   Node.js (>=16)
*   npm (>=8)

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    This starts the Vite development server for the frontend at `http://localhost:7600` (or the port shown in your terminal).

## Production

1.  **Build the Game:**
    ```bash
    npm run build
    ```
    This compiles the frontend assets into the `dist/` directory.

2.  **Run Production Server:**
    ```bash
    npm start
    ```
    This runs the Node.js/Express server in production mode. It serves the static files from `dist/` and the API at `http://localhost:3000`.

## Project Structure

*   `src/` - Frontend source code (Phaser scenes, game configuration).
*   `server/` - Backend Node.js/Express server logic.
*   `photos/` - Directory for storing personal photo rewards (served by the API).
*   `assets/` & `resources/` - Game assets (images, audio).
*   `dist/` - Production build output.

## Code Style

This project follows **Airbnb** ESLint rules and uses **Prettier** for formatting.
*   Lint: `npm run lint`
*   Fix: `npm run lint:fix`
