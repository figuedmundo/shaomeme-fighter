export default class TouchInputController {
  constructor(scene) {
    this.scene = scene;

    // Enable multi-touch (2 pointers for move + attack)
    this.scene.input.addPointer(2);

    // Internal State
    this.cursorKeys = {
      up: { isDown: false },
      down: { isDown: false },
      left: { isDown: false },
      right: { isDown: false },
    };
    this.attackKey = { isDown: false };

    // Joystick Config
    this.joystick = {
      active: false,
      pointerId: null,
      originX: 0,
      originY: 0,
      currentX: 0,
      currentY: 0,
      radius: 50,
      threshold: 20,
    };

    // Input Listeners
    this.scene.input.on("pointerdown", this.handlePointerDown, this);
    this.scene.input.on("pointermove", this.handlePointerMove, this);
    this.scene.input.on("pointerup", this.handlePointerUp, this);
  }

  handlePointerDown(pointer) {
    const { width } = this.scene.scale;
    const isLeftZone = pointer.x < width / 2;

    if (isLeftZone) {
      // Joystick Start
      if (!this.joystick.active) {
        this.joystick.active = true;
        this.joystick.pointerId = pointer.id;
        this.joystick.originX = pointer.x;
        this.joystick.originY = pointer.y;
        this.joystick.currentX = pointer.x;
        this.joystick.currentY = pointer.y;

        // Emit event for visuals (to be implemented later)
        this.scene.events.emit("joystick-start", this.joystick);
      }
    } else {
      // Right Zone - Combat
      // Tap = Attack
      this.attackKey.isDown = true;

      // Emit event for visuals
      this.scene.events.emit("touch-combat", { x: pointer.x, y: pointer.y });

      // Auto-reset attack after short delay (simulating a key press)
      this.scene.time.delayedCall(100, () => {
        this.attackKey.isDown = false;
      });
    }
  }

  handlePointerMove(pointer) {
    if (this.joystick.active && pointer.id === this.joystick.pointerId) {
      this.joystick.currentX = pointer.x;
      this.joystick.currentY = pointer.y;

      this.updateJoystickState();

      // Emit event for visuals
      this.scene.events.emit("joystick-move", this.joystick);
    }
  }

  handlePointerUp(pointer) {
    if (this.joystick.active && pointer.id === this.joystick.pointerId) {
      this.joystick.active = false;
      this.joystick.pointerId = null;
      this.resetCursorKeys();

      // Emit event for visuals
      this.scene.events.emit("joystick-end");
    }
  }

  updateJoystickState() {
    const deltaX = this.joystick.currentX - this.joystick.originX;
    const deltaY = this.joystick.currentY - this.joystick.originY;

    // Reset first
    this.resetCursorKeys();

    // Determine Direction based on Thresholds
    if (Math.abs(deltaX) > this.joystick.threshold) {
      if (deltaX > 0) this.cursorKeys.right.isDown = true;
      else this.cursorKeys.left.isDown = true;
    }

    if (Math.abs(deltaY) > this.joystick.threshold) {
      if (deltaY > 0) this.cursorKeys.down.isDown = true;
      else this.cursorKeys.up.isDown = true;
    }
  }

  resetCursorKeys() {
    this.cursorKeys.up.isDown = false;
    this.cursorKeys.down.isDown = false;
    this.cursorKeys.left.isDown = false;
    this.cursorKeys.right.isDown = false;
  }

  getCursorKeys() {
    return this.cursorKeys;
  }

  getAttackKey() {
    return this.attackKey;
  }
}
