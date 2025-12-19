import Phaser from "phaser";
import ParallaxBackground from "../components/ParallaxBackground";
import AnimatedBackgroundManager from "../components/AnimatedBackgroundManager";
import DynamicLightingSystem, { LIGHTING_PRESETS } from "../systems/DynamicLightingSystem";
import WeatherSystem, { WEATHER_PRESETS } from "../systems/WeatherSystem";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:StageEffectsTestScene");

/**
 * StageEffectsTestScene - Interactive demo for testing all Phase 3.1 effects
 * 
 * Controls:
 * - 1-5: Switch weather effects
 * - Q/W/E: Change lighting presets
 * - A/S: Toggle parallax
 * - D: Toggle animations
 * - F: Flash effect
 * - Space: Lightning strike
 */
export default class StageEffectsTestScene extends Phaser.Scene {
  constructor() {
    super("StageEffectsTestScene");
  }

  create() {
    logger.info("StageEffectsTestScene: Starting...");
    const { width, height } = this.scale;

    // Create simple background
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x334455);

    // Add test fighter sprites (simple circles if no assets)
    this.fighter1 = this.add.circle(width * 0.3, height - 150, 30, 0xff0000);
    this.fighter2 = this.add.circle(width * 0.7, height - 150, 30, 0x0000ff);

    // Initialize all systems
    this.initializeSystems();

    // Create control UI
    this.createUI();

    // Setup keyboard controls
    this.setupControls();

    // Add instructions
    this.createInstructions();

