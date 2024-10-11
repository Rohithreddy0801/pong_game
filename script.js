// Create JS representation from the DOM
const startText = document.getElementById('startText');
const paddle1 = document.getElementById('paddle1');
const paddle2 = document.getElementById('paddle2');
const ball = document.getElementById('ball');
const player1scoreElement = document.getElementById('player1score');
const player2scoreElement = document.getElementById('player2score');
const lossSound = document.getElementById('lossSound');
const wallSound = document.getElementById('wallSound');
const paddleSound = document.getElementById('paddleSound');
// Game Variables
let gameRunning = false;
let keyspressed = {};
let paddle1Speed = 0;
let paddle1Y = 268.5;
let paddle2Speed = 0;
let paddle2Y = 268.5;
let ballX = 308.5;
let ballSpeedX = 2;
let ballY = 312.5;
let ballSpeedY = 2;
let player2score = 0;
let player1score = 0;

document.addEventListener('keydown',startGame);
document.addEventListener('keydown',handlekeyDown);
document.addEventListener('keyup',handlekeyUp);

//Game Contants
const paddleAcceleration = 1;
const maxpaddleSpeed = 5;
const paddleDeceleration = 1;
const gameHeight = 685;
const gameWidth = 655;

//Start game
function startGame(){
    gameRunning=true;
    console.log('start');
    startText.style.display = 'none';
    document.removeEventListener('keydown',startGame);
    gameLoop();
}

function gameLoop(){
    if (gameRunning){
        updatepaddle1();
        updatepaddle2();
        moveBall();
        setTimeout(gameLoop,8);
    }
}
function handlekeyDown(e){
    keyspressed[e.key] = true;
}

function handlekeyUp(e){
    keyspressed[e.key] = false;
}

function updatepaddle1(){
    if (keyspressed['w']) {
        paddle1Speed = Math.max(paddle1Speed - paddleAcceleration,-maxpaddleSpeed);
    }
    else if(keyspressed['s']){
        paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, maxpaddleSpeed);
    }
    else{
        if(paddle1Speed > 0){
            paddle1Speed = Math.max(paddle1Speed - paddleDeceleration,0);
        } else if (paddle1Speed < 0){
            paddle1Speed = Math.min(paddle1Speed + paddleDeceleration, 0);
        }
    }

    paddle1Y += paddle1Speed;

    if(paddle1Y < 0){
        paddle1Y = 0;
    }

    if(paddle1Y > gameHeight - paddle1.clientHeight){
        paddle1Y = gameHeight - paddle1.clientHeight;
    }

    paddle1.style.top = paddle1Y + 'px';
    
}

function updatepaddle2(){
    if (keyspressed['ArrowUp']) {
        paddle2Speed = Math.max(paddle2Speed - paddleAcceleration,-maxpaddleSpeed);
    }
    else if(keyspressed['ArrowDown']){
        paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, maxpaddleSpeed);
    }
    else{
        if(paddle2Speed > 0){
            paddle2Speed = Math.max(paddle2Speed - paddleDeceleration,0);
        } else if (paddle2Speed < 0){
            paddle2Speed = Math.min(paddle2Speed + paddleDeceleration, 0);
        }
    }

    paddle2Y += paddle2Speed;

    if(paddle2Y < 0){
        paddle2Y = 0;
    }

    if(paddle2Y > gameHeight - paddle2.clientHeight){
        paddle2Y = gameHeight - paddle2.clientHeight;
    }

    paddle2.style.top = paddle2Y + 'px';
    
}

function moveBall(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //wall collision
    if(ballY >= gameHeight - ball.clientHeight || ballY <= 0)
    {
        ballSpeedY = -ballSpeedY;
        playSound(wallSound);
    }

    // paddle 1 collision
    if (ballX <= paddle1.clientWidth &&
        ballY >= paddle1Y &&
        ballY <= paddle1Y + paddle1.clientHeight)
   {
       ballSpeedX = -ballSpeedX;
       playSound(paddleSound);
   }

    // paddle 2 collision
    if (ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
        ballY >= paddle2Y &&
        ballY <= paddle2Y + paddle2.clientHeight)
    {
        ballSpeedX = -ballSpeedX;
        playSound(paddleSound);
    }

    // Out of game area collision
    if(ballX <= 0){
        player2score++;
        playSound(lossSound);
        updatescoreboard();
        resetball();
        pauseGame();
    } else if ( ballX >= gameWidth - ball.clientWidth)
    {
        player1score++;
        playSound(lossSound);
        updatescoreboard();
        resetball();
    }
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

function updatescoreboard(){
    player1scoreElement.textContent = player1score;
    player2scoreElement.textContent = player2score;
}

function resetball() {
    ballX = gameWidth / 2 - ball.clientWidth / 2;
    ballY = gameHeight / 2 - ball.clientHeight / 2;
    ballSpeedX = Math.random() > 0.5 ? 2 : -2;
    ballSpeedY = Math.random() > 0.5 ? 2 : -2;
}

function pauseGame() {
    gameRunning = false;
    document.addEventListener('keydown',startGame);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}