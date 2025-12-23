# Spec Requirements: Portrait Mode Ken Burns

## Initial Description

in the pictures reward , the picture is taken all the width of the screen, and because the picture is actually to see in portrait, the picture cant be seen all, can we update the ken burn efect to move the picture from top to down so we can see the whole picture ?

## Requirements Discussion

### First Round Questions

**Q1:** I assume this "top-to-bottom" panning effect is specifically for **portrait** photos (taller than they are wide) that are displayed at full screen width. For **landscape** photos, should we retain the existing randomized Ken Burns (slow zoom/pan) effect?
**Answer:** yes

**Q2:** I'm thinking the behavior should be: The image starts aligned to the **top**, fills the screen width, and then slowly pans down until the **bottom** of the image is visible. Is that correct?
**Answer:** yes

**Q3:** In the previous "Photo Reward Polish" spec, we discussed a "Polaroid border" and "fitting" the image on screen with a blurred background. Does this new request **replace** that style for portrait photos (making them full-width immersive), or should the Polaroid style still apply (just moving inside the frame)?
**Answer:** the polariod border and fitting the image witha blurred backfround should still apply

**Q4:** I assume the pan duration should ensure the image moves smoothly. Should we use a fixed duration (e.g., 5-7 seconds) for the pan, or should it vary based on how "tall" the image is?
**Answer:** can the duration be as much as tall is the image ?

**Q5:** When the pan reaches the bottom, should it:

- A) Fade immediately to the next photo?
- B) Pause briefly at the bottom?
- C) Pan back up (yoyo)?
  **Answer:** A

### Existing Code to Reference

**Similar Features Identified:**

- `src/components/VictorySlideshow.js`: Main component containing the slideshow logic and current Ken Burns implementation.
- CSS styles associated with `VictorySlideshow` (likely in `src/styles/VictorySlideshow.css` or similar).

### Follow-up Questions

None needed.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Targeting:** Apply this specific effect _only_ to portrait photos (Height > Width). Landscape photos retain the existing randomized behavior.
- **Pan Behavior:**
  - Image starts aligned to the **top** of its container.
  - Image width fills the container width.
  - Image pans smoothy downwards until the **bottom** edge is visible.
- **Duration:** The duration of the pan must be dynamic, proportional to the height of the image (taller images = longer duration) to maintain a consistent scanning speed.
- **Transition:** Upon reaching the bottom, the slide immediately fades to the next photo.
- **Presentation:** The existing "Polaroid" style (border) and "blurred background" context must be preserved. The panning happens _within_ the photo frame.

### Reusability Opportunities

- The existing `VictorySlideshow.js` component structure.
- Existing CSS transitions/animations.

### Scope Boundaries

**In Scope:**

- Updating `VictorySlideshow.js` logic to detect image orientation.
- calculating dynamic animation durations based on aspect ratio.
- Modifying CSS/JS to inject dynamic keyframes or transition values for the top-to-bottom pan.

**Out of Scope:**

- Changing the backend image serving.
- Altering the "Polaroid" frame design itself (just the content behavior).
- Interaction changes (hearts, tapping) - these remain as previously defined.

### Technical Considerations

- Need to ensure we can access the image natural dimensions to calculate the aspect ratio before showing it.
- CSS variables might be the cleanest way to handle the dynamic duration (`style={{ --pan-duration: calculatedDuration }}`).
