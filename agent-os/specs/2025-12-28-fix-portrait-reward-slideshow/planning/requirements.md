# Spec Requirements: Fix Portrait/Landscape Reward Slideshow

## Initial Description

"if the picture reward is portrait , it is not being displayed in the slideshow , only a small white rectacgule is visible and the picture blured can be seen in the background, but the actual picture in the polaroid frame is not displayed"

_Correction during requirements gathering:_ The user clarified that the issue is actually occurring with **landscape** photos, while portrait photos are working correctly. The visual symptom ("small white rectangle") persists.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the "small white rectangle" you see is likely the collapsed or shrunken polaroid frame. Is it centered on the screen, or located elsewhere?
**Answer:** Yes.

**Q2:** I'm thinking the desired behavior for portrait photos is to maximize them to fit the screen height (centered), with the polaroid frame adapting to the image aspect ratio. Is that correct, or should they have a fixed size?
**Answer:** Yes, the image needs to be centered, a little smaller than the screen size so as the portrait pictures , we are able to see the frame of the polaroid, and of course we can see the date.

**Q3:** Does this issue happen with _every_ portrait photo, or are there specific ones (e.g., very high resolution or specific aspect ratios) that fail?
**Answer:** All **landscape** photos have this issue. Portrait pictures are working well.

**Q4:** You mentioned the "blurred background" works. This confirms the image loads. I assume we should keep the blurred background effect for portrait photos as well?
**Answer:** Yes.

**Q5:** Are there any specific constraints on the photo dimensions we should enforce, or should the system handle any aspect ratio dynamically?
**Answer:** Please suggest. (Agreed to suggestion in Follow-up)

### Follow-up Questions

**Follow-up 1:** Clarification on Photo Type: In your original request, you mentioned the issue happens when the picture is **portrait**. However, in answer #3, you mentioned "all **landscapes** photos have this issue". Did you mean that **all portrait** photos have this issue? Or do you mean that **landscape** photos _also_ have this issue?
**Answer:** All landscpae pictures have this isiue, portrait pictures are working well.

**Follow-up 2:** Suggestion for Dimensions (Q5): I suggest we implement a dynamic "contain" strategy. The polaroid frame will have a maximum size (e.g., 85% of screen height/width). The photo inside will scale down to fit entirely within that frame while keeping its original aspect ratio. This ensures the white border and date are always visible, regardless of whether the photo is portrait, landscape, or square. Does this approach work for you?
**Answer:** Okay.

### Existing Code to Reference

No similar existing features identified for reference by the user.

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Fix Landscape Display:** Ensure landscape images in the victory slideshow display correctly, not collapsing into a "small white rectangle".
- **Maintain Portrait Display:** Ensure portrait images continue to display correctly (as user reports they currently do).
- **Dynamic Sizing:** Implement a "contain" strategy where the polaroid frame adapts to the image's aspect ratio.
- **Max Dimensions:** The polaroid frame should be constrained (e.g., ~85% of screen size) to ensuring it is fully visible without being cut off.
- **Center Alignment:** The frame must remain centered on the screen.
- **Polaroid Elements:** The white border and handwritten date must remain visible for all aspect ratios.
- **Background:** The blurred background effect must persist for all image types.

### Reusability Opportunities

- The existing `VictorySlideshow.js` component and `victory.css` are the direct targets for modification.
- The `.is-portrait` class logic in `VictorySlideshow.js` demonstrates existing conditional sizing that can be expanded or generalized.

### Scope Boundaries

**In Scope:**

- modifying `src/components/VictorySlideshow.js` to calculate or assign correct classes/dimensions for landscape images.
- modifying `src/styles/victory.css` to handle landscape sizing preventing collapse.

**Out of Scope:**

- Changes to the photo fetching API.
- Changes to other scenes (FightScene, etc.).

### Technical Considerations

- **CSS Flexbox/Grid behavior:** The "small white rectangle" likely results from a flex container child (the image) having `width: 100%` inside a parent (the polaroid frame) that has no intrinsic width, causing a collapse to the parent's padding.
- **Aspect Ratio:** We need to ensure the container (`.polaroid-frame`) gets its size from the image's natural dimensions _constrained_ by the screen viewport, OR the image gets its size from the viewport and the container wraps it.
