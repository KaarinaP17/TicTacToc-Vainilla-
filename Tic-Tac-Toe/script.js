const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let currentPlayer = 'X'; // El jugador siempre es "X", la máquina es "O"
let isMachineThinking = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    // Si la máquina está pensando o el juego terminó, bloquea la interacción
    if (isMachineThinking || !gameActive) return;

    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute('data-index');

    if (board[cellIndex] !== '') {
        return;
    }

    board[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();

    if (gameActive) {
        isMachineThinking = true; // Bloquea clics mientras la máquina piensa
        setTimeout(machineTurn, 500); 
    }
}

function machineTurn() {
    if (!gameActive) return;

    let bestMove = findBestMove('O');
    if (bestMove !== -1) {
        board[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        checkResult();
        isMachineThinking = false; // Reactiva clics después del turno de la máquina
        return;
    }

    bestMove = findBestMove('X');
    if (bestMove !== -1) {
        board[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        checkResult();
        isMachineThinking = false;
        return;
    }

    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        checkResult();
    }

    isMachineThinking = false; // Reactiva clics
}

function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        let values = [board[a], board[b], board[c]];

        if (values.filter(val => val === player).length === 2 && values.includes('')) {
            return values.indexOf('') === 0 ? a : values.indexOf('') === 1 ? b : c;
        }
    }
    return -1; 
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        message.textContent = 'Tie!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    isMachineThinking = false; // Reactiva el juego al reiniciar
    message.textContent = '';
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
