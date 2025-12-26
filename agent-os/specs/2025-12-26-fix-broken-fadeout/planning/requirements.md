# Spec Requirements: Fix Broken Fade-Out on Slideshow Exit

## Initial Description

The user reports that despite the previous fix, clicking "Exit" still jumps directly back to the game without a proper fade-out of the pictures, screen, or music. The goal is to investigate why the fade-out logic implemented in `VictorySlideshow.js` is failing or being bypassed.

## Requirements Discussion

### First Round Questions

**Q1:** Is the fade-out logic actually being executed?
**Answer:** The code `this.overlay.style.transition` and `this.overlay.style.opacity` is present, but it might not be triggering a reflow or the browser might be optimizing it away before removal.

**Q2:** Is the `await new Promise(...)` for the delay actually waiting?
**Answer:** The code uses `setTimeout(resolve, 800)`, which _should_ work, but if `isExiting` flag logic in `playSequence` is somehow re-triggering or interfering, it might be causing issues. However, the user says it "jumps directly", which implies the wait is skipped or the overlay is removed instantly.

**Q3:** Is the CSS transition property valid?
**Answer:** Setting `style.transition = "opacity 0.8s ease-in-out"` directly on the element _should_ work, but if the element didn't have a computed style for opacity before, the browser might snap. Also, checking if `exiting` class is defined in CSS vs inline styles.

**Q4:** Music fade out?
**Answer:** `audioManager.stopMusic(800)` is called. If the scene switches immediately, the `AudioContext` or scene shutdown might kill the sound instantly, ignoring the fade.

### Existing Code to Reference

- `VictorySlideshow.js`: Review the `exit()` method.
- `SceneTransition.js`: Review how scene transitions handle audio persistence.

## Visual Assets

None.

## Requirements Summary

### Functional Requirements

- **Force Reflow:** Ensure the browser registers the "before" state (opacity 1) before setting the "after" state (opacity 0) to guarantee the transition plays.
- **Scene Persistence:** Ensure the `FightScene` (or whatever scene owns the audio) doesn't kill the audio immediately upon `scene.start('MainMenuScene')`. _Correction:_ `MainMenuScene` start will shut down `FightScene`. The fade needs to complete _before_ `scene.start`.
- **Debug:** Add logs to verify `exit()` enters the wait block.

### Technical Considerations

- **CSS Class vs Inline:** Use a CSS class `.victory-overlay.exiting` defined in a stylesheet (or injected) to ensure consistent behavior, rather than setting inline styles which can be finicky.
- **Reflow Hack:** Accessing `overlay.offsetHeight` before setting opacity 0 forces the browser to paint the frame.
- **Audio Context:** The audio manager's fade out is likely correct, but if the scene changes instantly, the fade is cut short. The `await` in `exit()` is crucial.

### Scope Boundaries

**In Scope:**

- Fixing `VictorySlideshow.js` `exit()` method.
- Ensuring CSS transitions trigger reliably.

**Out of Scope:**

- Changing the game engine transition logic.
