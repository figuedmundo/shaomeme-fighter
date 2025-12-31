# Memory Leak Fix - Backend Image Processing

## Issue

The backend server was consuming excessive memory (up to 2.05GB) when processing large photo directories.

## Root Cause Analysis

1.  **Unbounded Concurrency**: The `/api/photos` endpoint used `Promise.all()` to process every image in a city directory simultaneously.
2.  **Memory-Intensive Buffering**: Every image was being read into a full Node.js `Buffer` using `fs.readFile()` before being passed to `sharp`.
3.  **Parallel Decompression**: `sharp` was decompressing multiple high-resolution images into raw pixel data in parallel, leading to massive RAM spikes.

## Solution implemented

1.  **Path-Based Processing**: Refactored `ImageProcessor.js` to accept file paths instead of buffers. `sharp` now streams from disk, drastically reducing the memory footprint.
2.  **Sequential Execution**: Changed the processing loop in `server/index.js` from `Promise.all` to a sequential `for...of` loop. This ensures only one image is processed at a time, keeping RAM usage flat and predictable.
3.  **Lazy Loading (Refinement)**: Verified that file buffers are only created for the rare HEIC fallback case, and even then, they are scoped to a single iteration.

## Verification

- Unit tests in `tests/ImageProcessor.test.js` updated and passed.
- Integration tests in `tests/server.test.js` verified the API still returns correct data.
- Memory profiling (local) shows stable usage regardless of directory size.
