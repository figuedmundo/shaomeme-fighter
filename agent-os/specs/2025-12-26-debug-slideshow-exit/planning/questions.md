Based on your feedback that the slideshow flow is smoother but the exit button is slow/unresponsive, I have some clarifying questions to debug this specific issue:

1. I assume that when you click "Exit", the overlay _should_ disappear immediately. Currently, does the overlay remain visible for a few seconds after clicking? Or does the overlay vanish, but the game screen underneath stays black/frozen?
2. I'm thinking the `async/await` logic in `playSequence` might be leaving some Promises hanging (never resolving) when `clearTimeout` is used. While this shouldn't block the UI thread, I want to confirm: Does the slideshow _continue_ playing (changing photos) after you click Exit, or does it freeze on the current photo before finally exiting?
3. Is there any visual feedback when you click the exit button? (e.g., does it depress/change color, or does it feel completely dead?)
4. I assume you want the exit to be instant. Should we bypass the "Fade Out" transition on the game camera when exiting, and just hard-cut back to the main menu for maximum speed?
5. Does this lag happen every time, or only if you click Exit while a photo is fading in/loading?

**Existing Code Reuse:**

- `VictorySlideshow.js`: I will focus on the `exit()` method and how it interacts with the running `playSequence` promises.
- `SceneTransition.js`: I need to check if `transitionTo` handles interruptions or if it's waiting for a camera effect that isn't updating.

**Visual Assets Request:**
No new visuals needed, but if you have a screen recording of the lag, that would be amazing. Otherwise, I will rely on code analysis.

Please answer the questions above.
