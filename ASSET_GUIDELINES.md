# Shaomeme Fighter - Asset Guidelines

To ensure the best visual quality and performance on mobile devices (especially iPhone), please follow these guidelines when adding new characters or arenas.

## 1. Arena Backgrounds (Photos)

These are the photos you add to the `photos/` directory.

*   **Recommended Resolution:** `1920 x 1080` (1080p) or `2560 x 1440` (1440p).
*   **Aspect Ratio:** `16:9` is standard, but since modern iPhones are wider (~19.5:9), `21:9` photos also work well.
*   **Format:** `.jpg` or `.png`. The server automatically converts these to `.webp` for the game, which saves data.
*   **Quality:** 
    *   Avoid extremely high-resolution photos (like 8K) as they will slow down the loading time on mobile data. 
    *   Ensure the "ground" in your photo is roughly in the bottom 20% of the image so characters have a place to stand.

## 2. Character Sprites

Characters are loaded as **Spritesheets**. The code expects a **single horizontal row** of frames.

*   **High Quality Size:** `200 x 400` pixels (for sharper details on retina displays).
*   **Total Dimensions (Standard):** `3600 x 400` pixels (1 row of 18 frames).
*   **Structure:** Arrange your 18 frames in a single horizontal strip in this exact order:
    1.  **Frames 0-3:** Idle animation (4 frames).
    2.  **Frames 4-9:** Walk animation (6 frames).
    3.  **Frame 10:** Jump/Air frame (1 frame).
    4.  **Frame 11:** Crouch frame (1 frame).
    5.  **Frames 12-14:** Attack frames (3 frames).
    6.  **Frame 15:** Hit reaction (1 frame).
    7.  **Frame 16:** Block frame (1 frame).
    8.  **Frame 17:** Die frame (1 frame).
*   **Transparency:** Use `.png` with a transparent background.
*   **Padding:** Center the character within the `200x400` frame area. Leave space for movement so they don't hit the edges of their individual frame box.

## 3. Portraits & Icons

Each character requires two types of static art for the UI.

### 3.1 Icons (Grid & HUD)
*   **Usage:** Used in the Character Select grid and the in-fight HUD (next to health bars).
*   **Dimensions:** `128 x 128` pixels (Standard) or `256 x 256` (High Quality).
*   **Shape:** Square.
*   **Content:** A clear "Headshot" of the character.
*   **Note:** In combat, these icons are "Reactive" and will shake or flash when the character is hit.

### 3.2 Selection Portraits
*   **Usage:** Large art shown on the sides of the screen during character selection.
*   **Recommended Size:** `800 x 1000` pixels (approx. 4:5 aspect ratio).
*   **Content:** High-detail art of the character. This can be a body shot (waist up or full body) in a cool fighting pose.
*   **Transparency:** Use `.png` with a transparent background.
*   **Style:** Digitized photo style (like Mortal Kombat) or stylized illustration.

## 4. Performance Tips

*   **File Names:** Use lowercase and underscores (e.g., `my_cool_character.png`, `dublin_street.jpg`). Avoid spaces.
*   **Compression:** If you use PNGs, run them through a tool like [TinyPNG](https://tinypng.com) before adding them to the project to keep the game fast.
