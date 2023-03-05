// Define game variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bird = new Image();
var bg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var gap = 85;
var constant;
var bX = 10;
var bY = 150;
var gravity = 1.5;
var score = 0;
var isPlaying = false;

// Load images
bird.src = "images/bird.png";
bg.src = "images/background.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// Load sound effects
var dieSound = new Audio();
dieSound.src = "sounds/die.mp3";

// Handle user input
document.addEventListener("keydown", moveUp);
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", restartGame);

function moveUp() {
  bY -= 25;
}

function startGame() {
  isPlaying = true;
  document.getElementById("menu").style.display = "none";
}

function restartGame() {
  location.reload(); // Reload page to restart game
}

// Define pipe positions and randomize gap location
var pipe = [];
pipe[0] = {
  x: canvas.width,
  y: 0
};

function draw() {
  // Draw background and bird images
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(bird, bX, bY);

  // Move pipes and draw them on canvas
  for (var i = 0; i < pipe.length; i++) {
    constant = pipeNorth.height + gap;
    ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
    pipe[i].x--;

    // Create new pipe when previous pipe reaches certain position
    if (pipe[i].x == 125) {
      pipe.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
      });
    }

    // Detect collision with pipes or canvas edges
    if (bX + bird.width >= pipe[i].x &&
        bX <= pipe[i].x + pipeNorth.width &&
        (bY <= pipe[i].y + pipeNorth.height ||
         bY + bird.height >= pipe[i].y + constant) ||
        bY + bird.height >= canvas.height) {
      dieSound.play();
      isPlaying = false;
      document.getElementById("menu").style.display = "block";
    }

    // Increase score and play sound effect when passing pipes
    if (pipe[i].x == 5) {
      score++;
    }
  }

  // Apply gravity to bird
  bY += gravity;

  // Draw
