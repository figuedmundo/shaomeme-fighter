# Image Processing Optimization

This document details the high-performance image processing architecture implemented to ensure a low memory footprint during the Victory Slideshow generation.

## Architectural Goal

Maintain stable and low RAM usage (<200MB) regardless of the number of high-resolution images being processed in a single city directory.

## Implementation Details

1.  **Path-Based Processing**: Refactored `ImageProcessor.js` to accept file paths instead of buffers. `sharp` now streams from disk, drastically reducing the memory footprint.
2.  **Sequential Execution**: Changed the processing loop in `server/index.js` from `Promise.all` to a sequential `for...of` loop. This ensures only one image is processed at a time, keeping RAM usage flat and predictable.
3.  **Lazy Loading (Refinement)**: Verified that file buffers are only created for the rare HEIC fallback case, and even then, they are scoped to a single iteration.

## Verification

- Unit tests in `tests/ImageProcessor.test.js` updated and passed.
- Integration tests in `tests/server.test.js` verified the API still returns correct data.
- Memory profiling (local) shows stable usage regardless of directory size.
