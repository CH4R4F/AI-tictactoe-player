const ai = "X";
const charaf = "O";
const winCases = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let board;

let squares = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".result").style.display = "none";
  board = Array.from(Array(9).keys());

  for (let i = 0; i < 9; i++) {
    squares[i].textContent = "";
    squares[i].style.removeProperty("background-color");
    squares[i].addEventListener("click", setClick);
  }
}

function setClick(e) {
  if (typeof board[e.target.id] == "number") {
    handlClick(e.target.id, charaf);
    if (!checkTie()) {
      handlClick(bestSpot(), ai);
    }
  }
}

function handlClick(squareId, player) {
  board[squareId] = player;
  document.getElementById(squareId).textContent = player;
  let winner = checkWinner(board, player);
  if (winner) {
    gameOver(winner);
  }
}

function checkWinner(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCases.entries()) {
    if (win.every((e) => plays.indexOf(e) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}
function gameOver(gameWon) {
  for (let index of winCases[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player === charaf ? "#72e372" : "#ff4c4c";
  }
  for (let i = 0; i < 9; i++) {
    squares[i].removeEventListener("click", setClick);
  }
  declareWinner(gameWon.player === charaf ? "You Win" : "You lose!");
}

function bestSpot() {
  return minimax(board, ai).index;
}

function checkTie() {
  if (board.every((i) => typeof i != "number")) {
    for (let i = 0; i < 9; i++) {
      squares[i].style.backgroundColor = "#ff9d55";
      squares[i].removeEventListener("click", setClick);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function declareWinner(who) {
  document.querySelector(".result").style.display = "block";
  document.querySelector(".result p").innerHTML = who;
}

function emprySquares(b) {
  return b.filter((s) => typeof s == "number");
}

function minimax(newBoard, player) {
  let availablespots = emprySquares(newBoard);
  if (checkWinner(newBoard, player)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, ai)) {
    return { score: 10 };
  } else if (availablespots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availablespots.length; i++) {
    let move = {};
    move.index = newBoard[availablespots[i]];
    newBoard[availablespots[i]] = player;

    if (player == ai) {
      var result = minimax(newBoard, charaf);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, ai);
      move.score = result.score;
    }

    newBoard[availablespots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;
  if (player == ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

document.querySelector(".result button").addEventListener("click", startGame);

// TODO: handle the case when the game is a tie and win at the same time
