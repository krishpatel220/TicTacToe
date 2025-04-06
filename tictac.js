let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '❌';
let gameActive = true;

function renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        if (cell) cellElement.classList.add("taken");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () => handleMove(index));
        boardElement.appendChild(cellElement);
    });
}

function handleMove(index) {
    if (board[index] || !gameActive || currentPlayer === '⭕️') return;
    board[index] = currentPlayer;
    checkWinner();
    currentPlayer = '⭕️';
    renderBoard();
    if (gameActive) setTimeout(computerMove, 300);
}

function computerMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = '⭕️';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        board[move] = '⭕️';
        checkWinner();
        currentPlayer = '❌';
        renderBoard();
    }
}

function minimax(boardState, depth, isMaximizing) {
    const scores = {
        '⭕️': 1,
        '❌': -1,
        draw: 0
    };

    let result = checkWinnerSim(boardState);
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = '⭕️';
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = '❌';
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerSim(boardState) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }

    if (!boardState.includes('')) return 'draw';

    return null;
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById("winner").textContent = `${board[a]} Wins!`;
            gameActive = false;
            return;
        }
    }

    if (!board.includes('')) {
        document.getElementById("winner").textContent = "It's a Draw!";
        gameActive = false;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = '❌';
    gameActive = true;
    document.getElementById("winner").textContent = '';
    renderBoard();
}

// Attach reset button handler once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("resetButton").addEventListener("click", resetGame);
    renderBoard();
});
