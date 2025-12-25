# Memory Arenas & Photo Rewards

This directory contains the personalized content that powers the "Memory Arenas" system in Shaomeme Fighter.

## Directory Structure

Each subfolder represents a unique **Arena** (City). The folder name is used as the ID in the game's configuration and UI.

```text
photos/
├── city_name/
│   ├── background.png      # The actual fighting stage (Tracked by Git)
│   ├── image1.jpg          # Reward photo shown on victory (Ignored by Git)
│   ├── image2.png          # Reward photo shown on victory (Ignored by Git)
│   └── ...
└── ...
```

## Special Files

### `background.png` (or `arena.png`)

- **Purpose**: Used as the static background for the fight scene.
- **Git Policy**: These files **ARE** tracked by Git to ensure the game has functional arenas out of the box.
- **Specs**: Should ideally be 16:9 aspect ratio (e.g., 1920x1080) and under 1MB after optimization.

### Reward Photos (`*.jpg`, `*.png`, `*.webp`, etc.)

- **Purpose**: These are "memories" displayed in a cinematic Ken Burns slideshow when the player wins a match in this arena.
- **Git Policy**: These files are **IGNORED** by Git to keep the repository size small. Users are expected to add their own personal photos locally.
- **Logic**: The server dynamically counts these files to determine if an arena is "Unlocked" or "Coming Soon".

## How to Add a New Arena

1. **Create a Folder**: Create a new folder with the city name (e.g., `tokyo`).
2. **Add Background**: Place a `background.png` inside.
3. **Add Photos**: Place any number of personal photos inside.
4. **Register in Config**: Add the city key to `src/config/gameData.json` to define its display name, lighting, and weather presets.

## Optimization

To ensure smooth performance on mobile devices, use the project's optimization script:

```bash
node scripts/optimize-assets.js
```

This will compress the assets in `public/assets`, but it is also recommended to manually compress `background.png` files before committing them.
