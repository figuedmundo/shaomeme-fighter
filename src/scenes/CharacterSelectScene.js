import Phaser from 'phaser';
import rosterConfig from '../config/rosterConfig';

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
    this.selectedCharacterIndex = 0;
    this.gridItems = [];
  }

  preload() {
    // Load Roster Assets
    rosterConfig.forEach(character => {
      this.load.image(`portrait_${character.id}`, character.portraitPath);
      this.load.image(`icon_${character.id}`, character.iconPath);
    });
    
    // Load default if needed (though we copy placeholders in config setup)
    // this.load.image('placeholder_silhouette', 'assets/silhouette.png'); // If we had one
  }

  create() {
    const { width, height } = this.scale;

    // Background (Dark)
    this.add.rectangle(width / 2, height / 2, width, height, 0x111111);

    // 1. Left Portrait (Player 1)
    // Placeholder start
    this.leftPortrait = this.add.image(width * 0.25, height / 2, `portrait_${rosterConfig[0].id}`)
      .setOrigin(0.5)
      // Fit height but keep aspect ratio roughly? Or strict height?
      // Let's constrain height to 80% screen
      .setDisplaySize(width * 0.4, height * 0.8); // Approx, will adjust with actual assets aspect

    // 2. Right Portrait (Opponent - Silhouette/Shadow)
    // For now, just a darkened version of a placeholder or nothing
    this.rightPortrait = this.add.rectangle(width * 0.75, height / 2, width * 0.3, height * 0.8, 0x000000, 0.5)
        .setStrokeStyle(2, 0x333333);
    
    // Add "VS" or "Opponent" text
    this.add.text(width * 0.75, height / 2, '?', {
        fontSize: '128px',
        color: '#333333',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // 3. Central Grid
    this.buildGrid();

    // 4. Character Name Text
    this.nameText = this.add.text(width * 0.25, height * 0.85, rosterConfig[0].displayName.toUpperCase(), {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { blur: 10, color: '#000000', fill: true }
    }).setOrigin(0.5);

    // 5. Select Button (Visual cue)
    this.selectBtn = this.add.text(width / 2, height * 0.9, 'SELECT', {
      fontSize: '32px',
      fill: '#ffd700',
      backgroundColor: '#330000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.confirmSelection());

    // Initial Selection
    this.selectCharacter(0);
  }

  buildGrid() {
    const { width, height } = this.scale;
    const cols = 3; // 3 columns
    const rows = Math.ceil(rosterConfig.length / cols);
    const iconSize = 100;
    const gap = 10;
    
    const gridWidth = (cols * iconSize) + ((cols - 1) * gap);
    const gridHeight = (rows * iconSize) + ((rows - 1) * gap);
    
    const startX = (width / 2) - (gridWidth / 2) + (iconSize / 2);
    const startY = (height / 2) - (gridHeight / 2) + (iconSize / 2);

    rosterConfig.forEach((char, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = startX + (col * (iconSize + gap));
      const y = startY + (row * (iconSize + gap));

      // Icon
      const icon = this.add.image(x, y, `icon_${char.id}`)
        .setDisplaySize(iconSize, iconSize)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.selectCharacter(index));
        
      // Border
      const border = this.add.rectangle(x, y, iconSize + 6, iconSize + 6)
        .setStrokeStyle(2, 0x444444); // Default grey

      this.gridItems.push({ icon, border });
    });
  }

  selectCharacter(index) {
    if (index < 0 || index >= rosterConfig.length) return;
    
    this.selectedCharacterIndex = index;
    const char = rosterConfig[index];

    // Update Portrait
    this.leftPortrait.setTexture(`portrait_${char.id}`);
    
    // Update Name
    this.nameText.setText(char.displayName.toUpperCase());

    // Update Grid Highlights
    this.gridItems.forEach((item, i) => {
      if (i === index) {
        item.border.setStrokeStyle(4, 0xffd700); // Gold
      } else {
        item.border.setStrokeStyle(2, 0x444444); // Grey
      }
    });
  }

  confirmSelection() {
    const char = rosterConfig[this.selectedCharacterIndex];
    this.scene.start('ArenaSelectScene', {
      playerCharacter: char.id
    });
  }
}
