import Phaser from './lib/phaser.js'
import Race from './scenes/Race.js'
import GameOver from './scenes/GameOver.js'

const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 740,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		},
		debug: true
	},
	scene: [Race, GameOver]
}

export default new Phaser.Game(config)