import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0);

        // Logo
        const logo = this.add.image(width / 2, height * 0.3, 'logo');
        logo.setScale(0.5); // Adjust based on actual image size

        // Title Text (if logo fails or just extra style)
        // this.add.text(width / 2, height * 0.3 + 100, 'SHAOMEME FIGHTER', { fontSize: '48px', color: '#ffaa00', fontStyle: 'bold' }).setOrigin(0.5);

        // Start Button / Text
        const startText = this.add.text(width / 2, height * 0.7, 'TAP TO START', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Interactive
        this.input.on('pointerdown', () => {
            this.scene.start('WorldMapScene');
        });
    }
}
