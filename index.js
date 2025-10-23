const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Get the audio element
const backgroundMusic = document.getElementById('backgroundMusic');

// Play the music when the game starts
function startBackgroundMusic() {
  backgroundMusic.play();
}

// Stop the music when someone wins
function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0; // Reset to the beginning
}

// Call startBackgroundMusic when the game begins
startBackgroundMusic();


canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: 'img/background.png'
})


const player = new Fighter({
  position: {
    x: 300-200,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: 'img/hydro/Idle.png',
  framesMax: 4,
  scale: 0.5,
  offset: {
    x: 0,
    y: 10
  },
  sprites: {
    idle: {
      imageSrc: 'img/hydro/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: 'img/hydro/Run.png',
      framesMax: 5
    },

    jump: {
      imageSrc: 'img/hydro/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'img/hydro/Fall.png',
      framesMax: 1
    },
    attack1: {
      imageSrc: 'img/hydro/Attack1.png',
      framesMax: 2
    },
    takeHit: {
      imageSrc: 'img/hydro/Take Hit.png',
      framesMax: 1
    },
    death: {
      imageSrc: 'img/hydro/Death.png',
      framesMax: 1
    },
    heal: {
      imageSrc: 'img/hydro/Heal.png',
      framesMax: 3
    },
    takeFire: {
      imageSrc: 'img/hydro/TakeFire.png',
      framesMax: 1
    }
  },
  attackBox: {
    offset: {
      x: 30,
      y: 50
    },
    width: 100,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 1024-300,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: 'img/boron/Idle.png',
  framesMax: 4,
  scale: 0.5,
  offset: {
    x: 0,
    y: 0
  },
  sprites: {
    idle: {
      imageSrc: 'img/boron/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: 'img/boron/Run.png',
      framesMax: 5
    },
    jump: {
      imageSrc: 'img/boron/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'img/boron/Fall.png',
      framesMax: 1
    },
    attack1: {
      imageSrc: 'img/boron/Attack1.png',
      framesMax: 2
    },
    takeHit: {
      imageSrc: 'img/boron/Take hit.png',
      framesMax: 1
    },
    death: {
      imageSrc: 'img/boron/Death.png',
      framesMax: 1
    },
    fire: {
      imageSrc: '.img/boron/Fire.png',
      framesMax: 7
    }

  },
  attackBox: {
    offset: {
      x: -80,
      y: 50
    },
    width: 100,
    height: 50
  },
  specialMove: () => {
    enemy.switchSprite('fire')
    player.switchSprite('takeFire')
    player.takeFire(30)
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {

  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    if (player.position.x - player.velocity.x >= 0) {
    player.velocity.x = -5
    player.switchSprite('run')
    }
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if (player.position.x + player.velocity.x + player.width <= canvas.width) {
    player.velocity.x = 5
    player.switchSprite('run')
    }
  } else {
    player.velocity.x=0
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    if (player.position.y <= -20){
      player.velocity.y = 0
    } else {
      player.switchSprite('jump')
      }
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if (enemy.position.x - enemy.velocity.x >= 0) {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if (enemy.position.x + enemy.velocity.x + enemy.width <= canvas.width) {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
    }
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    if (enemy.position.y <= -20){
      enemy.velocity.y = 0
    } else {
      enemy.switchSprite('jump')
      }
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 1
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 1) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 1
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }




  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 1 || enemy.fremesCurrent ===2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case 's':
        player.attack()
        break
      case ' ':
        player.heal(20)
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()
        break
      case 'Enter': // Special move key for Boron
      enemy.takeFire(30);
        break;
    }
    }
  }
)

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})