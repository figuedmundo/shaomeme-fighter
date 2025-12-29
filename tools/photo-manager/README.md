# Photo Manager Tool

A standalone visual tool to manage photo notes for Shaomeme Fighter.

## Features

- **Master-Detail Layout:** Quickly scroll through city photos and edit details in a large side-panel.
- **Real-time Polaroid Preview:** See exactly how your photo, date, and note will look in the game's reward slideshow.
- **Orphan Detection:** Identifies notes in `notes.json` that no longer have a corresponding photo file (highlighted in red).
- **Consitency:** Uses the exact same date-parsing and visual rendering logic as the main game engine.

## Setup & Running

### 1. Ensure Game Server is Running

The tool uses the main game server to read photos and save notes.

```bash
pnpm server
```

The backend runs at `http://localhost:3000`.

### 2. Start the Manager Tool

From the root of the project:

```bash
pnpm manager
```

The tool will be accessible at `http://localhost:5174`.

## Workflow

1. Select a **City** from the left sidebar.
2. Select a **Photo** from the center list.
3. Observe the **Live Preview** in the right panel. It replicates the game's Polaroid frame and handwriting font.
4. Type your memory in the **Note Box**. The preview updates as you type. You can add emoticons using the smiley-face button.
5. To correct the photo's date, use the date/time input field and click **Update Date**. This changes the file's underlying EXIF and filesystem data.
6. Click **Save All Changes** to update the `notes.json` file for that city.

## Technical Details

- **Architecture:** React + Vite frontend communicating with the Express backend on port 3000.
- **Storage:** Writes to `photos/[city]/notes.json`.
- **Date Logic:** Mirrors the game's fallback chain (Filename > EXIF > mtime).
