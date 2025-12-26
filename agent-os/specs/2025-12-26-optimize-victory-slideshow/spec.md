# Specification: Optimize Victory Slideshow Performance

## Goal

Eliminate slideshow lag and UI unresponsiveness by implementing image preloading, double-buffered CSS transitions, and async loop control, ensuring a smooth 60fps experience on mobile devices.

## User Stories

- As a player, I want the victory photo slideshow to transition smoothly without freezing or jumping, so I can enjoy my memories.
- As a player, I want the "Exit" button to respond immediately when tapped, so I don't feel stuck in the slideshow.

## Specific Requirements

**Smart Image Preloading**

- Implement a `preloadQueue` that maintains the next 2 upcoming images in memory using the `Image()` constructor.
- Fetch the next image in the sequence only after the current transition begins (Just-In-Time preloading) to conserve bandwidth.
- Clean up references (set `src = ''` or nullify) for images that have passed to prevent memory leaks on iOS Safari.

**Double-Buffered Cross-Fade Transitions**

- Replace the single `<img>` element with two overlapping `<img>` elements (Front/Back buffers).
- Implement transitions by toggling CSS opacity between the two buffers (Image A stays visible while Image B loads behind it, then A fades out as B fades in).
- Use `will-change: opacity` in CSS to hint the browser compositor.

**Async Loop Control**

- Replace the `setTimeout` loop with a Promise-based `playSequence()` method.
- The sequence must strictly follow: `Load Next` -> `Wait for Load` -> `Transition` -> `Wait for Timer`.
- This ensures the timer _never_ starts until the visual transition is complete, preventing "catch-up" jumps.

**Responsive UI**

- Move the "Exit" button event listener to a passive event or ensure the main thread is not blocked by image decoding (handled by preloading).
- If DOM responsiveness remains an issue, use `requestAnimationFrame` to batch DOM updates.

## Visual Design

**`VictorySlideshow.js` (CSS Changes)**

- `.victory-image` class needs absolute positioning to overlap for cross-fading.
- New CSS classes for `.fade-in` and `.fade-out` with hardware-accelerated transitions.

## Existing Code to Leverage

**`src/components/VictorySlideshow.js`**

- Reuse the `createOverlay` structure but modify the image container to hold two `<img>` elements.
- Reuse `fetch` logic for getting the photo list.
- Refactor `showPhoto` into `transitionToNextPhoto` using the double-buffer logic.

## Out of Scope

- Rewriting the slideshow in WebGL (DOM optimization is sufficient for 2D images).
- Changing the backend API response format.
- Complex 3D transitions or shader effects.
