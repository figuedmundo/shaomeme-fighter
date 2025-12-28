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

## Production Management (SSH/CLI)

When running the game on a production server without a GUI, use the following methods to manage your photos.

### 1. Uploading Photos via SSH

The most efficient way to upload a large number of photos from your local machine to the server is using `rsync`.

**Run this from your local computer:**

```bash
rsync -avzP ./photos/ user@your-server-ip:/path/to/shaomeme-fighter/photos/
```

- **`-avzP`**: Preserves structure, compresses data during transfer, and allows **resuming** if the connection drops.

### 2. Docker Integration

In production, the `photos/` directory is mounted as a **Docker Volume**.

- Any files you upload to the host's `photos/` folder are **immediately visible** to the game.
- You do **not** need to restart the Docker containers when adding or removing photos.

### 3. Server-side Optimization

After uploading high-resolution photos to your server, you should run the optimization script to ensure they don't lag mobile devices.

**Run inside the project folder on the server:**

```bash
node scripts/optimize-assets.js
```

_Note: If running inside Docker, you can execute this via:_

```bash
docker exec -it shaomeme-fighter node scripts/optimize-assets.js
```

## Optimization Policy

To ensure smooth performance on mobile devices, the `optimize-assets.js` script:

1. Resizes giant images to fit within **2048x2048**.
2. Preserves the **Aspect Ratio** (no stretching).
3. Compresses files to **80% quality** (industry standard).

## Photo Management Scripts

We provide utility scripts to help manage your photo library, located in the `scripts/` directory.

> **⚠️ Production / Docker Users:**
> If you are running on a server where only Docker is installed, you must run these scripts **inside the container**.
>
> 1. **Update & Rebuild:** Since we added a new dependency (`piexifjs`), you must pull the changes and rebuild your container first:
>    ```bash
>    git pull
>    docker compose -f docker-compose.prod.yml up -d --build
>    ```
> 2. **Run Commands:** Prefix the commands below with `docker exec -it shaomeme-fighter ...`.

### 1. Rename Photos by Date (`scripts/rename_photos.js`)

This script automatically scans all city folders in `photos/` and renames every image based on its **Creation Date**. This is essential for ensuring photos appear in the correct chronological order in the Victory Slideshow.

**Usage (Local):**

```bash
node scripts/rename_photos.js
```

**Usage (Docker / Server):**

```bash
docker exec -it shaomeme-fighter node scripts/rename_photos.js
```

**What it does:**

- Scans all subdirectories in `photos/`.
- Extracts the creation date from EXIF metadata (primary) or File System creation time (fallback).
- Renames files to: `YYYY-MM-DD_HH-MM-SS.ext` (e.g., `2023-05-21_14-30-01.jpg`).
- Skips special files like `background.png`.

### 2. Fix Incorrect Photo Dates (`scripts/update_photo_date.js`)

Sometimes, photos (especially from messaging apps or downloads) lose their metadata, causing them to be renamed incorrectly (e.g., to today's date). Use this script to manually force a specific creation date onto a file.

**Usage (Local):**

```bash
node scripts/update_photo_date.js <path_to_file> "YYYY-MM-DD HH:MM:SS"
```

**Usage (Docker / Server):**

```bash
# Note: Paths inside Docker mirror your host paths if mounted correctly at /app/photos
docker exec -it shaomeme-fighter node scripts/update_photo_date.js photos/amsterdam/img_123.jpg "2023-12-25 09:30:00"
```

**Features:**

- **JPEGs:** Updates both the **File System** timestamp AND the internal **EXIF** metadata (`DateTimeOriginal`).
- **Other Formats (PNG, HEIC):** Updates the **File System** timestamp (which `rename_photos.js` will accept as a fallback).
