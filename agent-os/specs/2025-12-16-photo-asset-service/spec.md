# Specification: Photo Asset Service

## Goal
Implement a Node.js backend service to scan, optimize (resize/convert to WebP), and serve high-resolution personal photos (including iPhone HEIC) from a local directory for use in the game's "Victory Slideshow".

## User Stories
- As a player, I want to see a slideshow of photos from the specific city arena I just won in, so I can relive those memories.
- As a player, I want images to load instantly on my mobile device, so I don't wait for 5MB+ files to download.
- As the administrator, I want to simply drop new folders of photos into a directory without manually editing code or resizing images.

## Specific Requirements

**Dependencies & Configuration**
- Install `sharp` for image processing and `heic-convert` (if necessary) for HEIC support.
- Define `PHOTOS_DIR` (read-only source) and `CACHE_DIR` (writeable destination) constants in `server/index.js`.
- Ensure `CACHE_DIR` exists on startup.

**Image Processing Logic**
- Implement an on-demand processing function: When a photo is requested (or listed), check if a processed version exists in `CACHE_DIR`.
- If cached: Return the cached file path.
- If not cached: Read source, resize (max width/height 1920px), convert to WebP (quality 80%), save to `CACHE_DIR`, and return new path.
- Support file extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.heic`, `.HEIC`.

**API Endpoint: GET /api/cities**
- Scan `PHOTOS_DIR` for subdirectories.
- Return a JSON array of directory names (e.g., `["paris", "istanbul"]`).
- Filter out system files (e.g., `.DS_Store`).

**API Endpoint: GET /api/photos?city=[name]**
- Validate `city` query parameter against existing directories.
- If `city` is valid:
    - Scan the directory for supported image files.
    - Trigger the processing logic for each found image (async/promise-based).
    - Return a JSON array of objects: `[{ "url": "/cache/paris/img1.webp", "filename": "img1.heic", "type": "image/webp" }]`.
- If `city` is invalid or empty:
    - Return a JSON list containing a single "placeholder" image object (e.g., pointing to a generic "Under Construction" or "No Photos" asset).

**Static File Serving**
- Configure Express to serve the `CACHE_DIR` statically at the `/cache` URL prefix.
- Maintain existing static serving for `dist/` and `resources/` as fallback/primary.

**Error Handling**
- Log errors to console if image processing fails (e.g., corrupt file) but do not crash the server.
- Skip failed images in the response list rather than failing the entire request.

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**`server/index.js`**
- Reuse the existing Express app setup, CORS configuration, and port listening logic.
- Replace the current raw file scanning logic in `/api/photos` with the new processing pipeline.

**`package.json`**
- Add new dependencies here.

## Out of Scope
- Building a UI for uploading or deleting photos.
- Authentication or user login for the API.
- modifying the Frontend game scenes (handled in a separate spec/task).
