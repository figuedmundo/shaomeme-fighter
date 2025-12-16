import Phaser from 'phaser';

const API_URL_CITIES = 'http://localhost:3000/api/cities';

export default class WorldMapScene extends Phaser.Scene {
    constructor() {
        super('WorldMapScene');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, 50, 'SELECT ARENA', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, 'Loading cities...', { fontSize: '24px', color: '#aaaaaa' }).setOrigin(0.5);

        this.fetchCities(width, height);
    }

    async fetchCities(width, height) {
        try {
            const response = await fetch(API_URL_CITIES);
            const cities = await response.json();

            // Clear loading text
            this.children.removeAll();
            this.add.text(width / 2, 50, 'SELECT ARENA', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);

            if (cities.length === 0) {
                this.add.text(width / 2, height / 2, 'No Cities Found in /photos', { fontSize: '24px', color: '#ff0000' }).setOrigin(0.5);
                return;
            }

            // Create Grid of Buttons
            const cols = 2;
            const startX = width * 0.25;
            const startY = 150;
            const gapX = width * 0.5;
            const gapY = 100;

            cities.forEach((city, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);

                const x = startX + col * gapX;
                const y = startY + row * gapY;

                this.createCityButton(x, y, city);
            });

        } catch (error) {
            console.error('Failed to load cities:', error);
            this.children.removeAll();
            this.add.text(width / 2, height / 2, 'Error Loading Cities', { fontSize: '24px', color: '#ff0000' }).setOrigin(0.5);
        }
    }

    createCityButton(x, y, cityName) {
        const bg = this.add.rectangle(x, y, 300, 80, 0x333333).setInteractive();
        const text = this.add.text(x, y, cityName.toUpperCase(), { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);

        bg.on('pointerover', () => {
            bg.setFillStyle(0x555555);
            text.setScale(1.1);
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x333333);
            text.setScale(1.0);
        });

        bg.on('pointerdown', () => {
            console.log(`Selected City: ${cityName}`);
            this.scene.start('FightScene', { city: cityName });
        });
    }
}
