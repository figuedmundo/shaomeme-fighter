# Specification: Photo Annotation Tool

## Goal

Develop a visual standalone tool to manage photo annotations (notes) stored in `notes.json` files within city directories. This tool solves the difficulty of adding notes to photos with similar filenames by providing a visual gallery interface.

## User Stories

- As a developer, I want to see the actual photo alongside a text input so that I can accurately describe the memory without checking filenames manually.
- As a developer, I want to identify "orphaned" notes (entries in `notes.json` where the photo has been deleted) so that I can maintain data integrity.
- As a developer, I want a dedicated localhost-only environment for this tool so that it doesn't clutter the main game's production bundle or logic.

## Specific Requirements

**Standalone Architecture**

- Create a new directory `tools/photo-manager/` containing a separate `backend` and `frontend`.
- The tool must run independently of the game on a different set of ports (e.g., Backend: 3001, Frontend: 5174).
- Use React with Vite for the frontend to leverage modern state management and fast development.

**Backend API (Express)**

- Implement `GET /api/cities`: Scans the root `photos/` directory and returns a list of available city folders.
- Implement `GET /api/photos?city=[name]`: Returns an array of objects containing photo URL, filename, extracted date, and current note from `notes.json`.
- Implement `POST /api/notes`: Receives a full JSON mapping for a city and overwrites the corresponding `notes.json` file.
- Implement static file serving for the `photos/` directory to allow the frontend to display images.

**Visual Gallery Interface**

- Sidebar or dropdown navigation to switch between cities.
- Responsive grid display where each photo is presented as a card.
- Each card must display: the image thumbnail, filename, EXIF/filesystem date, and an editable text area for the note.

**Note Management & Orphan Detection**

- The UI must visually distinguish between "Active Photos" and "Orphaned Notes".
- If a key exists in `notes.json` but no matching file is found on disk, display the note in an "Orphaned" section with a clear warning.
- Implement a "Save All Changes" button that sends the current state of the city's notes to the backend.

**Game Preview Mode**

- Include a "Preview in Game" button on each photo card.
- This should open a modal that renders the photo using the exact CSS and layouts from the game's `VictorySlideshow` (polaroid frame, handwriting font, Ken Burns effect).

**Localhost & Security**

- The tool must be restricted to `localhost` and explicitly excluded from the main game's build process (`.gitignore` check).
- No authentication is required as it is a development-only utility.

## Visual Design

No visual assets provided. The design should follow a clean, functional dashboard aesthetic.

## Existing Code to Leverage

**`server/ImageProcessor.js`**

- Reuse `getPhotoDate` and `formatDate` functions to ensure date display consistency between the tool and the game.

**`server/index.js`**

- Reuse directory scanning and file filtering logic (supported extensions, exclusion of 'background' files).

**`src/styles/victory.css`**

- Replicate or import CSS classes like `.polaroid-frame`, `.polaroid-date`, and `.polaroid-note` for the "Game Preview" modal.

**`src/components/VictorySlideshow.js`**

- Reference the Ken Burns animation logic and heart-spawning mechanics for the preview mode.

## Out of Scope

- Renaming or moving image files (handled by CLI scripts).
- Deleting image files from disk.
- Support for remote/cloud storage (Local filesystem only).
- Production build or deployment instructions.
