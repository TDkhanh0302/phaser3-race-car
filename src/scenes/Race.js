import Phaser from '../lib/phaser.js'

const PLAYER_KEY = 'player'
const ENEMY_KEY = 'enemycar'
const STAR_KEY = 'star'

export default class Race extends Phaser.Scene {
  starsCollected = 0

  constructor() {
    super('race-scene')
    this.player = undefined
    this.cursors = undefined
    this.enemys = undefined
    this.stars = undefined
    this.starsCollectedText = undefined
  }

  preload() {
    this.load.image('road', 'assets/road.png')
    this.load.image(PLAYER_KEY, 'assets/player.png')
    this.load.image(ENEMY_KEY, 'assets/enemycar.png')
    this.load.image(STAR_KEY, 'assets/star.png')
  }

  create() {
    this.add.image(240, 370, 'road').setScrollFactor(1, 0)

    this.enemys = this.createEnemy()
    this.player = this.createPlayer()
    this.stars = this.physics.add.group()
    this.stars.get(100, 320, STAR_KEY)

    this.physics.add.collider(this.enemys, this.stars)
    this.physics.add.collider(this.player, this.enemys)
    this.physics.world.setBounds(0, 0, 480, 740)
    this.physics.world.setBoundsCollision(true, true, false, false)
    
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    setTimeout(() => {
      this.physics.add.overlap(this.player, this.enemys, this.checkCollisions, null, this)
    }, 3000)
    this.cursors = this.input.keyboard.createCursorKeys()

    const style = { color: '#fff', fontSize: 24 }
    this.starsCollectedText = this.add.text(240, 10, 'Stars: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
  }

  collectStar(player, star)
	{
      this.stars.killAndHide(star)
      this.physics.world.disableBody(star.body)
      this.starsCollected += 10

      const value = `Stars: ${this.starsCollected}`
      this.starsCollectedText.text = value
	}

  checkCollisions() {
    this.starsCollected = 0
    this.scene.start('game-over')
  }

  update() {
    const cam  = this.cameras.main
    const speed = 7
    cam.scrollY -= speed
    this.player.setY(cam.scrollY + 650)
    
    const positionX = this.player.x
    // console.log('position X',positionX)
    if (this.cursors.left.isDown) {
			// this.player.setX(positionX - 60)
      this.player.setVelocityX(-500)
		} else if (this.cursors.right.isDown) {
			// this.player.setX(positionX + 60)
      this.player.setVelocityX(500)
		} else {
      this.player.setVelocity(0, 0)
    }

    this.enemys.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const enemy = child
      const scrollY = cam.scrollY
      if (enemy.y >= scrollY + 950) {
        enemy.y = scrollY
        enemy.body.updateFromGameObject()
        this.addStars(enemy)
      }
    })
  }

  createEnemy() {
    const enemys = this.physics.add.staticGroup()
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.RND.pick([67, 186, 306, 423])
      const y = 370 * i
      enemys.create(x, y, ENEMY_KEY)
    }
    return enemys
  }

  createPlayer() {
    const player = this.physics.add.image(240, 700, PLAYER_KEY)
    player.setCollideWorldBounds(true)
    return player
  }

  addStars(sprite) {
    const x = Phaser.Math.Between(50, 430)
    const y = sprite.y - Phaser.Math.Between(50, 100)
    const star = this.stars.get(x, y, STAR_KEY)

    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    star.setActive(true)
    star.setVisible(true)
    this.add.existing(star)
    this.physics.world.enable(star)

		return star
	}
}