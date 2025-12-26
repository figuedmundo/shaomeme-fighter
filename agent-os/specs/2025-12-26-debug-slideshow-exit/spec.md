# Specification: Debug Slideshow Exit Delay

## Goal

Fix the 5-second lag when exiting the victory slideshow by ensuring all async operations (timers and image loads) are immediately cancelled or bypassed upon clicking "Exit". Implement a graceful fade-out transition for both visuals and audio.

## User Stories

- As a player, I want the slideshow to start closing the moment I tap "Exit" so I don't feel like the game is frozen.
- As a player, I want the exit to feel polished with a smooth fade to black and a music fade-out, rather than an abrupt jump.

## Specific Requirements

**Immediate Async Interruption**

- Use an `AbortController` or a specific "cancel delay" mechanism to interrupt the `await new Promise(...)` timer in `playSequence`.
- Ensure `showPhoto` checks the `isExiting` flag before and after every `await` (image load, state changes).

**Graceful Visual Fade-Out**

- When `exit()` is triggered, apply a CSS `fade-out` class to the entire `.victory-overlay` container.
- The fade-out should take approximately 500ms to 800ms.
- Wait for this CSS transition to complete before removing the DOM elements and switching scenes.

**Synchronized Music Fade-Out**

- Trigger `audioManager.stopMusic(800)` immediately when "Exit" is clicked to sync with the visual fade.

**UI State Acknowledgement**

- The exit button highlight (yellow) should stay active during the fade-out to show the game is processing the request.

## Visual Design

**`VictorySlideshow.js` (CSS additions)**

- `.victory-overlay.exiting` class with `opacity: 0` and a `transition: opacity 0.8s ease-in-out`.
- Ensure the background of the overlay is black so fading out the elements looks like a fade to black.

## Existing Code to Leverage

**`src/components/VictorySlideshow.js`**

- Refactor `playSequence` to handle interruption of the 5000ms delay.
- Update `exit()` to apply the "exiting" class and await the transition.

**`src/utils/SceneTransition.js`**

- Potentially use `fadeOut` method if the DOM overlay can be coordinated with the Phaser camera, though a pure DOM fade-out for the overlay is safer for immediate feedback.

## Out of Scope

- Changing the Ken Burns animation logic.
- Modifying the photo preloading strategy (except for cleanup).
