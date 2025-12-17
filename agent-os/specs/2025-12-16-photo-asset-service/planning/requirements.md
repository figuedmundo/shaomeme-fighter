# Spec Requirements: Photo Asset Service

## Initial Description
Implement Node.js backend endpoint `/api/photos` to scan and serve images from the `photos/` directory structure.

## Requirements Discussion

### First Round Questions

**Q1:** Verify/Refine existing `server/index.js` vs write from scratch?
**Answer:** User is open to writing from scratch if needed. Priorities are: **speed**, **reliability**, and **ease of organization**. User is concerned about managing high-res files via CLI on the Ubuntu server and suggests a better workflow.

**Q2:** Keep static serving at `/photos/...` vs API returning full URLs?
**Answer:** Proceed with suggestion.

**Q3:** Supported formats (add iPhone)?
**Answer:** Yes, must support iPhone photos (HEIC).

**Q4:** Directory structure `photos/[city_name]/`?
**Answer:** Yes, strictly serve from city subdirectories. Ignore root files.

**Q5:** API Response format (Strings vs Objects)?
**Answer:** Suggest best industry standards.

**Q6:** Error handling for missing city?
**Answer:** Serve a placeholder image (e.g., "Under Construction").

### Follow-up Questions

**Q1:** Auto-conversion for HEIC (iPhone) photos?
**Answer:** Yes. Browser cannot read HEIC, so backend must convert.

**Q2:** Performance/Optimization (Resizing High-Res images)?
**Answer:** Yes. Source images are high-res (5MB+). Backend must automatically resize/compress (e.g., to max 1080p WebP) for mobile performance.

**Q3:** Server Workflow (Read-only source)?
**Answer:** Yes. `photos/` is a read-only source managed externally by the user. The app just reads and serves optimized versions.

**Q4:** Metadata Structure?
**Answer:** Agreed to proposed JSON object format.

## Visual Assets

### Files Provided:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- **API Endpoint:** `/api/photos?city=[name]` returns a JSON list of photo objects for a specific arena.
- **API Endpoint:** `/api/cities` returns a list of available photo directories.
- **Image Processing:**
  - **HEIC Support:** Detect `.heic` files in source folders.
  - **Auto-Conversion:** Convert non-web formats (HEIC) to WebP or JPEG.
  - **Optimization:** Resize high-resolution source images to a mobile-friendly max dimension (e.g., 1920x1080) and compress them.
  - **Caching:** Store processed images in a cache directory to avoid re-processing on every request.
- **Source Management:** Treat `photos/` directory as a read-only source.
- **Static Serving:** Serve the *processed/optimized* images statically.

### Reusability Opportunities
- **Existing Server:** Refactor `server/index.js` to include the new image processing logic.
- **Libraries:** utilize `sharp` for image processing (standard for Node.js).

### Scope Boundaries
**In Scope:**
- Backend logic to scan `photos/` subdirectories.
- Image processing pipeline (Resize, Convert, Cache).
- API endpoints (`GET /api/photos`, `GET /api/cities`).
- Error handling (Placeholder image for missing cities).

**Out of Scope:**
- UI for uploading/managing photos (User manages files via OS/FTP/Nextcloud).
- Authentication for the API (Public read access is assumed for now).

### Technical Considerations
- **Performance:** Image processing can be CPU intensive. Since the server is a laptop (and eventually a small Ubuntu server), processing should happen:
  - On-demand (first request) OR
  - On startup (pre-warm).
  - *Decision:* On-demand with persistent caching is likely best for startup time, or a background job.
- **Format:** Convert everything to `WebP` for best quality/size ratio on modern browsers.
- **Dependencies:** Need `sharp` and potentially `heic-convert` or `heic-decode` (though `sharp` might handle HEIC if libvips is configured, often safer to use a dedicated converter if sharp fails on specific OS setups).
- **JSON Format:**
  ```json
  [
    {
      "url": "/cache/paris/img1.webp",
      "filename": "img1.heic",
      "type": "image/webp"
    }
  ]
  ```