    logger.info("StageEffectsTestScene: Ready!");
  }

  initializeSystems() {
    // Parallax Background
    this.parallaxBg = new ParallaxBackground(this, {
      layers: [
        { 
          key: null, // Will use colored rectangles for demo
          scrollFactor: 0, 
          alpha: 1 
        }
      ],
      baseDepth: -100
    });
    
    // Create demo parallax layers manually
    this.createDemoParallaxLayers();

    // Animated Background
    this.bgAnimations = new AnimatedBackgroundManager(this);
    this.bgAnimations.addClouds({ count: 3, speed: 15 });
    this.bgAnimations.addFloatingParticles({ type: 'dust', count: 20 });

    // Dynamic Lighting
    this.lighting = new DynamicLightingSystem(this);
    this.lighting.setAmbientLight(1.0);

    // Weather System
    this.weather = new WeatherSystem(this);

    // State tracking
    this.currentWeather = 'none';
    this.currentLighting = 'day';
    this.parallaxEnabled = true;
    this.animationsEnabled = true;

    logger.debug("All systems initialized");
  }

  createDemoParallaxLayers() {
    const { width, height } = this.scale;

    // Create colored layers to demonstrate parallax
    const layers = [
      { y: 0, height: height * 0.3, color: 0x87ceeb, scroll: 0 },    // Sky
      { y: height * 0.3, height: height * 0.2, color: 0x668899, scroll: 0.2 }, // Far
      { y: height * 0.5, height: height * 0.2, color: 0x556677, scroll: 0.5 }, // Mid
      { y: height * 0.7, height: height * 0.3, color: 0x445566, scroll: 0.8 }  // Near
    ];

    layers.forEach((layer, index) => {
      const rect = this.add.rectangle(
        width / 2, 
        layer.y + layer.height / 2,
        width,
        layer.height,
        layer.color
      );
      rect.setScrollFactor(layer.scroll);
      rect.setDepth(-100 + index);
    });
  }

  createUI() {
    const { width, height } = this.scale;

    // Status panel
    this.statusText = this.add.text(10, 10, '', {
      fontSize: '14px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setDepth(2000);

    this.updateStatusText();

    // FPS counter
    this.fpsText = this.add.text(width - 10, 10, 'FPS: 60', {
      fontSize: '14px',
      fill: '#0f0',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0).setDepth(2000);
  }

  createInstructions() {
    const { width, height } = this.scale;

    const instructions = [
      'STAGE EFFECTS TEST SCENE',
      '',
      'WEATHER:',
      '1 = Clear',
      '2 = Rain',
      '3 = Snow', 
      '4 = Fog',
      '5 = Storm',
      '',
      'LIGHTING:',
      'Q = Day',
      'W = Night',
      'E = Spotlight',
      'R = Dramatic',
      'F = Flash Effect',
      '',
      'EFFECTS:',
      'A = Toggle Parallax',
      'S = Toggle Animations',
      'Space = Lightning',
      '',
      'CAMERA:',
      'Arrow Keys = Move Camera'
    ];

    this.add.text(width - 10, height - 10, instructions.join('\n'), {
      fontSize: '12px',
      fill: '#fff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 10, y: 5 },
      align: 'left'
    }).setOrigin(1, 1).setDepth(2000);
  }

  setupControls() {
    // Weather controls
    this.input.keyboard.on('keydown-ONE', () => this.setWeather('none'));
    this.input.keyboard.on('keydown-TWO', () => this.setWeather('rain'));
    this.input.keyboard.on('keydown-THREE', () => this.setWeather('snow'));
    this.input.keyboard.on('keydown-FOUR', () => this.setWeather('fog'));
    this.input.keyboard.on('keydown-FIVE', () => this.setWeather('storm'));

    // Lighting controls
    this.input.keyboard.on('keydown-Q', () => this.setLighting('day'));
    this.input.keyboard.on('keydown-W', () => this.setLighting('night'));
    this.input.keyboard.on('keydown-E', () => this.setLighting('spotlight'));
    this.input.keyboard.on('keydown-R', () => this.setLighting('dramatic'));
    this.input.keyboard.on('keydown-F', () => this.triggerFlash());

    // Toggle controls
    this.input.keyboard.on('keydown-A', () => this.toggleParallax());
    this.input.keyboard.on('keydown-S', () => this.toggleAnimations());

    // Special effects
    this.input.keyboard.on('keydown-SPACE', () => this.triggerLightning());

    // Camera controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setWeather(type) {
    this.currentWeather = type;
    
    switch(type) {
      case 'none':
        this.weather.clearWeather();
        break;
      case 'rain':
        this.weather.setWeather('rain', { intensity: 'medium' });
        break;
      case 'snow':
        this.weather.setWeather('snow', { intensity: 'medium' });
        break;
      case 'fog':
        this.weather.setWeather('fog', { density: 0.6 });
        break;
      case 'storm':
        this.weather.setWeather('storm');
        break;
    }

    this.updateStatusText();
    logger.info(`Weather changed to: ${type}`);
  }

  setLighting(preset) {
    this.currentLighting = preset;

    switch(preset) {
      case 'day':
        this.lighting.setAmbientLight(1.0, 500);
        break;
      case 'night':
        this.lighting.setAmbientLight(0.4, 500);
        break;
      case 'spotlight':
        this.lighting.setAmbientLight(0.3, 500);
        // Add spotlights on fighters
        this.lighting.addSpotlight(this.fighter1, { 
          radius: 150, 
          intensity: 1.5 
        });
        this.lighting.addSpotlight(this.fighter2, { 
          radius: 150, 
          intensity: 1.5 
        });
        break;
      case 'dramatic':
        this.lighting.setDramaticLighting('ultimateMove');
        break;
    }

    this.updateStatusText();
    logger.info(`Lighting changed to: ${preset}`);
  }

  triggerFlash() {
    const colors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
    const color = Phaser.Utils.Array.GetRandom(colors);
    this.lighting.flash(color, 150, 0.8);
    logger.info('Flash triggered');
  }

  triggerLightning() {
    if (this.weather) {
      this.weather.triggerLightning();
      logger.info('Lightning triggered');
    }
  }

  toggleParallax() {
    this.parallaxEnabled = !this.parallaxEnabled;
    
    // Toggle scroll factors on layers
    this.children.list.forEach(child => {
      if (child.scrollFactorX !== undefined && child.scrollFactorX < 1) {
        child.setScrollFactor(this.parallaxEnabled ? child.scrollFactorX : 1);
      }
    });

    this.updateStatusText();
    logger.info(`Parallax: ${this.parallaxEnabled ? 'ON' : 'OFF'}`);
  }

  toggleAnimations() {
    this.animationsEnabled = !this.animationsEnabled;
    
    if (!this.animationsEnabled) {
      this.bgAnimations.destroy();
      this.bgAnimations = null;
    } else {
      this.bgAnimations = new AnimatedBackgroundManager(this);
      this.bgAnimations.addClouds({ count: 3, speed: 15 });
      this.bgAnimations.addFloatingParticles({ type: 'dust', count: 20 });
    }

    this.updateStatusText();
    logger.info(`Animations: ${this.animationsEnabled ? 'ON' : 'OFF'}`);
  }

  updateStatusText() {
    const status = [
      `Weather: ${this.currentWeather.toUpperCase()}`,
      `Lighting: ${this.currentLighting.toUpperCase()}`,
      `Parallax: ${this.parallaxEnabled ? 'ON' : 'OFF'}`,
      `Animations: ${this.animationsEnabled ? 'ON' : 'OFF'}`
    ];

    this.statusText.setText(status.join('\n'));
  }

  update(time, delta) {
    // Update FPS
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);

    // Update systems
    if (this.parallaxBg) {
      this.parallaxBg.update(time, delta);
    }

    if (this.lighting) {
      this.lighting.update();
    }

    if (this.weather) {
      this.weather.update();
    }

    // Camera controls
    const cam = this.cameras.main;
    const speed = 5;

    if (this.cursors.left.isDown) {
      cam.scrollX -= speed;
    } else if (this.cursors.right.isDown) {
      cam.scrollX += speed;
    }

    if (this.cursors.up.isDown) {
      cam.scrollY -= speed;
    } else if (this.cursors.down.isDown) {
      cam.scrollY += speed;
    }

    // Animate test fighters
    this.fighter1.y = (this.scale.height - 150) + Math.sin(time * 0.002) * 20;
    this.fighter2.y = (this.scale.height - 150) + Math.cos(time * 0.002) * 20;
  }

  shutdown() {
    if (this.parallaxBg) {
      this.parallaxBg.destroy();
    }

    if (this.bgAnimations) {
      this.bgAnimations.destroy();
    }

    if (this.lighting) {
      this.lighting.destroy();
    }

    if (this.weather) {
      this.weather.destroy();
    }

    logger.info("StageEffectsTestScene: Cleaned up");
  }
}

/**
 * To use this test scene, add it to your game config:
 * 
 * const config = {
 *   scene: [
 *     BootScene,
 *     PreloadScene,
 *     StageEffectsTestScene,  // Add this
 *     MainMenuScene,
 *     // ... other scenes
 *   ]
 * };
 * 
 * Then in BootScene, start it directly:
 * this.scene.start('StageEffectsTestScene');
 */