# Task Breakdown: Photo Annotation Tool

## Overview

Total Tasks: 16

## Task List

### Backend Layer

#### Task Group 1: Standalone API & FS Integration

**Dependencies:** None

- [x] 1.0 Complete Backend API
  - [x] 1.1 Write 4 focused tests for API endpoints
    - Test `GET /api/cities` returns folder list
    - Test `GET /api/photos` merges disk files with `notes.json`
    - Test `POST /api/notes` writes correctly to local disk
    - Test that "background" files are excluded from results
  - [x] 1.2 Initialize Express server in `tools/photo-manager/backend/`
    - Setup port 3001
    - Setup CORS for frontend communication
  - [x] 1.3 Implement `GET /api/cities`
    - Scans `../../photos/` directory
  - [x] 1.4 Implement `GET /api/photos?city=[name]`
    - Reads actual files from disk
    - Merges with entries from `../../photos/[city]/notes.json`
    - Identifies orphaned keys in JSON
  - [x] 1.5 Implement `POST /api/notes`
    - Receives payload and writes to `../../photos/[city]/notes.json` with 2-space indentation
  - [x] 1.6 Ensure Backend tests pass
    - Run the 4 tests from 1.1

**Acceptance Criteria:**

- API correctly reads and writes to the main `photos/` directory.
- Orphaned notes are successfully identified in the API response.
- CORS is properly configured for localhost development.

### Frontend Foundation

#### Task Group 2: React + Vite Setup

**Dependencies:** Task Group 1

- [x] 2.0 Scaffold Management App
  - [x] 2.1 Write 3 focused tests for UI logic
    - Test city switching updates the view
    - Test that "Save" button triggers API call
    - Test that orphan warning renders when data is present
  - [x] 2.2 Initialize React + Vite project in `tools/photo-manager/frontend/`
    - Setup port 5174
  - [x] 2.3 Implement API Service/Hooks
    - Methods for fetching cities, fetching photos, and saving notes
  - [x] 2.4 Create Main Layout
    - Sidebar for city selection
    - Main content area for photo gallery
  - [x] 2.5 Ensure Frontend foundation tests pass
    - Run the 3 tests from 2.1

**Acceptance Criteria:**

- App initializes and communicates with the backend on port 3001.
- Basic layout is responsive and navigable.

### Core Features

#### Task Group 3: Gallery & Note Editing

**Dependencies:** Task Group 2

- [x] 3.0 Implement Management UI
  - [x] 3.1 Build Gallery Grid
    - Display photo thumbnails with filename and date labels
  - [x] 3.2 Build Note Editor Card
    - Multi-line text input for each photo
    - Visual feedback for unsaved changes (local state)
  - [x] 3.3 Implement Orphaned Notes Section
    - Group notes that have no matching image at the bottom of the list with a warning icon
  - [x] 3.4 Implement Global Save
    - Fixed "Save All Changes" button in the header/footer
  - [x] 3.5 Implement "Game Preview" Modal
    - Popup that renders the photo using game styles (Polaroid frame, handwriting font)
    - Reuse logic from `src/components/VictorySlideshow.js`

**Acceptance Criteria:**

- User can visually browse photos and edit notes.
- Saving updates the actual `notes.json` file on disk.
- Game Preview accurately reflects how the photo will look during a reward sequence.

### Verification

#### Task Group 4: Final Integration & Cleanup

**Dependencies:** Task Group 1-3

- [x] 4.0 Final Verification
  - [x] 4.1 Update root `.gitignore`
    - Ensure `tools/photo-manager/` dependencies are ignored or the folder is isolated
  - [x] 4.2 Create README in `tools/photo-manager/`
    - Instructions on how to start backend and frontend
  - [x] 4.3 End-to-End Walkthrough
    - Select city -> Add note to photo -> Save -> Verify `notes.json` on disk -> Verify in main game victory slideshow

**Acceptance Criteria:**

- The tool works end-to-end without impacting the main game build.
- Documentation is clear enough for future usage.

## Execution Order

Recommended implementation sequence:

1. Backend Setup (Task Group 1) - Establish data bridge.
2. Frontend Foundation (Task Group 2) - Establish visual shell.
3. Feature Implementation (Task Group 3) - Core logic and preview.
4. Final Integration (Task Group 4) - Security and docs.
