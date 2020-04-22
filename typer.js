/* global canvas ctx animation gameLoop label loop paintCircle isIntersectingRectangleWithRectangle generateRandomNumber generateRandomInteger paintParticles createParticles processParticles */
let score = 0;
let lives = 10;
let caseSensitive = true;
let pause = false;
const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: '#2196F3',
  border: 'solid 10px red'
};

const letter = {
  font: '40px Red Hat Text',
  color: '#090121',
  size: 30,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02
};

let letters = [];

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);
document.getElementById('change-case-text').innerHTML = 'Sensible';
document.getElementById('livesText').innerHTML = lives + ((lives > 1 || lives === 0) ? ' vies' : ' vie');
document.getElementById('scoreText').innerHTML = score;

loop(function (frames) {
  if (pause) {
  } else {
    paintCircle(center.x, center.y, center.radius, center.color);
    // console.log('ctx', ctx)
    ctx.font = letter.font;
    ctx.fillStyle = letter.color;
    for (const l of letters) {
      ctx.fillText(String.fromCharCode(l.code), l.x, l.y);
    }
    paintParticles();
    ctx.font = '30px Paytone One';
    ctx.fillStyle = '#090121';
    ctx.margin = '30px'
    ctx.fillText('Pointage: ' + score, label.left, label.margin);
    ctx.fillText('Vies: ' + lives, label.right, label.margin);
    processParticles(frames);
    createLetters();
    removeLetters(frames);
  }
});
function createLetters () {
  if (Math.random() < letter.probability) {
    const x = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const norm = Math.sqrt(dX ** 2 + dY ** 2);
    const speed = generateRandomNumber(letter.lowestSpeed, letter.highestSpeed);
    letters.push({
      x,
      y,
      code: Math.random() < 0.5 ? generateRandomInteger(25) + 65 : generateRandomInteger(25) + 97,
      speedX: dX / norm * speed,
      speedY: dY / norm * speed
    });
  }
}

function removeLetters (frames) {
  for (const l of letters) {
    if (isIntersectingRectangleWithRectangle(l, letter.size, letter.size, center, center.radius, center.radius)) {
      pause = true
      if (--lives === 0) {
        document.getElementById('modal-button').click();
        // window.alert('Partie terminée');
        // window.location.reload(false);
      } else if (lives > 0) {
        document.getElementById('modal-button').click();
        // window.alert('Continuer');
        letters = [];
      }
      document.getElementById('livesText').innerHTML = lives + ((lives > 1 || lives === 0) ? ' vies' : ' vie');
      document.getElementById('scoreText').innerHTML = score;

    } else {
      l.x += l.speedX * frames;
      l.y += l.speedY * frames;
    }
  }
}
function continueGame () {
  document.getElementById('modal-button-close').click();
  // if (--lives === 0) {
  //   // window.alert('Partie terminée');
  //   document.getElementById('modal-button-close').click();
  //   // window.location.reload(false);
  // } else if (lives > 0) {
  //   // window.alert('Continuer');
  //   document.getElementById('modal-button-close').click();
  //   letters = [];
  // }
  pause = false
}

function type (i, l) {
  letters.splice(i, 1);
  score++;
  createParticles(l.x, l.y);
}

window.changeCase = function () {
  caseSensitive = !caseSensitive;
  if (caseSensitive) {
    document.getElementById('change-case-text').innerHTML = 'Sensible';
  } else {
    document.getElementById('change-case-text').innerHTML = 'Non-sensible';
  }
};

function keyDownHandler (e) {
  if (animation !== undefined && e.keyCode >= 65 && e.keyCode <= 90) {
    for (let i = letters.length - 1; i >= 0; i--) {
      const l = letters[i];
      if (caseSensitive) {
        if (e.shiftKey) {
          if (e.keyCode === l.code) {
            type(i, l);
            return;
          }
        } else {
          if (e.keyCode + 32 === l.code) {
            type(i, l);
            return;
          }
        }
      } else {
        if (e.keyCode === l.code || e.keyCode + 32 === l.code) {
          type(i, l);
          return;
        }
      }
    }
    // let classesToAdd = [ 'animated', 'shake', 'faster' ];
    document.getElementById('canvas').classList.add('shake');
    score--;
    setTimeout(() => {
      document.getElementById('canvas').classList.remove('shake');
    }, 1000)
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 27) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}
