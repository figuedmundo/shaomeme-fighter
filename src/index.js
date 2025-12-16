import Phaser from 'phaser';
import gameConfig from './config/gameConfig';
import './styles/styles.css';

// Initialize the game
const game = new Phaser.Game(gameConfig);

// For debug access
window.game = game;
