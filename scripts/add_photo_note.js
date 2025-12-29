/**
 * @file scripts/add_photo_note.js
 * @description
 * Adds or updates a custom note for a specific photo.
 * These notes are stored in a 'notes.json' file within each city directory.
 *
 * Usage:
 *   node scripts/add_photo_note.js <file_path> "<your note here>"
 *
 * Example:
 *   node scripts/add_photo_note.js photos/paris/2023-12-25_15-00-00.jpg "The best crepes we ever had!"
 */

import fs from "node:fs/promises";
import path from "path";

async function addNote() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/add_photo_note.js <file_path> "<note>"');
    process.exit(1);
  }

  const filePathInput = args[0];
  const note = args[1];

  try {
    const fullPath = path.resolve(filePathInput);
    await fs.access(fullPath);

    const dir = path.dirname(fullPath);
    const filename = path.basename(fullPath);
    const notesPath = path.join(dir, "notes.json");

    // 1. Read existing notes
    let notes = {};
    try {
      const data = await fs.readFile(notesPath, "utf8");
      notes = JSON.parse(data);
    } catch (e) {
      // notes.json might not exist yet
    }

    // 2. Add/Update note
    notes[filename] = note;

    // 3. Save back to notes.json
    await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));

    console.log(`✅ Note added to ${filename}: "${note}"`);
    console.log(`📂 Saved in: ${notesPath}`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

addNote();
