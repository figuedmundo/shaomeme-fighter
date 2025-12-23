# Task Breakdown: Polaroid Date Stamp

## Overview

Total Tasks: 3 Task Groups

## Task List

### Backend Layer

#### Task Group 1: EXIF Data Extraction

**Dependencies:** None

- [x] 1.0 Implement EXIF extraction in Photo API
  - [x] 1.1 Write 2-4 focused tests for EXIF extraction
    - Test extracting `DateTimeOriginal` from a sample image with EXIF.
    - Test fallback to `birthtime` for an image without EXIF.
    - Test date formatting "Month Day, Year".
  - [x] 1.2 Update `ImageProcessor.js` (or `index.js` helper) to extract EXIF
    - Use `sharp(path).metadata()` to get `exif` buffer.
    - Parse standard EXIF date format (YYYY:MM:DD HH:MM:SS).
    - Return formatted date string or null if missing.
  - [x] 1.3 Update `/api/photos` endpoint response
    - Integrate the new EXIF extraction logic.
    - Ensure `date` field in JSON response uses the new formatted string (e.g., "May 21, 2023").
  - [x] 1.4 Ensure Backend tests pass
    - Run ONLY the 2-4 tests written in 1.1.
    - Verify correct date strings are returned.

**Acceptance Criteria:**

- API returns "May 21, 2023" for photos with valid EXIF data.
- API returns formatted file creation date for photos without EXIF.
- API handles errors gracefully (no crash on corrupt EXIF).

### Frontend Layer

#### Task Group 2: UI & Typography

**Dependencies:** Task Group 1

- [x] 2.0 Implement Custom Font and Date Logic
  - [x] 2.1 Write 2-4 focused tests for Date Logic
    - Test `VictorySlideshow` logic: valid date displays date.
    - Test fallback: null/empty date displays Arena Name.
  - [x] 2.2 Configure Custom Font
    - Add `@font-face` rule in `victory.css` for `Biro_Script_reduced.ttf`.
    - Define font-family `BiroScript`.
  - [x] 2.3 Update `VictorySlideshow` Logic
    - Modify `showPhoto` to use `photo.date` if available.
    - Implement fallback: `const displayText = photoDate || this.city`.
    - Update `dateElement.innerText`.
  - [x] 2.4 Style `.polaroid-date`
    - Apply `font-family: 'BiroScript', cursive`.
    - Set color `#2c2c2c` (ink color), opacity `0.8`.
    - Add slight rotation (`transform: rotate(-2deg)`).
    - Ensure text fits within the bottom white border.
  - [x] 2.5 Ensure Frontend tests pass
    - Run ONLY the 2-4 tests written in 2.1.
    - Verify logic prioritizes date over arena name.

**Acceptance Criteria:**

- Text appears in "BiroScript" handwritten font.
- Text is positioned correctly in the bottom white border.
- Photos with dates show "Month Day, Year".
- Photos without dates show the Arena Name.

### Testing

#### Task Group 3: Integration Review

**Dependencies:** Task Group 2

- [x] 3.0 Verify End-to-End Flow
  - [x] 3.1 Review tests from Task Groups 1 & 2
  - [x] 3.2 Manual Verification (or E2E Test)
    - Start game, win a match (or trigger victory scene).
    - Observe slideshow.
    - Verify font loads and looks correct.
    - Verify date/fallback logic works visually.
  - [x] 3.3 Add 1-2 Integration Tests (if needed)
    - Test the full pipeline: Backend API response -> Frontend Component Render.
  - [x] 3.4 Run feature-specific tests
    - Run the focused tests from 1.1 and 2.1.

**Acceptance Criteria:**

- The feature works end-to-end in the browser.
- No regression in existing slideshow functionality (Ken Burns, transitions).

## Execution Order

1. Backend Layer (Task Group 1)
2. Frontend Layer (Task Group 2)
3. Testing (Task Group 3)
