import Phaser from 'phaser';
import CombatSystem from '../systems/CombatSystem';
import { Fighters } from '../config/fighterConfig';

export default class FightScene extends Phaser.Scene {
    constructor() {
        super('FightScene');
    }

    init(data) {
        this.city = data.city || 'default';
        console.log(`Initializing FightScene for City: ${this.city}`);
    }

    create() {
        const { width, height } = this.scale;

        // Display City Name
        this.add.text(width / 2, 50, `ARENA: ${this.city.toUpperCase()}`, { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        // Initialize Fighter Stats from Config
        // We create local copies so we don't mutate the config
        this.heroStats = { ...Fighters.HERO, currentHealth: Fighters.HERO.health };
        this.opponentStats = { ...Fighters.OPPONENT_1, currentHealth: Fighters.OPPONENT_1.health };

        // --- Visual Debugging for Zones ---
        this.createZones(width, height);

        // --- Fighters ---
        this.player = this.createFighter(100, height - 100, 0x00ff00, this.heroStats);
        this.opponent = this.createFighter(width - 100, height - 100, 0xff00ff, this.opponentStats);

        // --- Ground & Physics ---
        this.createEnvironment(width, height);

        // --- Health Bars ---
        this.createHealthBars(width);

        // --- Input ---
        this.setupInputs();
    }

    createZones(width, height) {
        // Left (Move/Block) - Blue
        this.add.rectangle(width * 0.25, height / 2, width * 0.5, height, 0x0000ff, 0.1);
        this.add.text(width * 0.25, height / 2, 'MOVE / BLOCK\n(Hold Left)', { fontSize: '24px', color: '#ffffff', align: 'center' }).setOrigin(0.5);

        // Right (Attack) - Red
        this.add.rectangle(width * 0.75, height / 2, width * 0.5, height, 0xff0000, 0.1);
        this.add.text(width * 0.75, height / 2, 'ATTACK\n(Tap Right)', { fontSize: '24px', color: '#ffffff', align: 'center' }).setOrigin(0.5);
    }

    createFighter(x, y, color, stats) {
        const sprite = this.add.rectangle(x, y, 50, 100, color);
        this.physics.add.existing(sprite);
        sprite.body.setCollideWorldBounds(true);
        sprite.body.setGravityY(500);
        sprite.stats = stats; // Attach stats to sprite
        return sprite;
    }

    createEnvironment(width, height) {
        const ground = this.add.rectangle(width / 2, height - 20, width, 40, 0x654321);
        this.physics.add.existing(ground, true);
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.opponent, ground);
    }

    createHealthBars(width) {
        // Left Bar
        this.p1HealthBg = this.add.rectangle(50, 50, 300, 30, 0xffffff).setOrigin(0, 0);
        this.p1HealthFill = this.add.rectangle(50, 50, 300, 30, 0x00ff00).setOrigin(0, 0);

        // Right Bar
        this.p2HealthBg = this.add.rectangle(width - 350, 50, 300, 30, 0xffffff).setOrigin(0, 0);
        this.p2HealthFill = this.add.rectangle(width - 350, 50, 300, 30, 0x00ff00).setOrigin(0, 0);
    }

    updateHealthBars() {
        const p1Pct = Math.max(0, this.heroStats.currentHealth / this.heroStats.health);
        this.p1HealthFill.width = 300 * p1Pct;

        const p2Pct = Math.max(0, this.opponentStats.currentHealth / this.opponentStats.health);
        this.p2HealthFill.width = 300 * p2Pct;
    }

    setupInputs() {
        this.input.addPointer(2);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x > this.scale.width * 0.5) {
                this.handleAttack(); // Right side tap
            }
        });
    }

    update() {
        // Reset player velocity
        this.player.body.setVelocityX(0);

        // Check for Left Side interactions (Movement / Block)
        let isMoving = false;
        let isBlocking = false;

        // Check all active pointers
        const pointers = [this.input.pointer1, this.input.pointer2, this.input.activePointer];

        pointers.forEach(p => {
            if (p.isDown && p.x < this.scale.width * 0.5) {
                // Left Zone Active

                // Logic: 
                // If touching far left -> Block/Move Left?
                // If touching near center -> Move Right?
                // For simplicity: Just Move Right (Approach enemy)
                this.player.body.setVelocityX(200);
                isMoving = true;
            }
        });

        // Simple Bot Logic (Opponent)
        // If player is close, attack occasionally
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.opponent.x, this.opponent.y);

        if (dist < 100 && Math.random() < 0.02) {
            this.botAttack();
        }
    }

    handleAttack() {
        // Visual feedback
        this.tweens.add({
            targets: this.player,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });

        // 1. Calculate Damage
        // For now, assume Opponent is NOT blocking (we haven't implemented bot blocking yet)
        const damage = CombatSystem.getDamage(this.heroStats, this.opponentStats);

        // 2. Apply Damage (if close enough)
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.opponent.x, this.opponent.y);
        console.log(`Attack Distance: ${dist}`); // Debug log
        if (dist <= 160) { // Increased range + inclusive check
            if (damage > 0) {
                console.log(`Player hit Opponent for ${damage.toFixed(1)}!`);
                this.opponentStats.currentHealth -= damage;
                this.updateHealthBars();

                // Hit feedback
                this.tweens.add({
                    targets: this.opponent,
                    x: this.opponent.x + 20, // Knockback
                    duration: 100,
                    yoyo: true
                });

                this.checkWinCondition();
            } else {
                console.log("Attack Blocked!");
            }
        } else {
            console.log("Attack Missed (Out of range)");
        }
    }

    botAttack() {
        // Bot attacks player
        this.tweens.add({
            targets: this.opponent,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });

        const damage = CombatSystem.getDamage(this.opponentStats, this.heroStats);
        this.heroStats.currentHealth -= damage;
        this.updateHealthBars();
        console.log(`Bot hit Player for ${damage.toFixed(1)}!`);

        this.checkWinCondition();
    }

    checkWinCondition() {
        if (this.opponentStats.currentHealth <= 0) {
            console.log("YOU WIN!");
            // Trigger Photo Reward (Mock)
            this.scene.restart(); // Temporary restart
        } else if (this.heroStats.currentHealth <= 0) {
            console.log("YOU LOSE!");
            this.scene.restart();
        }
    }
}
