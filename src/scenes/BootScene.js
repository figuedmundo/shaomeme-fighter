import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets here
        this.load.image('logo', 'assets/logo.png');

        // Placeholder for fighter
        this.load.rect = (key, color) => {
            // Helper to generate a texture on the fly if needed, 
            // but for now we'll just use graphics in FightScene
        };
    }

    create() {
        this.scene.start('MainMenuScene');
    }
}
