Based on your description of the lagging slideshow and unresponsive exit button, I have some clarifying questions to pinpoint the optimization strategy:

1. I assume the lag "after the 2nd or 3rd picture" might be due to images being loaded and decoded on the main thread just before they are shown. Should we implement a pre-loading strategy to fetch upcoming photos in the background?
2. I'm thinking the "jump many pictures" behavior happens because the `setTimeout` loop keeps running even if the rendering lags. Should we switch to a delta-time based update loop or ensure one transition completes before starting the timer for the next?
3. The unresponsive exit button suggests the main thread is blocked (likely by image decoding or heavy DOM manipulation). Should we move the slideshow logic entirely to Phaser (WebGL) instead of DOM elements, or optimize the DOM manipulation to be less blocking?
4. I assume you want the transition to be "smoother". Currently, is it a simple cut or a fade? Would you prefer a cross-fade or a slide effect?
5. For the responsiveness, is the exit button part of the DOM overlay or the Phaser canvas?

**Existing Code Reuse:**
Are there existing features in your codebase with similar patterns we should reference? For example:

- `VictorySlideshow.js`: This seems to be the core component to optimize.
- `LoadingScene.js`: Does it have asset preloading logic we can adapt?

Please provide file/folder paths or names of these features if they exist.

**Visual Assets Request:**
Do you have any design mockups, wireframes, or screenshots that could help guide the development?

If yes, please place them in: `agent-os/specs/2025-12-26-optimize-victory-slideshow/planning/visuals/`

Use descriptive file names like:

- slideshow-lag-example.mp4 (if possible)
- smooth-transition-mockup.png

Please answer the questions above and let me know if you've added any visual files or can point to similar existing features.
