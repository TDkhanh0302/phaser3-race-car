import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over')
  }

  create() {
    const width = this.scale.width
    const height = this.scale.height

    this.add.text(width * 0.5, height * 0.5, 'Game Over', {fontSize: 48}).setOrigin(0.5)
    this.add.text(width * 0.5, height * 0.6, 'Press SPACEBAR to continue the game', {fontSize: 20}).setOrigin(0.5)
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('race-scene')
    })
  }
}