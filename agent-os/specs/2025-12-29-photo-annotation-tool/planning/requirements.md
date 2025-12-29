# Spec Requirements: Photo Annotation Tool

## Initial Description

A visual standalone tool to help manage photo notes for the game. With many photos having similar names, a visual interface is needed to see the picture and edit its assigned note in the city's `notes.json` file. It must be localhost-only, standalone, and not mixed with the main game logic.

## Requirements Discussion

### First Round Questions

**Q1:** I assume this tool should be a **web-based internal page** rather than a separate desktop application. Is that correct?
**Answer:** Standalone localhost-only web-based app. Not mixed with the game and not exposed to the internet.

**Q2:** I'm thinking of a **"Gallery View"** where you can select a city and then scroll through all its photos, with an input field next to each photo for the note. Should we also include a **"Slideshow Mode"**?
**Answer:** Yes.

**Q3:** Should the tool automatically **save as you type**, or would you prefer a "Save All" button for the city?
**Answer:** A button to save.

**Q4:** I assume you'd like to see the **filename and date** next to the input field?
**Answer:** Yes.

**Q5:** Would you like a **"Cleanup" button** that automatically removes notes from `notes.json` for photos that have been deleted?
**Answer:** No cleanup, but highlight which notes are "orphans" (no matching image).

**Q6:** Are there any specific devices you plan to use this tool on?
**Answer:** Just the development laptop.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Photo Scanning Logic - Path: `server/index.js` and `server/ImageProcessor.js`
- Feature: Notes Storage Pattern - Path: `photos/[city]/notes.json` (as implemented in the previous task)
- Feature: Victory Slideshow UI - Path: `src/components/VictorySlideshow.js` (for the "Game Preview" mode)

### Follow-up Questions (Combined with "Best Possible" Suggestion)

**Q1:** Location of the tool.
**Answer:** Suggested as a subdirectory `tools/photo-manager` within the repo.

**Q2:** Frontend technology.
**Answer:** Suggested React + Vite for high productivity and state management.

**Q3:** Backend approach.
**Answer:** Suggested a dedicated Express server on port 3001 for direct FS access and separation.

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **City Selection:** A dropdown or list to choose from the folders found in the `photos/` directory.
- **Visual Gallery:** Display all photos for the selected city in a responsive grid.
- **Note Editing:** An input field next to each photo showing the current note from `notes.json`.
- **Orphan Detection:** Cross-reference `notes.json` entries with actual files on disk. If a note exists for a missing file, highlight it (e.g., in a separate "Orphaned Notes" section or with a red border).
- **Metadata Display:** Show the filename and the date (parsed using existing logic) for each image.
- **Bulk Save:** A single "Save Changes" button that writes the updated mapping back to the city's `notes.json`.
- **Game Preview:** A way to trigger a "Preview" popup that mimics the `VictorySlideshow` appearance for a specific photo.

### Reusability Opportunities

- Reuse `getPhotoDate` and `formatDate` from `server/ImageProcessor.js`.
- Reuse the directory scanning logic from `server/index.js`.
- Borrow CSS variables or font declarations from `src/styles/victory.css`.

### Scope Boundaries

**In Scope:**

- `tools/photo-manager/` directory structure.
- Small Node.js backend for disk I/O.
- React-based frontend.
- Note editing and orphan reporting.

**Out of Scope:**

- Renaming files (handled by `rename_photos.js`).
- Deleting files.
- Online/Production deployment.
- Authentication (Localhost only).

### Technical Considerations

- **CORS:** The tool's backend needs to handle CORS if the frontend runs on a different Vite port.
- **Image Serving:** The backend must serve images from the main `photos/` folder.
- **JSON Stability:** Ensure `notes.json` is saved with pretty-printing (2-space indent) for Git readability.
