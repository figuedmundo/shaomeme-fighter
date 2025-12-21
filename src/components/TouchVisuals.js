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

    // PHASE 5.4: Static Zone Indicators
    this.createZoneIndicators();

    // Event Listeners from Controller
    this.scene.events.on("joystick-start", this.showJoystick, this);
    this.scene.events.on("joystick-move", this.updateJoystick, this);
    this.scene.events.on("joystick-end", this.hideJoystick, this);
    this.scene.events.on("touch-combat", this.showRipple, this);
  }

  createZoneIndicators() {
    const { width, height } = this.scene.scale;

    // Use Graphics for Gradients
    // Left Zone (Movement) - Blue Tint
    const leftGraphics = this.scene.add.graphics();
    if (typeof leftGraphics.fillGradientStyle === "function") {
      leftGraphics.fillGradientStyle(
        0x0000ff,
        0x0000ff,
        0x0000ff,
        0x0000ff,
        0.1,
        0.1,
        0,
        0,
      );
    } else {
      // Fallback for Canvas/Mocks
      leftGraphics.fillStyle(0x0000ff, 0.05);
    }
    leftGraphics.fillRect(0, 0, width / 2, height);
    leftGraphics.setScrollFactor(0);
    leftGraphics.setDepth(5); // Low depth, behind HUD

    // Right Zone (Combat) - Red Tint
    const rightGraphics = this.scene.add.graphics();
    if (typeof rightGraphics.fillGradientStyle === "function") {
      rightGraphics.fillGradientStyle(
        0xff0000,
        0xff0000,
        0xff0000,
        0xff0000,
        0.1,
        0.1,
        0,
        0,
      );
    } else {
      rightGraphics.fillStyle(0xff0000, 0.05);
    }
    rightGraphics.fillRect(width / 2, 0, width / 2, height);
    rightGraphics.setScrollFactor(0);
    rightGraphics.setDepth(5);

    // Simple Labels (Optional, but helpful)
    this.scene.add
      .text(width * 0.25, height - 30, "MOVE", {
        fontFamily: '"Press Start 2P"',
        fontSize: "12px",
        fill: "#aaaaff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(6)
      .setAlpha(0.3);

    this.scene.add
      .text(width * 0.75, height - 30, "ATTACK", {
        fontFamily: '"Press Start 2P"',
        fontSize: "12px",
        fill: "#ffaaaa",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(6)
      .setAlpha(0.3);
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
