import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:AudioManager");

/**
 * AudioManager - Centralized audio system for combat sounds
 * Handles variations, playback, and sound pooling
 */
export default class AudioManager {
  constructor(scene) {
    this.scene = scene;

    // Audio pools for variations
    this.impactSounds = [];
    this.whooshSounds = [];
    this.gruntSounds = [];
    this.hitReactionSounds = [];
    this.blockSounds = [];

    // Volume settings
    this.volumes = {
      impact: 0.5,
      whoosh: 0.3,
      grunt: 0.4,
      hitReaction: 0.5,
      block: 0.4,
      ko: 0.5,
      announcer: 0.8,
      music: 0.3,
    };

    // Prevent sound spam
    this.lastPlayTime = {
      impact: 0,
      whoosh: 0,
      grunt: 0,
      hitReaction: 0,
      block: 0,
      announcer: 0,
      ui: 0,
    };

    this.minTimeBetweenSounds = 100; // milliseconds
    this.currentAnnouncerSound = null; // Track current announcer audio for interruption
    this.currentMusic = null; // Track current background music

    logger.info("AudioManager initialized");
  }

  /**
   * Initialize all combat sounds
   * Call this in PreloadScene after loading audio
   */
  init() {
    // Load impact sounds (punch/kick variations)
    // Using attack1-5.mp3 as impact sounds
    for (let i = 1; i <= 5; i += 1) {
      const key = `attack${i}`;
      if (this.scene.cache.audio.exists(key)) {
        this.impactSounds.push(key);
      }
    }

    // Future: Load whoosh sounds (air-cutting)
    // this.whooshSounds = ['whoosh1', 'whoosh2', 'whoosh3'];

    // Future: Load grunt sounds (effort sounds)
    // this.gruntSounds = ['grunt1', 'grunt2', 'grunt3'];

    // Future: Load hit reaction sounds
    // this.hitReactionSounds = ['hit1', 'hit2', 'hit3'];

    // Future: Load block sounds
    // this.blockSounds = ['block1', 'block2'];

    logger.info(`Loaded ${this.impactSounds.length} impact sounds`);
    logger.info("AudioManager ready");
  }

  /**
   * Play background music
   * @param {string} key - Music asset key
   * @param {Object} config - Phaser sound config (default: loop=true)
   */
  playMusic(key, config = { loop: true }) {
    if (!this.scene.cache.audio.exists(key)) {
      logger.warn(`Music asset missing: ${key}`);
      return;
    }

    // Don't restart if already playing the same music
    if (
      this.currentMusic &&
      this.currentMusic.key === key &&
      this.currentMusic.isPlaying
    ) {
      return;
    }

    // Stop existing music
    this.stopMusic(0);

    const musicConfig = {
      volume: this.volumes.music,
      ...config,
    };

    this.currentMusic = this.scene.sound.add(key, musicConfig);
    this.currentMusic.play();
    logger.info(`Started music: ${key}`);
  }

  /**
   * Play stage-specific music with fallback
   * @param {string} city - City name
   */
  playStageMusic(city) {
    const cityKey = `music_${city.toLowerCase()}`;
    if (this.scene.cache.audio.exists(cityKey)) {
      this.playMusic(cityKey);
    } else {
      logger.debug(
        `Stage music for ${city} not found, falling back to default arena music`,
      );
      this.playMusic("arena");
    }
  }

