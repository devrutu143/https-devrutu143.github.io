// User Name Handling
const userNameInput = document.getElementById('user-name');
const saveNameBtn = document.getElementById('save-name');
const welcomeNote = document.getElementById('welcome-note');
const dashboardSection = document.getElementById('dashboard-section');
const dashboardWelcome = document.getElementById('dashboard-welcome');
const updateNameInput = document.getElementById('update-name');
const updateNameBtn = document.getElementById('update-name-btn');
const nishaQuote = document.getElementById('nisha-quote');
const gamesSection = document.getElementById('games-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const leaderboardList = document.getElementById('leaderboard');
const secretsBtn = document.getElementById('secrets-btn');
const passwordSection = document.getElementById('password-section');
const secretsSection = document.getElementById('secrets-section');
const passwordInput = document.getElementById('password-input');
const submitPasswordBtn = document.getElementById('submit-password');
const passwordError = document.getElementById('password-error');

let userName = ''; // No localStorage, reset on load
let scores = JSON.parse(localStorage.getItem('scores')) || { tic: 0, rps: 0, memory: 0 }; // Keep scores in localStorage

const lovelyQuotes = [
    "Your smile lights up the world like a starry night.",
    "You bring joy to every moment, like a gentle breeze.",
    "Your heart is a garden where kindness blooms.",
    "You shine brighter than the sun on a summer day.",
    "Your presence is a melody that warms the soul."
];

// Ensure welcome screen is shown on load
welcomeNote.classList.remove('hidden');
userNameInput.classList.remove('hidden');
saveNameBtn.classList.remove('hidden');
dashboardSection.classList.add('hidden');

saveNameBtn.addEventListener('click', () => {
    const inputName = userNameInput.value.trim();
    if (inputName) {
        userName = inputName;
        showDashboard();
        userNameInput.value = ''; // Clear input after submission
    }
});

updateNameBtn.addEventListener('click', () => {
    const inputName = updateNameInput.value.trim();
    if (inputName) {
        userName = inputName;
        showDashboard();
        updateNameInput.value = ''; // Clear input after submission
    }
});

secretsBtn.addEventListener('click', () => showSection(passwordSection));

submitPasswordBtn.addEventListener('click', () => {
    const password = passwordInput.value.trim();
    if (password === '143') {
        passwordInput.value = '';
        passwordError.classList.add('hidden');
        showSection(secretsSection); // Show secrets dashboard
    } else {
        passwordError.classList.remove('hidden');
        passwordInput.value = '';
    }
});

function showDashboard() {
    // Hide welcome screen
    welcomeNote.classList.add('hidden');
    userNameInput.classList.add('hidden');
    saveNameBtn.classList.add('hidden');
    // Show dashboard
    dashboardSection.classList.remove('hidden');
    gamesSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    passwordSection.classList.add('hidden');
    secretsSection.classList.add('hidden');
    dashboardWelcome.textContent = `Hello, ${userName}! Welcome to your dashboard.`;
    if (userName.toLowerCase().includes('nisha')) {
        nishaQuote.textContent = lovelyQuotes[Math.floor(Math.random() * lovelyQuotes.length)];
        nishaQuote.classList.remove('hidden');
    } else {
        nishaQuote.classList.add('hidden');
    }
}

// Game Navigation
const gamesBtn = document.getElementById('games-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const game1Btn = document.getElementById('game1-btn');
const game2Btn = document.getElementById('game2-btn');
const game3Btn = document.getElementById('game3-btn');
const game1 = document.getElementById('game1');
const game2 = document.getElementById('game2');
const game3 = document.getElementById('game3');

gamesBtn.addEventListener('click', () => showSection(gamesSection));
leaderboardBtn.addEventListener('click', () => showSection(leaderboardSection));
game1Btn.addEventListener('click', () => showSection(game1));
game2Btn.addEventListener('click', () => showSection(game2));
game3Btn.addEventListener('click', () => showSection(game3));

const backBtns = document.querySelectorAll('.back-btn');
backBtns.forEach(btn => {
    btn.addEventListener('click', () => showSection(dashboardSection));
});

function showSection(section) {
    dashboardSection.classList.add('hidden');
    gamesSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    game1.classList.add('hidden');
    game2.classList.add('hidden');
    game3.classList.add('hidden');
    passwordSection.classList.add('hidden');
    secretsSection.classList.add('hidden');
    section.classList.remove('hidden');
}

// Leaderboard
function loadLeaderboard() {
    leaderboardList.innerHTML = `
        <li>Tic-Tac-Toe Wins: ${scores.tic}</li>
        <li>Rock-Paper-Scissors Score: ${scores.rps}</li>
        <li>Memory Match Best Moves: ${scores.memory || 'N/A'}</li>
    `;
}

function updateScore(game, value) {
    if (game === 'memory') {
        if (!scores.memory || value < scores.memory) scores.memory = value;
    } else {
        scores[game] += value;
    }
    localStorage.setItem('scores', JSON.stringify(scores));
    loadLeaderboard();
}

// Game 1: Tic-Tac-Toe vs Rutu
const board = document.getElementById('board');
const message = document.getElementById('message');
const resetTic = document.getElementById('reset-tic');
const difficultySelect = document.getElementById('difficulty');
const thinkingLoader = document.getElementById('thinking-loader');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function initTicTacToe() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = `${userName}'s turn (X)`;
    thinkingLoader.classList.add('hidden');
}

function handleCellClick(e) {
    if (!gameActive || currentPlayer !== 'X') return;
    const index = e.target.dataset.index;
    if (gameBoard[index]) return;
    gameBoard[index] = 'X';
    e.target.textContent = 'X';
    e.target.classList.add('fade-in');
    if (checkWin('X')) {
        message.textContent = `${userName} wins!`;
        gameActive = false;
        updateScore('tic', 1);
        thinkingLoader.classList.add('hidden');
    } else if (gameBoard.every(cell => cell)) {
        message.textContent = 'Draw!';
        gameActive = false;
        thinkingLoader.classList.add('hidden');
    } else {
        currentPlayer = 'O';
        message.textContent = `Rutu's turn (O)`;
        if (difficultySelect.value === 'hardcore') {
            thinkingLoader.classList.remove('hidden');
        }
        setTimeout(() => rutuMove(), 1000);
    }
}

function rutuMove() {
    if (!gameActive) return;
    const difficulty = difficultySelect.value;
    let move;
    if (difficulty === 'easy') {
        move = easyAIMove();
    } else if (difficulty === 'medium') {
        move = mediumAIMove();
    } else {
        move = minimax(gameBoard, 'O').index;
    }
    if (move !== undefined) {
        gameBoard[move] = 'O';
        const cell = board.querySelector(`[data-index="${move}"]`);
        cell.textContent = 'O';
        cell.classList.add('fade-in');
        thinkingLoader.classList.add('hidden');
        if (checkWin('O')) {
            message.textContent = 'Rutu wins!';
            gameActive = false;
        } else if (gameBoard.every(cell => cell)) {
            message.textContent = 'Draw!';
            gameActive = false;
        } else {
            currentPlayer = 'X';
            message.textContent = `${userName}'s turn (X)`;
        }
    }
}

function easyAIMove() {
    let emptyCells = gameBoard.map((val, idx) => val ? null : idx).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function mediumAIMove() {
    for (let i = 0; i < 9; i++) {
        if (!gameBoard[i]) {
            gameBoard[i] = 'O';
            if (checkWin('O')) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    for (let i = 0; i < 9; i++) {
        if (!gameBoard[i]) {
            gameBoard[i] = 'X';
            if (checkWin('X')) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    return easyAIMove();
}

function minimax(board, player) {
    const emptyCells = board.map((val, idx) => val ? null : idx).filter(val => val !== null);
    if (checkWin('O')) return { score: 10 };
    if (checkWin('X')) return { score: -10 };
    if (emptyCells.length === 0) return { score: 0 };

    const moves = [];
    for (let i of emptyCells) {
        let move = {};
        move.index = i;
        board[i] = player;
        if (player === 'O') {
            move.score = minimax(board, 'X').score - 1;
        } else {
            move.score = minimax(board, 'O').score + 1;
        }
        board[i] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

function checkWin(player) {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return wins.some(combo => combo.every(i => gameBoard[i] === player));
}

resetTic.addEventListener('click', initTicTacToe);
initTicTacToe();

// Game 2: Rock-Paper-Scissors
const choices = document.querySelectorAll('.choice');
const result = document.getElementById('result');
const scoreEl = document.getElementById('score');
const vsGraphic = document.getElementById('vs-graphic');
let rpsScore = 0;

choices.forEach(choice => {
    choice.addEventListener('click', (e) => {
        choice.classList.add('bounce');
        setTimeout(() => choice.classList.remove('bounce'), 300);
        const userChoice = e.target.dataset.choice;
        const computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
        let outcome = '';
        if (userChoice === computerChoice) {
            outcome = 'Tie!';
        } else if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            outcome = 'You win!';
            rpsScore++;
            updateScore('rps', 1);
        } else {
            outcome = 'Computer wins!';
        }
        result.textContent = `You: ${userChoice} | Computer: ${computerChoice} | ${outcome}`;
        scoreEl.textContent = rpsScore;
        vsGraphic.classList.remove('hidden');
        setTimeout(() => vsGraphic.classList.add('hidden'), 500);
    });
});

// Game 3: Memory Match
const memoryBoard = document.getElementById('memory-board');
const movesEl = document.getElementById('moves');
const resetMemory = document.getElementById('reset-memory');
let cards = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H'];
let shuffledCards = cards.sort(() => 0.5 - Math.random());
let flippedCards = [];
let moves = 0;

function initMemory() {
    memoryBoard.innerHTML = '';
    shuffledCards = cards.sort(() => 0.5 - Math.random());
    shuffledCards.forEach((val, idx) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = val;
        card.dataset.index = idx;
        card.addEventListener('click', handleCardClick);
        memoryBoard.appendChild(card);
    });
    flippedCards = [];
    moves = 0;
    movesEl.textContent = moves;
}

function handleCardClick(e) {
    if (flippedCards.length === 2 || e.target.classList.contains('flipped') || e.target.classList.contains('matched')) return;
    e.target.classList.add('flipped');
    e.target.textContent = e.target.dataset.value;
    flippedCards.push(e.target);
    if (flippedCards.length === 2) {
        moves++;
        movesEl.textContent = moves;
        if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
            flippedCards.forEach(card => card.classList.add('matched'));
            flippedCards = [];
            if (document.querySelectorAll('.matched').length === cards.length) {
                updateScore('memory', moves);
            }
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                    card.textContent = '';
                });
                flippedCards = [];
            }, 1000);
        }
    }
}

resetMemory.addEventListener('click', initMemory);
initMemory();
