# Specification: Polaroid Date Stamp

## Goal

Enhance the photo rewards by displaying the actual "Date Taken" (from EXIF) on the polaroid's bottom white border using a handwritten font, falling back to the Arena name if no date exists.

## User Stories

- As a player, I want to see the real date the photo was taken on the polaroid frame so that the memory feels more authentic.
- As a player, I want the date to be written in a handwritten style so that it mimics a real physical polaroid picture.
- As a player, I want to see the location/arena name if the photo has no date so that the space isn't empty.

## Specific Requirements

**EXIF Data Extraction (Backend)**

- Use `sharp` in `server/ImageProcessor.js` (or `server/index.js`) to extract the `exif` metadata from photos.
- Parse the `DateTimeOriginal` or `CreateDate` tag from the EXIF buffer.
- Fallback to file creation time (`birthtime`) if EXIF is missing.
- Format the date as "Month Day, Year" (e.g., "May 21, 2023") on the server before sending to the client.

**Fallback Mechanism**

- If the date (EXIF or birthtime) is unavailable, the API response `date` field should be null or empty.
- The `VictorySlideshow` component must check if the date is missing and display the `city` (Arena Name) instead.

**Custom Font Implementation**

- Implement `@font-face` in `victory.css` to load `public/fonts/Biro_Script_reduced.ttf`.
- Name the font family `BiroScript`.
- Ensure the font file is correctly served by the static file middleware.

**Visual Styling**

- Apply `font-family: "BiroScript", cursive;` to `.polaroid-date`.
- Ensure the text color is a dark gray/black ink color (e.g., `#2c2c2c`) with slight opacity (0.8) for realism.
- Position the text within the bottom border area (already defined in CSS), ensuring it doesn't overlap the image.
- Add a slight rotation (-2deg) to the text container if not already present, to mimic handwriting imperfections.

## Visual Design

**`public/fonts/Biro_Script_reduced.ttf`**

- This specific font file must be used for the `.polaroid-date` text.

## Existing Code to Leverage

**`server/index.js` (API Endpoint)**

- Currently returns `date` based on `stats.birthtime`.
- Needs modification to use `sharp(imagePath).metadata()` to fetch EXIF data first.

**`src/components/VictorySlideshow.js`**

- Already has `this.dateElement` and logic to update `innerText`.
- Reuse the `showPhoto(index)` method to inject the date string.
- Add logic: `const displayText = photoDate || city;`

**`src/styles/victory.css`**

- Reuse `.polaroid-date` class.
- Modify the `font-family` property to use the new custom font.

**`server/ImageProcessor.js`**

- Uses `sharp` which supports `.metadata()`.
- Can be extended or called from `index.js` to extract metadata without reprocessing the image if possible, or extract during the processing phase.

## Out of Scope

- Editing the date manually in the game.
- Extracting location (GPS) from EXIF to display city names automatically (we rely on folder names).
- Changing the background or other victory screen animations.
