# Spec Requirements: Victory Slideshow Reward

## Initial Description
Implement the post-match sequence that fetches and displays a photo slideshow from the arena's location upon winning.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the slideshow should trigger immediately after the "KO" / "You Win" sequence and the fighter's victory pose. Is that correct?
**Answer:** after the fighter's victory pose.

**Q2:** I'm thinking the slideshow will be a full-screen overlay or modal. Should the photos auto-advance (e.g., every 3-4 seconds)?
**Answer:** is it possible pass the photos full screen ,because is an ipad/iphone , we dont have too much space display images, right? also I think we can have like a overlay smoke in the borders ? to also match the whole dark mortal kombat esthetics, and is possilble add a filter like it were a movie with credits ? (but the credit can be something we can add later, instead of credits can be a like a letter but not now, lets focus on how we are going to present the photos)

**Q3:** I assume we will use the existing `/api/photos` endpoint to fetch images. Filtering needed?
**Answer:** yes (implied: fetch images for the current arena).

**Q4:** Upon finishing the slideshow, where should the user be navigated?
**Answer:** where is the recomended according the game fighihtng industry ? (Agreed to return to **Arena Select** to choose a new location).

**Q5:** Audio: combat music fade out and replaced by specific "Victory" or "Memory" music?
**Answer:** yes, we can switch to music or sountracks that can be preselected by different locations.

**Q6:** Complex transitions?
**Answer:** like a was saying if we can mae the transition looks like a movie would be great

### Follow-up Questions

**Follow-up 1:** Victory Music source?
**Answer:** `KO.mp3` and `victory.mp3` are good options for the immediate win. For the background music during presentation, play music from groups she likes, or music that remembers that part of the world.

**Follow-up 2:** Slideshow Duration?
**Answer:** 3-4 seconds per slide is acceptable.

## Visual Assets

### Files Provided:
- `smoke.png`: A dark, smoky border frame with a transparent center.

### Visual Insights:
- **Smoke Overlay:** The `smoke.png` should be used as a border frame (z-index top) to frame the photos.
- **Movie Aesthetic:** CSS filters (sepia, high contrast, maybe slight film grain or vignette) should be applied to the photos to give a "cinematic/memory" feel.
- **Full Screen:** Maximized use of screen real estate for the photos, but respecting the "Smoke" border.

## Requirements Summary

### Functional Requirements
- **Trigger:** Activates automatically after `FightScene` victory pose sequence.
- **Data Source:** Fetch images via `/api/photos?city=[currentArena]`.
- **Display:** Full-screen HTML Overlay (DOM) on top of the Phaser canvas.
- **Slideshow Logic:**
    - Auto-advance every 3-4 seconds.
    - Loop through available photos.
    - "Exit/Back" button to leave early.
- **Audio Logic:**
    - Stop Fight Music.
    - Play KO/Victory sound (immediate).
    - Start Slideshow Music: Attempt to find a specific music track for the location. If not found, use a fallback (e.g., `arena.mp3` or a generic sentimental track).
- **Navigation:** Ends at **Arena Select Scene**.

### Reusability Opportunities
- **Backend:** Reuse `/api/photos` endpoint.
- **UI:** Use CSS modules for the overlay (similar to `touch.css` pattern).

### Scope Boundaries
**In Scope:**
- Fetching and displaying photos for the winning arena.
- "Smoke" border overlay using provided asset.
- "Movie" CSS filters.
- Location-specific music logic (check for file, fallback if missing).
- Return navigation to Arena Select.

**Out of Scope:**
- "Credits" text rolling (mentioned as a future idea).
- Complex WebGL shaders for transitions (CSS transitions will be used).

### Technical Considerations
- **HTML Overlay:** Use a separate DOM element (`div`) layered over the Phaser canvas. This allows for easier CSS styling (filters, transitions, responsiveness) compared to Phaser GameObjects.
- **Music File Handling:** The frontend will likely need to "check" if a music file exists (or the API returns it in metadata) to play it.
