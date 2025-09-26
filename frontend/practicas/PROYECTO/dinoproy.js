// Obtener el canvas y su contexto para dibujar
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementos de la interfaz de usuario
const scoreEl = document.getElementById('score');
const infoText = document.getElementById('info-text');
const newGameBtn = document.getElementById('newGameBtn');
const clearScoresBtn = document.getElementById('clearScoresBtn');
const scoreTableBody = document.getElementById('scoreTableBody');
const nameInputScreen = document.getElementById('nameInputScreen');
const playerNameInput = document.getElementById('playerNameInput');
const submitNameBtn = document.getElementById('submitNameBtn');

// Variables del juego y la tabla
let isPlaying = false;
let score = 0;
let level = 1;
let gameSpeed = 5;
let obstacleInterval = 3000; // Incrementado para más espacio inicial
let lastObstacleTime = 0;
let scores = [];
let obstacles = []; // Se inicializa aquí para que esté disponible en todo el script
let player = {
    x: 50,
    y: 120,
    width: 60,
    height: 80,
    velocityY: 0,
    gravity: 0.7, // Aumentada la gravedad para una caída más rápida
    isJumping: false
};
let backgroundX = 0;

// Cargar las imágenes
const chavoImg = new Image();
chavoImg.src = 'personaje.png';
const barrelImg = new Image();
barrelImg.src = 'barril.png';
const bgImg = new Image();
bgImg.src = 'background.jpeg';

let imagesLoaded = 0;
const totalImages = 3;

// Esperar a que las imágenes carguen antes de iniciar el juego
chavoImg.onload = () => { imagesLoaded++; checkImages(); };
barrelImg.onload = () => { imagesLoaded++; checkImages(); };
bgImg.onload = () => { imagesLoaded++; checkImages(); };

function checkImages() {
    if (imagesLoaded === totalImages) {
        infoText.textContent = 'Presiona "Nueva Partida" para empezar.';
    }
}

// Dibujar al personaje
function drawChavo() {
    ctx.drawImage(chavoImg, player.x, player.y, player.width, player.height);
}

// Clase para crear los obstáculos
class Barrel {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width;
        this.y = 200 - this.height;
    }

    draw() {
        ctx.drawImage(barrelImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= gameSpeed;
    }
}

// Dibujar el fondo móvil
function drawBackground() {
    ctx.drawImage(bgImg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    backgroundX -= gameSpeed * 0.5;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

// Actualizar la posición del personaje
function updatePlayer() {
    if (player.isJumping) {
        player.velocityY += player.gravity;
        player.y += player.velocityY;
        if (player.y >= 120) {
            player.y = 120;
            player.isJumping = false;
            player.velocityY = 0;
        }
    }
}

// Bucle principal del juego
function gameLoop(timestamp) {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    updatePlayer();
    drawChavo();

    if (timestamp - lastObstacleTime > obstacleInterval) {
        obstacles.push(new Barrel());
        lastObstacleTime = timestamp;
        if (obstacleInterval > 400) {
            obstacleInterval -= 5; // Reducido para que el espacio disminuya más lentamente
        }
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw();

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreEl.textContent = `Puntuación: ${score}`;
            if (score % 10 === 0) {
                level++;
                gameSpeed += 0.5;
                infoText.textContent = `¡Nivel ${level} alcanzado!`;
            } else {
                infoText.textContent = `Nivel: ${level}`;
            }
        }

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
        }
    });

    requestAnimationFrame(gameLoop);
}

// Función para renderizar la tabla de puntuaciones
function renderScores() {
    scoreTableBody.innerHTML = '';
    scores.forEach((s, index) => {
        const row = scoreTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.textContent = index + 1;
        cell2.textContent = s.name;
        cell3.textContent = s.score;
        cell4.textContent = s.level;
    });
}

// Función de fin de juego
function gameOver() {
    isPlaying = false;
    infoText.textContent = `¡Fin del juego! Puntuación final: ${score} (Nivel ${level})`;
    nameInputScreen.classList.remove('hidden');
}

// Función para iniciar el juego
function startGame() {
    isPlaying = true;
    score = 0;
    level = 1;
    gameSpeed = 5;
    player.y = 120;
    player.isJumping = false;
    obstacles = [];
    lastObstacleTime = 0;
    obstacleInterval = 3000; // Reiniciar el intervalo en cada partida
    scoreEl.textContent = `Puntuación: ${score}`;
    infoText.textContent = `Nivel: ${level} - Presiona ESPACIO para saltar.`;
    requestAnimationFrame(gameLoop);
}

// Manejar eventos del teclado y los botones
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && isPlaying && !player.isJumping) {
        player.isJumping = true;
        player.velocityY = -20; // Aumentada la velocidad de salto
    }
});

newGameBtn.addEventListener('click', () => {
    if (!isPlaying) {
        startGame();
    }
});

clearScoresBtn.addEventListener('click', () => {
    scores = [];
    renderScores();
});

submitNameBtn.addEventListener('click', () => {
    let playerName = playerNameInput.value.trim();
    if (playerName === '') {
        playerName = 'Anónimo';
    }

    scores.push({ name: playerName, score: score, level: level });

    nameInputScreen.classList.add('hidden');
    renderScores();
    
    playerNameInput.value = '';
});

// Mensaje inicial al cargar
checkImages();