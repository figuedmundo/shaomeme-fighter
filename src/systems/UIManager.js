import Phaser from "phaser";
import UnifiedLogger from "../utils/Logger.js";

const logger = new UnifiedLogger("Frontend:UIManager");

/**
 * UIManager - Manages all in-fight HUD elements
 * 
 * Includes:
 * - Stylized Health Bars (with ghost/damage lag)
 * - Match Timer (with urgency pulse)
 * - Character Portraits (with hit reaction)
 * - Combo Counter (with flashy pop-up)
 * - Round Indicators
 */
export default class UIManager {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.config = {
      p1Name: config.p1Name || "PLAYER 1",
      p2Name: config.p2Name || "PLAYER 2",
      p1Character: config.p1Character || "ryu",
      p2Character: config.p2Character || "ken",
      totalRounds: config.totalRounds || 3,
      matchTime: config.matchTime || 99,
      onTimeUp: config.onTimeUp || (() => {}),
      onLowTime: config.onLowTime || (() => {})
    };

    // State
    this.p1Health = 100;
    this.p2Health = 100;
    this.p1GhostHealth = 100;
    this.p2GhostHealth = 100;
    this.p1Combo = 0;
    this.p2Combo = 0;
    this.timeLeft = this.config.matchTime;
    this.isTimerRunning = false;
    this.lowTimeTriggered = false;

    // UI Objects
    this.graphics = null;
    this.timerText = null;
    this.p1NameText = null;
    this.p2NameText = null;
    this.p1Portrait = null;
    this.p2Portrait = null;
    this.p1ComboText = null;
    this.p2ComboText = null;