  /**
   * Stop current music with optional fade
   * @param {number} fadeDuration - Fade out duration in ms
   */
  stopMusic(fadeDuration = 0) {
    if (!this.currentMusic) return;

    if (fadeDuration > 0 && this.currentMusic.isPlaying) {
      const music = this.currentMusic;
      this.scene.tweens.add({
        targets: music,
        volume: 0,
        duration: fadeDuration,
        onComplete: () => {
          music.stop();
          if (this.currentMusic === music) {
            this.currentMusic = null;
          }
        },
      });
    } else {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  /**
   * Set music playback rate (for low health tension)
   * @param {number} rate - Playback rate (1.0 is normal)
   */
  setMusicRate(rate) {
    if (this.currentMusic) {
      this.currentMusic.setRate(rate);
      logger.debug(`Set music rate to ${rate}`);
    }
  }

  /**
   * Play UI sound effect
   * @param {string} key - UI sound asset key
   */
  playUi(key) {
    const now = Date.now();
    // Anti-spam for UI sounds (e.g. during fast rolls)
    if (now - this.lastPlayTime.ui < 50) {
      return;
    }

    if (!this.scene.cache.audio.exists(key)) {
      logger.warn(`UI sound asset missing: ${key}`);
      return;
    }
    this.scene.sound.play(key, { volume: this.volumes.music * 1.5 }); // UI sounds usually bit louder than bg music
    this.lastPlayTime.ui = now;
  }

  /**
   * Play a random variation from a sound pool
   * @param {string} type - Sound type (impact, whoosh, grunt, etc.)
   * @param {number} volume - Override default volume (0-1)
   */
  playRandomVariation(type, volume = null) {
    const now = Date.now();

    // Prevent sound spam
    if (now - this.lastPlayTime[type] < this.minTimeBetweenSounds) {
      return;
    }

    let soundPool;
    let defaultVolume;

    switch (type) {
      case "impact":
        soundPool = this.impactSounds;
        defaultVolume = this.volumes.impact;
        break;
      case "whoosh":
        soundPool = this.whooshSounds;
        defaultVolume = this.volumes.whoosh;
        break;
      case "grunt":
        soundPool = this.gruntSounds;
        defaultVolume = this.volumes.grunt;
        break;
      case "hitReaction":
        soundPool = this.hitReactionSounds;
        defaultVolume = this.volumes.hitReaction;
        break;
      case "block":
        soundPool = this.blockSounds;
        defaultVolume = this.volumes.block;
        break;
      default:
        logger.warn(`Unknown sound type: ${type}`);
        return;
    }

    if (!soundPool || soundPool.length === 0) {
      logger.verbose(`No sounds available for type: ${type}`);
      return;
    }

    // Pick random sound from pool
    const randomIndex = Phaser.Math.Between(0, soundPool.length - 1);
    const soundKey = soundPool[randomIndex];

    // Play with volume
    const finalVolume = volume !== null ? volume : defaultVolume;
    this.scene.sound.play(soundKey, { volume: finalVolume });

    this.lastPlayTime[type] = now;
    logger.verbose(`Played ${type}: ${soundKey} at volume ${finalVolume}`);
  }

  /**
   * Play impact sound on hit
   * @param {boolean} isHeavy - Is this a heavy hit?
   */
  playImpact(isHeavy = false) {
    const volume = isHeavy ? this.volumes.impact * 1.2 : this.volumes.impact;
    this.playRandomVariation("impact", volume);
  }

  /**
   * Play whoosh sound on attack start
   */
  playWhoosh() {
    this.playRandomVariation("whoosh");
  }

  /**
   * Play grunt sound when character attacks
   */
  playGrunt() {
    this.playRandomVariation("grunt");
  }

  /**
   * Play hit reaction sound when character takes damage
   */
  playHitReaction() {
    this.playRandomVariation("hitReaction");
  }

  /**
   * Play block sound
   */
  playBlock() {
    if (this.blockSounds && this.blockSounds.length > 0) {
      this.playRandomVariation("block");
    } else {
      // Fallback: Play impact sound with lower volume and pitch
      // Note: Phaser Sound Manager allows detune/rate
      // Here we just use playRandomVariation("impact") with lower volume for simplicity
      // Ideally we would play a specific muted sound
      this.playRandomVariation("impact", this.volumes.impact * 0.5);
    }
  }

  /**
   * Play KO sound
   */
  playKO() {
    // Use playAnnouncer for consistency and priority logic
    // Key 'KO' is loaded in PreloadScene
    this.playAnnouncer("KO");
  }

  /**
   * Play announcer voice line
   * @param {string} key - Audio key (e.g., 'round_1', 'fight', 'ko')
   */
  playAnnouncer(key) {
    if (!this.scene.cache.audio.exists(key)) {
      logger.warn(`Announcer audio missing: ${key}`);
      return;
    }

    // Priority Logic: KO interrupts everything
    if (key === "ko" || key === "you_win" || key === "you_lose") {
      if (this.currentAnnouncerSound && this.currentAnnouncerSound.isPlaying) {
        this.currentAnnouncerSound.stop();
      }
    }

    // prevent overlap of same sound
    if (
      this.currentAnnouncerSound &&
      this.currentAnnouncerSound.isPlaying &&
      this.currentAnnouncerSound.key === key
    ) {
      return;
    }

    this.currentAnnouncerSound = this.scene.sound.add(key, {
      volume: this.volumes.announcer,
    });
    this.currentAnnouncerSound.play();
    logger.info(`Played announcer: ${key}`);
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    this.scene.sound.stopAll();
  }

  /**
   * Set master volume for a sound type
   * @param {string} type - Sound type
   * @param {number} volume - Volume (0-1)
   */
  setVolume(type, volume) {
    if (Object.prototype.hasOwnProperty.call(this.volumes, type)) {
      this.volumes[type] = Phaser.Math.Clamp(volume, 0, 1);
      logger.info(`Set ${type} volume to ${this.volumes[type]}`);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.impactSounds = [];
    this.whooshSounds = [];
    this.gruntSounds = [];
    this.hitReactionSounds = [];
    this.blockSounds = [];
    logger.info("AudioManager destroyed");
  }
}
