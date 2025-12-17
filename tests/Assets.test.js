import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Asset Availability', () => {
  const resourcesDir = path.join(__dirname, '../resources');

  it('should have the shaomeme_fighter.png logo', () => {
    const filePath = path.join(resourcesDir, 'shaomeme_fighter.png');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should have the soundtrack.mp3', () => {
    const filePath = path.join(resourcesDir, 'soundtrack.mp3');
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