    this.init();
    logger.info("UIManager initialized");
  }

  init() {
    const { width, height } = this.scene.scale;
    const barWidth = 400;
    const barHeight = 25;
    const margin = 50;
    const topOffset = 40;

    // 1. Setup Graphics for Bars
    this.graphics = this.scene.add.graphics();
    this.graphics.setScrollFactor(0);
    this.graphics.setDepth(1000);

    // 2. Setup Timer
    this.timerText = this.scene.add.text(width / 2, topOffset + 10, `${this.timeLeft}`, {
      fontFamily: 'MK4',
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    // 3. Setup Player Names
    this.p1NameText = this.scene.add.text(margin + 60, topOffset - 20, this.config.p1Name, {
      fontFamily: 'MK4',
      fontSize: '24px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 2
    }).setScrollFactor(0).setDepth(1001);

    this.p2NameText = this.scene.add.text(width - margin - 60, topOffset - 20, this.config.p2Name, {
      fontFamily: 'MK4',
      fontSize: '24px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1001);

    // 4. Setup Portraits
    this.p1Portrait = this.scene.add.image(margin + 25, topOffset + 15, `${this.config.p1Character}Portrait`)
      .setDisplaySize(50, 50)
      .setScrollFactor(0)
      .setDepth(1001);
    
    // Fallback if portrait texture doesn't exist
    if (!this.scene.textures.exists(`${this.config.p1Character}Portrait`)) {
      this.p1Portrait.setTexture('placeholder');
    }

    this.p2Portrait = this.scene.add.image(width - margin - 25, topOffset + 15, `${this.config.p2Character}Portrait`)
      .setDisplaySize(50, 50)
      .setScrollFactor(0)
      .setDepth(1001)
      .setFlipX(true);

    if (!this.scene.textures.exists(`${this.config.p2Character}Portrait`)) {
      this.p2Portrait.setTexture('placeholder');
    }

    // 5. Initial Draw
    this.drawHealthBars();
  }

  /**
   * Start the match timer
   */
  startTimer() {
    this.isTimerRunning = true;
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.decrementTimer,
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Stop the match timer
   */
  stopTimer() {
    this.isTimerRunning = false;
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
  }

  decrementTimer() {
    if (!this.isTimerRunning) return;

    this.timeLeft -= 1;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.stopTimer();
      this.config.onTimeUp();
    }

    this.timerText.setText(`${this.timeLeft}`);

    // High urgency heartbeat
    if (this.timeLeft <= 10 && !this.lowTimeTriggered) {
      this.lowTimeTriggered = true;
      this.config.onLowTime();
      this.triggerTimerPulse();
    }
  }

  triggerTimerPulse() {
    this.scene.tweens.add({
      targets: this.timerText,
      scale: 1.3,
      color: '#ff0000',
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Update health for a player
   */
  updateHealth(playerNum, health) {
    if (playerNum === 1) {
      this.p1Health = Phaser.Math.Clamp(health, 0, 100);
      this.shakePortrait(1);
    } else {
      this.p2Health = Phaser.Math.Clamp(health, 0, 100);
      this.shakePortrait(2);
    }
  }

  /**
   * Update combo for a player
   */
  updateCombo(count, isPlayer1) {
    if (count < 2) {
      this.clearCombo(isPlayer1);
      return;
    }

    if (isPlayer1) {
      this.p1Combo = count;
      this.showCombo(1, count);
    } else {
      this.p2Combo = count;
      this.showCombo(2, count);
    }
  }

  showCombo(playerNum, count) {
    const { width } = this.scene.scale;
    const x = playerNum === 1 ? 150 : width - 150;
    const y = 150;
    
    let comboText = playerNum === 1 ? this.p1ComboText : this.p2ComboText;

    if (!comboText) {
      comboText = this.scene.add.text(x, y, `${count} HITS`, {
        fontFamily: 'MK4',
        fontSize: '48px',
        color: '#ff0000',
        stroke: '#ffffff',
        strokeThickness: 4
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

      if (playerNum === 1) this.p1ComboText = comboText;
      else this.p2ComboText = comboText;
    } else {
      comboText.setText(`${count} HITS`);
      comboText.setAlpha(1);
      comboText.setScale(1);
    }

    // Pop animation
    this.scene.tweens.add({
      targets: comboText,
      scale: 1.5,
      duration: 100,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    // Auto-fade timer
    if (comboText.fadeTimer) comboText.fadeTimer.remove();
    comboText.fadeTimer = this.scene.time.delayedCall(2000, () => {
      this.scene.tweens.add({
        targets: comboText,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if (playerNum === 1) this.p1Combo = 0;
          else this.p2Combo = 0;
        }
      });
    });
  }

  clearCombo(isPlayer1) {
    const comboText = isPlayer1 ? this.p1ComboText : this.p2ComboText;
    if (comboText) {
      comboText.setAlpha(0);
    }
  }

  shakePortrait(playerNum) {
    const portrait = playerNum === 1 ? this.p1Portrait : this.p2Portrait;
    if (!portrait) return;

    this.scene.tweens.add({
      targets: portrait,
      x: portrait.x + Phaser.Math.Between(-5, 5),
      y: portrait.y + Phaser.Math.Between(-5, 5),
      duration: 50,
      yoyo: true,
      repeat: 3
    });

    portrait.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => portrait.clearTint());
  }

  drawHealthBars() {
    this.graphics.clear();
    const { width } = this.scene.scale;
    const barWidth = 400;
    const barHeight = 25;
    const margin = 50;
    const topOffset = 40;

    // Background (Black)
    this.graphics.fillStyle(0x000000, 0.8);
    this.graphics.fillRect(margin + 60, topOffset, barWidth, barHeight); // P1
    this.graphics.fillRect(width - margin - 60 - barWidth, topOffset, barWidth, barHeight); // P2

    // Ghost Bar (Yellow/White - represents delayed damage)
    this.graphics.fillStyle(0xffffff, 0.6);
    // P1 Ghost
    const p1GhostW = (this.p1GhostHealth / 100) * barWidth;
    this.graphics.fillRect(margin + 60, topOffset, p1GhostW, barHeight);
    // P2 Ghost (fills from right)
    const p2GhostW = (this.p2GhostHealth / 100) * barWidth;
    this.graphics.fillRect(width - margin - 60 - p2GhostW, topOffset, p2GhostW, barHeight);

    // Current Health (Green -> Red)
    // P1
    const p1W = (this.p1Health / 100) * barWidth;
    const p1Color = this.getHealthColor(this.p1Health);
    this.graphics.fillStyle(p1Color, 1);
    this.graphics.fillRect(margin + 60, topOffset, p1W, barHeight);

    // P2
    const p2W = (this.p2Health / 100) * barWidth;
    const p2Color = this.getHealthColor(this.p2Health);
    this.graphics.fillStyle(p2Color, 1);
    this.graphics.fillRect(width - margin - 60 - p2W, topOffset, p2W, barHeight);

    // Border
    this.graphics.lineStyle(2, 0xffffff, 1);
    this.graphics.strokeRect(margin + 60, topOffset, barWidth, barHeight);
    this.graphics.strokeRect(width - margin - 60 - barWidth, topOffset, barWidth, barHeight);
  }

  getHealthColor(percent) {
    if (percent > 50) return 0x00ff00; // Green
    if (percent > 20) return 0xffff00; // Yellow
    return 0xff0000; // Red
  }

  update(time, delta) {
    // Lerp Ghost Health to Current Health
    let changed = false;
    const lerpSpeed = 0.05;

    if (this.p1GhostHealth > this.p1Health) {
      this.p1GhostHealth = Phaser.Math.Linear(this.p1GhostHealth, this.p1Health, lerpSpeed);
      if (this.p1GhostHealth - this.p1Health < 0.1) this.p1GhostHealth = this.p1Health;
      changed = true;
    }

    if (this.p2GhostHealth > this.p2Health) {
      this.p2GhostHealth = Phaser.Math.Linear(this.p2GhostHealth, this.p2Health, lerpSpeed);
      if (this.p2GhostHealth - this.p2Health < 0.1) this.p2GhostHealth = this.p2Health;
      changed = true;
    }

    if (changed) {
      this.drawHealthBars();
    }
  }

  showVictory(winnerNum) {
    const portrait = winnerNum === 1 ? this.p1Portrait : this.p2Portrait;
    if (portrait) {
      this.scene.tweens.add({
        targets: portrait,
        scale: 1.5,
        duration: 500,
        ease: 'Back.easeOut'
      });
    }
  }

  destroy() {
    this.stopTimer();
    if (this.graphics) this.graphics.destroy();
    if (this.timerText) this.timerText.destroy();
    if (this.p1NameText) this.p1NameText.destroy();
    if (this.p2NameText) this.p2NameText.destroy();
    if (this.p1Portrait) this.p1Portrait.destroy();
    if (this.p2Portrait) this.p2Portrait.destroy();
    if (this.p1ComboText) this.p1ComboText.destroy();
    if (this.p2ComboText) this.p2ComboText.destroy();
    logger.debug("UIManager destroyed");
  }
}
