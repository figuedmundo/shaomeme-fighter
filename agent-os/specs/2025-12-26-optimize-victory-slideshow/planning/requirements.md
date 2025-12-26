# Spec Requirements: Optimize Victory Slideshow Performance

## Initial Description

I noticed that when the picutes are showing in the reward after the 2do or 3rd picture , it becomes very slow , like with lag, and suddendly it jump many pictures and gets better but not smooth, also when click the exit button it doesn't respond immdediately, what we can do to improve the flow , the transiction between pictures, make it more smooth and more responsiveness

## Requirements Discussion

### First Round Questions

**Q1:** I assume the lag "after the 2nd or 3rd picture" might be due to images being loaded and decoded on the main thread just before they are shown. Should we implement a pre-loading strategy to fetch upcoming photos in the background?
**Answer:** please suggest best approach, take into account this is mobile, so we need to try to do not use too much mobile data, and make it feel smooth

**Q2:** I'm thinking the "jump many pictures" behavior happens because the setTimeout loop keeps running even if the rendering lags. Should we switch to a delta-time based update loop or ensure one transition completes before starting the timer for the next?
**Answer:** please suggest based on industry standards

**Q3:** The unresponsive exit button suggests the main thread is blocked (likely by image decoding or heavy DOM manipulation). Should we move the slideshow logic entirely to Phaser (WebGL) instead of DOM elements, or optimize the DOM manipulation to be less blocking?
**Answer:** plese suggest according the best practice, dont forget this is for mobile and ipad only game , and we need to use the possbile the characterics of an ipad to make the game feel smooth

**Q4:** I assume you want the transition to be "smoother". Currently, is it a simple cut or a fade? Would you prefer a cross-fade or a slide effect? what is the current transition ? please investigate, and suggest the best approach, the best for this tipe of slides presentation, you can search internet latests trends
**Answer:** what is the current transition ? please investigate, and suggest the best approach, the best for this tipe of slides presentation, you can search internet latests trends

**Q5:** For the responsiveness, is the exit button part of the DOM overlay or the Phaser canvas?
**Answer:** please investigate and suggest best approach

### Existing Code to Reference

- `VictorySlideshow.js`: Core component handling DOM overlay, image fetching, and transitions.
- `LoadingScene.js`: Potential reference for asset preloading patterns.

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Preloading Strategy:** Implement a smart preloader that buffers the next 2-3 images in the background to prevent main-thread blocking during display, while respecting mobile data constraints (don't load everything at once).
- **Transition Control:** Replace `setTimeout` with a robust async queue or event-driven state machine. Ensure the next slide timer ONLY starts after the previous transition and image load are fully complete. This eliminates the "jumping" effect.
- **Responsiveness:** Move the "Exit" button logic or ensure its event listener is attached to a passive/non-blocking element. Consider migrating the button to Phaser if DOM blocking persists, but first optimize the DOM reflows.
- **Smooth Transitions:**
  - _Current:_ Hard src swap with CSS opacity fade (0 -> 1) managed by `setTimeout`.
  - _Target:_ Implement a double-buffered image system (two `<img>` elements). Cross-fade between them (Image A fades out while Image B fades in) for a seamless "cinematic" feel. CSS transitions should be hardware accelerated (`transform: opacity` and `will-change`).

### Reusability Opportunities

- Reuse `VictorySlideshow.js` structure but refactor the `showPhoto` method.
- Use `Image` constructor for background preloading (standard web API).

### Scope Boundaries

**In Scope:**

- Refactoring `VictorySlideshow.js` logic.
- Implementing image preloading.
- Changing transition visual style (CSS).
- Optimizing event handling for the Exit button.

**Out of Scope:**

- Rewriting the entire slideshow in WebGL/Phaser (unless DOM optimization fails). DOM is generally fine for simple 2D slideshows if assets are managed correctly.
- Changing the backend photo API.

### Technical Considerations

- **Memory Management:** Explicitly release object URLs or nullify image references for past photos to prevent memory leaks on mobile Safari.
- **CSS Optimization:** Use `will-change: opacity, transform` on the photo elements to hint the browser compositor.
- **Loop Logic:** The current `setTimeout` inside `img.onload` is risky if load times vary. We need a `Promise`-based sequence: `Load Next -> Wait -> Transition -> Start Timer`.
