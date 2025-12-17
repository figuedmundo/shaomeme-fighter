# Product Roadmap

1. [x] **Project Initialization & Phaser Setup** — Set up Phaser 3 with Vite, create basic scene structure (Boot, MainMenu, Fight), and ensure the Node.js backend serves the app. `XS`
2. [x] **Core Combat System (Phaser Port)** — Port physics, hitboxes, and state machine (Idle, Walk, Attack, Hit) from `temp_clone` to Phaser 3 sprites. `M`
3. [x] **Invisible Combat Zones (Touch Controls)** — Implement split-screen touch input handling for mobile/tablet (Tap/Swipe to attack/move) to replace keyboard input. `S`
4. [x] **Photo Asset Service** — Implement Node.js backend endpoint `/api/photos` to scan and serve images from the `photos/` directory structure. `S`
5. [x] **Dynamic Arena Selector** — Create a scene to select arenas based on available folders in `photos/`, stylizing the selection UI. `M`
6. [x] **Character Roster Integration** — Implement the character selection screen and load custom spritesheets (placeholder or generated) for the specific roster. `M`
7. [x] **Victory Slideshow Reward** — Implement the post-match sequence that fetches and displays a photo slideshow from the arena's location upon winning. `M`
8. [x] **Visual Polish & Branding** — Integrate the new "Shaomeme Fighter" logos, add UI sounds, and apply "game style" filters to background photos. `S`

> Notes
> - **Foundation**: Items 1 & 2 establish the game engine and core loop.
> - **Input**: Item 3 is critical for the target device (iPad).
> - **Personalization**: Items 4, 5, 6, & 7 implement the unique "Personalized Gift" aspect.
> - **Polish**: Item 8 ties it all together visually.
