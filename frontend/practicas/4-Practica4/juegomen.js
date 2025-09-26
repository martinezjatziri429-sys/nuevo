document.addEventListener('DOMContentLoaded', () => {
 // Selectores para elementos del DOM
 const gameBoard = document.getElementById('game-board');
 const timeDisplay = document.getElementById('time-display');
 const attemptsDisplay = document.getElementById('attempts-display');
 const modalStart = document.getElementById('modal-start');
 const startGameButton = document.getElementById('start-game');
 const modalEnd = document.getElementById('modal-end'); // Nuevo selector para el modal de fin de juego
 const endMessage = document.getElementById('end-message'); // Nuevo selector para el mensaje
 const restartGameButton = document.getElementById('restart-game'); // Nuevo selector para el botón Aceptar

 // Configuración del juego
 const frutas = ['🍓', '🍎', '🍇', '🍉', '🍌', '🍍', '🥭', '🍒'];
 let cards = [...frutas, ...frutas];
 let flippedCards = [];
 let matchedPairs = 0;
 let attempts = 0;
 let timer;
 let seconds = 0;
 const gameDuration = 50; // Segundos

 // Función para mezclar las cartas
 function shuffle(array) {
 for (let i = array.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [array[i], array[j]] = [array[j], array[i]];
 }
 }

 // Función para crear el tablero
 function createBoard() {
 shuffle(cards);
 gameBoard.innerHTML = '';
 cards.forEach(fruta => {
 const card = document.createElement('div');
 card.classList.add('card');
 card.innerHTML = `
 <div class="card-back"></div>
 <div class="card-front">${fruta}</div>
 `;
 card.addEventListener('click', flipCard);
 gameBoard.appendChild(card);
 });
 }

 // Función para voltear una carta
 function flipCard() {
 if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
 this.classList.add('flipped');
 flippedCards.push(this);

 if (flippedCards.length === 2) {
 attempts++;
 attemptsDisplay.textContent = attempts;
 setTimeout(checkMatch, 1000);
 }
 }
 }

 // Función para verificar si hay una pareja
 function checkMatch() {
 const [card1, card2] = flippedCards;
 const fruta1 = card1.querySelector('.card-front').textContent;
 const fruta2 = card2.querySelector('.card-front').textContent;

 if (fruta1 === fruta2) {
 matchedPairs++;
 card1.removeEventListener('click', flipCard);
 card2.removeEventListener('click', flipCard);
 } else {
 card1.classList.remove('flipped');
 card2.classList.remove('flipped');
 }

 flippedCards = [];
 checkWinOrLose();
 }

 // Nueva función para mostrar el modal de fin de juego
 function showEndModal(message) {
 endMessage.textContent = message;
 modalEnd.style.display = 'flex';
 }

 // Función para revisar si el juego terminó
 function checkWinOrLose() {
 if (matchedPairs === frutas.length) {
 clearInterval(timer);
 showEndModal(`¡Felicidades! Encontraste todas las parejas en ${attempts} intentos y ${seconds} segundos.`);
 }
 }

 // Función para iniciar el temporizador
 function startTimer() {
 timer = setInterval(() => {
 seconds++;
 timeDisplay.textContent = `${seconds}s`;
 if (seconds >= gameDuration) {
 clearInterval(timer);
 // Reemplazamos la alerta por el nuevo modal
 showEndModal('¡Se acabó el tiempo! El juego se reiniciará.');
 }
 }, 1000);
 }

 // Función para reiniciar el juego
 function resetGame() {
 clearInterval(timer);
 seconds = 0;
 matchedPairs = 0;
 attempts = 0;
 timeDisplay.textContent = '0s';
 attemptsDisplay.textContent = '0';
 flippedCards = [];
 createBoard();
 modalEnd.style.display = 'none'; // Ocultamos el modal de fin de juego
 startTimer();
 }

 // Event listeners
 startGameButton.addEventListener('click', () => {
 modalStart.style.display = 'none';
 createBoard();
 startTimer();
 });

 // Nuevo event listener para el botón Aceptar del modal de fin de juego
 restartGameButton.addEventListener('click', () => {
 resetGame();
 });

 // Lógica de inicio inicial del juego
 // El modal de inicio ya está visible por defecto, el juego comienza al hacer clic.
});
