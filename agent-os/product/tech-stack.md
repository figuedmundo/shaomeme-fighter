# Product Tech Stack

## Framework & Runtime
- **Game Engine:** Phaser 3 (JavaScript)
- **Runtime:** Node.js (>=16)
- **Backend Framework:** Express.js (for serving game & photo API)
- **Package Manager:** npm (>=8)

## Frontend
- **Bundler:** Vite
- **Language:** JavaScript (ES Modules)
- **CSS:** Custom CSS (Arena, Fighter, UI styles)
- **Input Handling:** Phaser Input Plugin (Touch/Pointer) for "Invisible Combat Zones"

## Database & Storage
- **Data Storage:** File System (Local `photos/` directory structure for "Memory Arenas")
- **Asset Management:** Local `resources/` and `assets/` directories

## Testing & Quality
- **Linting:** ESLint (Airbnb configuration)
- **Formatting:** Prettier
- **Testing:** Manual Playtesting (Prototype phase), potentially Jest for logic in future

## Deployment & Infrastructure
- **Development Server:** Vite Dev Server
- **Production Build:** Vite Build (Static Assets) served by Node.js
- **Target Platform:** Mobile Web (iPad/iPhone focus)

## Key Libraries (Project Specific)
- **Phaser 3:** Core game loop, physics, rendering.
- **Express:** Simple API to bridge file system photos to the frontend.
