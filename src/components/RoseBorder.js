import Phaser from "phaser";

/**
 * Procedural Rose Border Animation (Enhanced - Hybrid Petal System)
 * Creates interlacing vines and roses with hybrid petal rendering (Arcs for center, Curves for outer).
 */
export default class RoseBorder {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(5);

    this.vines = [];
    this.isActive = false;
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;

    // Start growth
    this.spawnVine("left", 0, 0);
    this.scene.time.delayedCall(1500, () => this.spawnVine("left", 1, 0));

    this.spawnVine("right", 0, 0);
    this.scene.time.delayedCall(1500, () => this.spawnVine("right", 1, 0));
  }

  stop() {
    this.isActive = false;
    this.vines.forEach((v) => {
      if (v.tween) v.tween.stop();
      v.roses.forEach((r) => {
        if (r.bloomTween) r.bloomTween.stop();
      });
      v.graphics.destroy();
    });
    this.vines = [];
  }

  destroy() {
    this.stop();
    this.container.destroy();
  }

  spawnVine(side, offsetIndex, delay = 0) {
    if (!this.isActive) return;

    const graphics = this.scene.add.graphics();
    this.container.add(graphics);

    const vine = {
      graphics,
      side,
      progress: 0,
      roses: [],
      leaves: [],
      points: this.generatePath(side, offsetIndex),
      alpha: 1,
      width: 4 + Math.random() * 2,
      nextRoseDistance: 0.05,
    };

    this.generateLeaves(vine);
    this.vines.push(vine);

    // Continuous Growth Tween
    vine.tween = this.scene.tweens.add({
      targets: vine,
      progress: 1,
      duration: 16000,
      delay,
      ease: "Quad.easeOut",
      onUpdate: () => {
        this.checkRoseSpawn(vine);
        this.drawVine(vine);
      },
      onComplete: () => {
        this.scene.time.delayedCall(4000, () => {
          if (!this.isActive) return;
          this.scene.tweens.add({
            targets: vine,
            alpha: 0,
            duration: 2000,
            onUpdate: () => graphics.setAlpha(vine.alpha),
            onComplete: () => {
              graphics.destroy();
              this.vines = this.vines.filter((v) => v !== vine);
              if (this.isActive) this.spawnVine(side, offsetIndex);
            },
          });
        });
      },
    });
  }

  generatePath(side, offsetIndex) {
    const { width, height } = this.scene.scale;
    const isLeft = side === "left";
    const baseX = isLeft ? 40 : width - 40;
    const curveDir = isLeft ? 1 : -1;

    // Start at bottom
    const points = [{ x: baseX + offsetIndex * 30 * curveDir, y: height + 50 }];

    // Randomize wave parameters for organic growth
    const frequency = 3 + Math.random() * 3; // Random frequency
    const amplitude = 15 + Math.random() * 25; // Random width of the wave
    const phase = Math.random() * Math.PI * 2; // Random starting point of the wave

    const segments = 25;
    for (let i = 1; i <= segments; i += 1) {
      const t = i / segments;
      const y = height + 50 - t * (height + 100);

      // Apply randomized wave
      const wave = Math.sin(t * Math.PI * frequency + phase) * amplitude;

      // Add a slight "wander" to the base X so it's not perfectly straight up
      const wander = (Math.random() - 0.5) * 10 * t;

      const x = baseX + offsetIndex * 30 * curveDir + wave + wander;

      points.push({ x, y });
    }
    return points;
  }

  generateLeaves(vine) {
    const curve = new Phaser.Curves.Spline(vine.points);
    for (let t = 0.02; t < 0.98; t += 0.05) {
      if (Math.random() > 0.3) {
        const pos = curve.getPoint(t);
        const tangent = curve.getTangent(t);
        const angle =
          tangent.angle() +
          (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1) +
          (Math.random() - 0.5);
        vine.leaves.push({
          t,
          x: pos.x,
          y: pos.y,
          angle,
          scale: 0,
          maxSize: 12 + Math.random() * 8,
        });
      }
    }
  }

  checkRoseSpawn(vine) {
    if (vine.progress > vine.nextRoseDistance && vine.progress < 0.98) {
      this.spawnHybridRose(vine, vine.progress);
      const v = vine;
      v.nextRoseDistance = vine.progress + 0.08 + Math.random() * 0.08;
    }
  }

  spawnHybridRose(vine, p) {
    const curve = new Phaser.Curves.Spline(vine.points);
    const pos = curve.getPoint(p);

    const rose = {
      x: pos.x + (Math.random() - 0.5) * 25,
      y: pos.y + (Math.random() - 0.5) * 25,
      p,
      rotation: Math.random() * Math.PI * 2,
      scale: 0,
      petals: [],
    };

    const numPetals = 20; // Increased for lushness
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numPetals; i += 1) {
      const r = 2 + Math.sqrt(i) * 5; // Slightly wider spread
      const theta = i * goldenAngle;

      // Smoother Color Gradient
      // Interpolate between 0x2a0000 (dark) and 0xff0000 (bright)
      // 0x2a = 42, 0xff = 255. Diff = 213.
      const brightness = Math.min(1, i / (numPetals - 2));
      const redComponent = Math.floor(42 + brightness * 213);
      const color = redComponent * 65536;

      const type = i < 6 ? "arc" : "cup";

      rose.petals.push({
        type,
        rOffset: r,
        thetaOffset: theta,
        width: 6 + i * 1.8,
        height: 5 + i * 1.2,
        color,
        bloom: 0,
        skew: (Math.random() - 0.5) * 0.3, // Asymmetry factor
      });
    }

    vine.roses.push(rose);

    this.scene.tweens.add({
      targets: rose,
      scale: 0.6 + Math.random() * 0.4,
      duration: 1500,
      ease: "Back.easeOut",
    });

    rose.petals.forEach((petal, idx) => {
      this.scene.tweens.add({
        targets: petal,
        bloom: 1,
        duration: 1200,
        delay: idx * 40,
        ease: "Sine.easeOut",
      });
    });
  }

  drawVine(vine) {
    const g = vine.graphics;
    g.clear();

    // Draw Stem
    g.lineStyle(vine.width, 0x0f3d2e, vine.alpha);
    const curve = new Phaser.Curves.Spline(vine.points);
    const points = curve.getPoints(200);
    const limit = Math.floor(points.length * vine.progress);

    if (limit > 1) {
      g.beginPath();
      g.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < limit; i += 1) {
        g.lineTo(points[i].x, points[i].y);
      }
      g.strokePath();
    }

    // Draw Leaves
    g.fillStyle(0x1b4d3e, vine.alpha);
    vine.leaves.forEach((leaf) => {
      if (leaf.t < vine.progress) {
        const age = (vine.progress - leaf.t) * 8;
        const currentScale = Math.min(1, age);
        const size = leaf.maxSize * currentScale;

        if (size > 0.5) {
          const lx = leaf.x + Math.cos(leaf.angle) * size;
          const ly = leaf.y + Math.sin(leaf.angle) * size;

          g.beginPath();
          g.moveTo(leaf.x, leaf.y);
          g.lineTo(lx + size * 0.3, ly - size * 0.3);
          g.lineTo(lx + size, ly);
          g.lineTo(lx + size * 0.3, ly + size * 0.3);
          g.closePath();
          g.fill();
        }
      }
    });

    // Draw Roses
    vine.roses.forEach((rose) => {
      this.drawHybridRose(g, rose, vine.alpha);
    });
  }

  // Helper to rotate point around origin
  rotatePoint(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    };
  }

  drawHybridRose(g, rose, alpha) {
    if (rose.scale <= 0.01) return;

    // Draw a dark background circle for depth
    g.fillStyle(0x1a0000, alpha);
    g.fillCircle(rose.x, rose.y, 6 * rose.scale);

    rose.petals.forEach((petal) => {
      if (petal.bloom <= 0.01) return;

      // Position
      const currentR = petal.rOffset * petal.bloom * rose.scale;
      const currentTheta = petal.thetaOffset + rose.rotation;
      const px = rose.x + Math.cos(currentTheta) * currentR;
      const py = rose.y + Math.sin(currentTheta) * currentR;

      const w = petal.width * petal.bloom * rose.scale;
      const h = petal.height * petal.bloom * rose.scale;
      const angle = currentTheta + Math.PI / 2;

      g.fillStyle(petal.color, alpha);

      if (petal.type === "arc") {
        // Draw filled ellipses for tighter, rounder center petals
        // Using Phaser's fillEllipse (x, y, width, height) - but we need rotation.
        // Since graphics.fillEllipse doesn't support rotation directly, we simulate it or use points.
        // Actually, for "tight bud", circles are fine, but let's use the rotatePoint helper to draw a rotated ellipse approximation (diamond was too sharp).
        // Let's use a 8-point polygon for a smoother ellipse.

        g.beginPath();
        const steps = 8;
        for (let i = 0; i <= steps; i += 1) {
          const t = (i / steps) * Math.PI * 2;
          const ex = (Math.cos(t) * w) / 2;
          const ey = (Math.sin(t) * h) / 2;
          const p = this.rotatePoint(ex, ey, angle);
          if (i === 0) g.moveTo(px + p.x, py + p.y);
          else g.lineTo(px + p.x, py + p.y);
        }
        g.closePath();
        g.fill();
      } else {
        // Outer Petal: "Cup" Method using 3 Quadratic Bézier Curves
        // 1. Base -> Top Left
        // 2. Top Left -> Top Right (with dip)
        // 3. Top Right -> Base

        const skew = petal.skew * w; // Apply skew to width

        // Anchor Points relative to center (unrotated)
        // Base is at bottom (0, h/2)
        const pBase = { x: 0, y: h * 0.4 };
        const pTopLeft = { x: -w * 0.6 + skew, y: -h * 0.6 };
        const pTopRight = { x: w * 0.6 + skew, y: -h * 0.6 };

        // Control Points
        // Push sides out for wide cup
        const cLeft = { x: -w * 0.9 + skew, y: h * 0.1 };
        const cRight = { x: w * 0.9 + skew, y: h * 0.1 };

        // Dip in the middle top (Heart shape)
        const cTop = { x: 0 + skew, y: -h * 0.3 };

        // Rotate all points
        const rBase = this.rotatePoint(pBase.x, pBase.y, angle);
        const rTopLeft = this.rotatePoint(pTopLeft.x, pTopLeft.y, angle);
        const rTopRight = this.rotatePoint(pTopRight.x, pTopRight.y, angle);
        const rcLeft = this.rotatePoint(cLeft.x, cLeft.y, angle);
        const rcRight = this.rotatePoint(cRight.x, cRight.y, angle);
        const rcTop = this.rotatePoint(cTop.x, cTop.y, angle);

        // Convert to absolute world coordinates vectors
        const vBase = new Phaser.Math.Vector2(px + rBase.x, py + rBase.y);
        const vTopLeft = new Phaser.Math.Vector2(
          px + rTopLeft.x,
          py + rTopLeft.y,
        );
        const vTopRight = new Phaser.Math.Vector2(
          px + rTopRight.x,
          py + rTopRight.y,
        );
        const vcLeft = new Phaser.Math.Vector2(px + rcLeft.x, py + rcLeft.y);
        const vcRight = new Phaser.Math.Vector2(px + rcRight.x, py + rcRight.y);
        const vcTop = new Phaser.Math.Vector2(px + rcTop.x, py + rcTop.y);

        // Generate Curves
        const curveLeft = new Phaser.Curves.QuadraticBezier(
          vBase,
          vcLeft,
          vTopLeft,
        );
        const curveTop = new Phaser.Curves.QuadraticBezier(
          vTopLeft,
          vcTop,
          vTopRight,
        );
        const curveRight = new Phaser.Curves.QuadraticBezier(
          vTopRight,
          vcRight,
          vBase,
        );

        const points = [
          ...curveLeft.getPoints(6),
          ...curveTop.getPoints(6),
          ...curveRight.getPoints(6),
        ];

        g.beginPath();
        if (points.length > 0) {
          g.moveTo(points[0].x, points[0].y);
          points.forEach((p) => g.lineTo(p.x, p.y));
        }
        g.closePath();
        g.fill();
      }
    });
  }
}
