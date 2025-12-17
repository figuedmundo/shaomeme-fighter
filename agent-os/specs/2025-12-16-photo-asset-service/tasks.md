# Task Breakdown: Photo Asset Service

## Overview
Total Tasks: 1 Group (Backend & API)

## Task List

### Backend & API

#### Task Group 1: Image Processing & API Endpoints
**Dependencies:** None

- [x] 1.0 Implement Photo Processing and API
  - [x] 1.1 Write 2-4 focused tests for image processing logic
    - Test `ImageProcessor` class/module (mock `sharp` and `fs`)
    - Test case: Convert standard image (JPG) to WebP
    - Test case: Convert HEIC to WebP (if environment supports)
    - Test case: Return cached path if exists
  - [x] 1.2 Setup Dependencies & Configuration
    - Install `sharp` and `heic-convert`
    - Update `server/index.js` to define `PHOTOS_DIR` and `CACHE_DIR` constants
    - Ensure `CACHE_DIR` creation on startup
  - [x] 1.3 Implement Image Processing Logic
    - Create helper function/module for on-demand processing
    - Implement caching check (file existence)
    - Implement resize (max 1920px) and WebP conversion (quality 80%)
    - Handle `.heic` conversion specifically
  - [x] 1.4 Refactor `/api/cities` Endpoint
    - Update existing endpoint in `server/index.js`
    - Filter out system files (DS_Store)
    - Ensure it scans `PHOTOS_DIR` correctly
  - [x] 1.5 Refactor `/api/photos` Endpoint
    - Validate `city` param
    - Implement directory scanning for supported extensions (`.jpg`, `.png`, `.heic`, etc.)
    - Integrate async processing for found images
    - Return new JSON format: `[{ "url": "...", "filename": "...", "type": "..." }]`
    - Handle missing city case (return placeholder object)
  - [x] 1.6 Configure Static Serving
    - Serve `CACHE_DIR` at `/cache` route
  - [x] 1.7 Ensure Backend tests pass
    - Run ONLY the 2-4 tests written in 1.1
    - Verify API returns expected JSON structure (via manual curl or simple test script)

**Acceptance Criteria:**
- Tests from 1.1 pass
- `/api/cities` returns clean list of folders
- `/api/photos?city=paris` triggers processing and returns WebP URLs
- HEIC files are converted and served as WebP
- Second request to same city is fast (serves from cache)
- Mobile devices can load the returned URLs

### Testing

#### Task Group 2: Test Review & Gap Analysis
**Dependencies:** Task Group 1

- [x] 2.0 Review and Fill Gaps
  - [x] 2.1 Review tests from Task Group 1
    - Review the 2-4 tests written in 1.1
  - [x] 2.2 Analyze coverage gaps
    - Focus on error handling (corrupt files, permission issues)
  - [x] 2.3 Write up to 4 additional strategic tests
    - Integration test: API endpoint returns 200 and JSON
    - Integration test: Requesting non-existent city returns placeholder
  - [x] 2.4 Run feature-specific tests
    - Run all tests from 1.1 and 2.3

**Acceptance Criteria:**
- All feature-specific tests pass
- Error cases handled gracefully without server crash
- Placeholder logic verified

## Execution Order

Recommended implementation sequence:
1. Backend & API (Task Group 1)
2. Testing (Task Group 2)
