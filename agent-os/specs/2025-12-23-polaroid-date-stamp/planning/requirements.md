# Spec Requirements: Polaroid Date Stamp

## Initial Description

add the date of the photo in the button border of the polaroid white border with a stylish letter , like a real polaroid picture

## Requirements Discussion

### First Round Questions

**Q1:** Date Source: currently, the system uses the file creation date on the server (`stats.birthtime`). This can sometimes be inaccurate if files were copied/moved. Should we implement EXIF metadata extraction to get the actual "Date Taken" from the photos?
**Answer:** yes lets extract the date take from photo

**Q2:** Date Format: The current format is `YYYY-MM-DD`. For a realistic polaroid look, which format do you prefer?
**Answer:** May 21, 2023

**Q3:** Font Style: To achieve the "stylish letter" look, I recommend adding a specific handwritten web font. Do you prefer?
**Answer:** lets use @public/fonts/Biro_Script_reduced.ttf

**Q4:** Fallback: If a photo has no date metadata, what should we display? (e.g., "Memories", the Arena Name, or leave blank?)
**Answer:** the arena name

### Existing Code to Reference

- **Frontend:** `src/components/VictorySlideshow.js` (logic for display), `src/styles/victory.css` (styling).
- **Backend:** `server/index.js` (photo API), `server/ImageProcessor.js` (image processing).
- **Assets:** `public/fonts/Biro_Script_reduced.ttf` (existing custom font).

**Similar Features Identified:**

- `VictorySlideshow.js` already has a `.polaroid-date` element that receives a `date` string.
- `victory.css` already has basic styling for `.polaroid-date`.

### Follow-up Questions

None required. User provided specific asset paths and clear requirements.

## Visual Assets

### Files Provided:

No new visual files provided in `planning/visuals/`.

- **Reference Asset:** User specified existing asset: `public/fonts/Biro_Script_reduced.ttf`.

## Requirements Summary

### Functional Requirements

- **Server-Side:**
  - Update `/api/photos` to extract EXIF "Date Taken" / "Original Date" metadata from images.
  - Fallback to file creation date (`birthtime`) if EXIF is missing, but prioritize EXIF.
  - Format the date server-side (or client-side, to be decided in spec) as "Month Day, Year" (e.g., "May 21, 2023").
  - If no date can be found (rare), ensure a mechanism exists to pass the "Arena Name" as the fallback.
- **Client-Side:**
  - Load the custom font `Biro_Script_reduced.ttf` via CSS (`@font-face`).
  - Apply this font to the `.polaroid-date` element in `victory.css`.
  - Ensure the text fits within the bottom border of the polaroid.
  - Display the formatted date; if null/empty, display the current City/Arena name.

### Reusability Opportunities

- Reuse `server/ImageProcessor.js` (using `sharp` library) which already handles image processing; `sharp` has metadata extraction capabilities (`metadata()`).
- Reuse existing `victory.css` classes.

### Scope Boundaries

**In Scope:**

- Backend logic update for EXIF extraction.
- CSS font-face implementation.
- VictorySlideshow logic update for date display.

**Out of Scope:**

- Changing the overall victory screen layout beyond the font/date.
- Editable dates.

### Technical Considerations

- `sharp` library in `server/ImageProcessor.js` is already used; use `await sharp(path).metadata()` to get `exif`.
- Need to parse the EXIF date string (typically "YYYY:MM:DD HH:MM:SS") into the desired locale format "May 21, 2023".
- Font file is binary (`.ttf`); ensure correct MIME type serving if not already handled (Vite/Express usually handles this).
