export default class TouchVisuals {
  constructor(scene) {
    this.scene = scene;

    // Joystick Graphics
    this.joystickBase = this.scene.add
      .circle(0, 0, 50, 0xffffff, 0.2)
      .setVisible(false)
      .setDepth(100);
    this.joystickStick = this.scene.add
      .circle(0, 0, 25, 0xffffff, 0.5)
      .setVisible(false)
      .setDepth(101);

    // Event Listeners from Controller
    this.scene.events.on("joystick-start", this.showJoystick, this);
    this.scene.events.on("joystick-move", this.updateJoystick, this);
    this.scene.events.on("joystick-end", this.hideJoystick, this);
    this.scene.events.on("touch-combat", this.showRipple, this);
  }

  showJoystick(data) {
    this.joystickBase.setPosition(data.originX, data.originY).setVisible(true);
    this.joystickStick
      .setPosition(data.currentX, data.currentY)
      .setVisible(true);
  }

  updateJoystick(data) {
    // Clamp stick to radius
    const deltaX = data.currentX - data.originX;
    const deltaY = data.currentY - data.originY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (dist > data.radius) {
      const angle = Math.atan2(deltaY, deltaX);
      const clampX = data.originX + Math.cos(angle) * data.radius;
      const clampY = data.originY + Math.sin(angle) * data.radius;
      this.joystickStick.setPosition(clampX, clampY);
    } else {
      this.joystickStick.setPosition(data.currentX, data.currentY);
    }
  }

  hideJoystick() {
    this.joystickBase.setVisible(false);
    this.joystickStick.setVisible(false);
  }

  showRipple(coords) {
    const ripple = this.scene.add
      .circle(coords.x, coords.y, 10, 0x00ffff, 0.6)
      .setDepth(100);

    this.scene.tweens.add({
      targets: ripple,
      scale: 4,
      alpha: 0,
      duration: 300,
      onComplete: () => ripple.destroy(),
    });
  }
}
