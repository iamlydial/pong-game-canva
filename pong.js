// select the canvas element
const canvas = document.getElementById("pong");

//getContext method returns a drawing context on the canvas
const ctx = canvas.getContext("2d");

// ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "white",
};

//starting with objects
const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};

const com = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};

// create a net object
const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "WHITE",
};
// drawing a rectangle
function drawRect(x, y, w, h, color) {
  //method fillstyle specifies the color, gradient, or pattern to use inside shapes.
  ctx.fillStyle = color;
  //draws a rectangle that is filled according to the current fillStyle (above)
  ctx.fillRect(x, y, w, h);
}

// drawing a circle
function drawArc(x, y, r, color) {
  // choosing color first
  ctx.fillStyle = color;
  //beginPath() starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
  ctx.beginPath();
  // .arc adds a circular arc to the current sub-path.
  //.arc takes 5 arguments (x, y, radius, startAngle, endAngle, counterclockwise (this last one is optional))
  //The arc() method creates a circular arc centered at (x, y) with a radius of radius.
  //The path starts at startAngle, ends at endAngle, and travels in the direction given by counterclockwise (defaulting to clockwise).
  // x = The horizontal coordinate of the arc's center.
  // y = The vertical coordinate of the arc's center.
  // radius = The arc's radius. Must be positive.
  // startAngle = The angle at which the arc starts in radians, measured from the positive x-axis.
  // endAngle = The angle at which the arc ends in radians, measured from the positive x-axis.
  // counterclockwise = An optional boolean value. If true, draws the arc counter-clockwise between the start and end angles. The default is false (clockwise).
  ctx.arc(x, y, r, 0, Math.PI * 2, false);

  // closePath() attempts to add a straight line from the current point to the start of the current sub-path.
  ctx.closePath();
  // fill() fills the current or given path with the current fillStyle
  ctx.fill();
}

// drawing text
function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  // .font specifies the current text style to use when drawing text.
  ctx.font = "75px fantasy";
  //draws a text string at the specified coordinates, filling the string's characters with the current fillStyle
  ctx.fillText = (text, x, y);
}

// creating game elements

// create a function that draws the net. such function is a for loop.
function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
    // net.x (x position of the net)
    // net.y (y position of the net)
    // + 1 is the interval (in the for loop condition)
    //
  }
}

function update() {
  if (ball.x - ball.radius < 0) {
    com.score++;

    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;

    resetBall();
  }
  // ball has a velocity
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  com.y += (ball.y - (com.y + com.height / 2)) * 0.1;
  // when the ball collides with bottom and top walls we inverse the y velocity.
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  let player = ball.x < canvas.width / 2 ? user : com;
  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    // speed up the ball everytime a paddle hits it.
    ball.speed += 0.1;
  }
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 5;
}

//collision detection takes 2 params ball and player
function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;

  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top
  );
}

//stating movememnt
// rextX set to 0, will be used as starting point for the ball
let rectX = 0;

function render() {
  //call the canvas drawing function - launching a new empty canvas each time
  // is equal to 'clear the canvas, and give the illusion that the new
  //red square is moving
  drawRect(0, 0, canvas.width, canvas.height, "black");
  // draw the user score to the left
  drawText(user.score, canvas.width / 4, canvas.height / 5);

  // draw the COM score to the right
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5);
  //draw net
  drawNet();

  // draw function for user
  drawRect(user.x, user.y, user.width, user.height, user.color);

  // draw function for com
  drawRect(com.x, com.y, com.width, com.height, com.color);

  //call the rectangle drawing function with x position as RectX = 0
  drawArc(ball.x, ball.y, ball.radius, ball.color);

  // i set the rectX horizontal line increase (100px)
  rectX = rectX + 100;
}

//set interval repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
// takes 2 params A function (1st param) to be executed every delay milliseconds (2ns param).
setInterval(render, 1000);

function game() {
  update();
  render();
}

const framePerSecond = 50;

let loop = setInterval(game, 1000 / framePerSecond);
