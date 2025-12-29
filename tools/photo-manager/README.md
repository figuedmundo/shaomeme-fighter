# Photo Manager Tool

A standalone visual tool to manage photo notes for Shaomeme Fighter.

## Features

- **Visual Gallery:** See exactly which photo you are annotating.
- **Game Preview:** Preview how the photo and note will look in the actual game reward sequence.
- **Orphan Detection:** Highlights notes in `notes.json` that no longer have a corresponding photo file.
- **Localhost Only:** Runs independently of the game on your development machine.

## Setup & Running

### 1. Ensure Game Server is Running

The tool uses the main game server to read photos and save notes.

```bash
pnpm server
```

The backend runs at `http://localhost:3000`.

### 2. Start the Manager Tool

```bash
cd tools/photo-manager
pnpm install
pnpm run dev
```

The tool will run at `http://localhost:5174`.

## Workflow

1. Select a city from the sidebar.
2. Scroll through the photos.
3. Hover over a photo and click the **Eye icon** to see a "Game Preview".
4. Type your memories in the text area.
5. Click **Save Changes** to update the `notes.json` file for that city.
