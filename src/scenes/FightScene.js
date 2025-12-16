import Phaser from "phaser";
import Fighter, { FighterState } from "../components/Fighter";
import TouchInputController from "../systems/TouchInputController";
import TouchVisuals from "../components/TouchVisuals";

export default class FightScene extends Phaser.Scene {
  constructor() {
    super("FightScene");
  }

  create() {
    // 1. Setup Scene Geometry (Floor)
    const { width, height } = this.scale;
    const floorHeight = 50;

    // Static physics group for the floor
    this.floor = this.physics.add.staticGroup();
    // Create an invisible floor rect
    const floorRect = this.add.rectangle(
      width / 2,
      height - floorHeight / 2,
      width,
      floorHeight,
      0x00ff00,
      0.5 // Alpha 0.5 for debug visibility
    );
    this.floor.add(floorRect);

    // World Bounds
    this.physics.world.setBounds(0, 0, width, height);

    // 2. Instantiate Fighters
    // Player 1 (Ryu)
    this.player1 = new Fighter(this, 200, height - 100, "ryu");
    // Player 2 (Ken)
    this.player2 = new Fighter(this, width - 200, height - 100, "ken");
    this.player2.setFlipX(true); // Face left

    // 3. Collisions
    this.physics.add.collider(this.player1, this.floor);
    this.physics.add.collider(this.player2, this.floor);
    this.physics.add.collider(this.player1, this.player2);

    // 4. Controls

    // Touch Controls (Mobile)
    this.touchController = new TouchInputController(this);
    this.touchVisuals = new TouchVisuals(this);

    // Player 1 Controls (Hybrid: Touch OR Keyboard)
    // We create a Proxy or Composite object to merge Keyboard + Touch inputs?
    // For simplicity: We pass both to Fighter.setControls, and Fighter checks both.

    const p1Cursors = this.input.keyboard.createCursorKeys();
    const p1Keys = {
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    // Inject touch controller into Player 1
    // Fighter.js needs a slight update to handle "composite" controls or we just pass the touch objects
    // Let's pass the touch controller directly to P1 for now
    this.player1.setControls(p1Cursors, p1Keys, this.touchController);

    // Player 2 Controls (WASD + F) - Basic implementation for testing
    const p2Cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    const p2Keys = {
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
    };
    this.player2.setControls(p2Cursors, p2Keys);

    // Camera
    // this.cameras.main.startFollow(this.player1, true, 0.1, 0.1);
  }

  update() {
    this.player1.update();
    this.player2.update();

    // Hitbox Detection
    this.checkAttack(this.player1, this.player2);
    this.checkAttack(this.player2, this.player1);
  }

  checkAttack(attacker, defender) {
    if (
      attacker.currentState === FighterState.ATTACK &&
      attacker.anims.currentFrame.index === 2 // Frame 2 is the "active" frame in our generator
    ) {
      // Define Attack Box (Simple overlap check for now)
      // In a real app, this would be a separate physics body spawned for 1 frame
      const attackRange = 80;
      const distance = Phaser.Math.Distance.Between(
        attacker.x,
        attacker.y,
        defender.x,
        defender.y
      );

      // Simple directional check
      const facingTarget = attacker.flipX
        ? attacker.x > defender.x
        : attacker.x < defender.x;

      if (distance < attackRange && facingTarget) {
        // Hit Confirmed
        // eslint-disable-next-line no-console
        console.log(`${attacker.texture.key} hit ${defender.texture.key}!`);

        // Apply hit state to defender
        // defender.setState(FighterState.HIT); // Disabled for now to prevent infinite stun loop in simple test
        defender.setTint(0xff0000);
        this.time.delayedCall(200, () => defender.clearTint());
      }
    }
  }
}
