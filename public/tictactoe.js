console.log('Hello world')

const baseState = function () {
  return [null, null, null, null, null, null, null, null, null];
};

let historyState = [];
let currentState, turn;

let resetBoard = function() {
  console.log("Called resetBoard");
  currentState = baseState();
  historyState = [];
  turn = 'X';
  updateBoard();
};

let updateBoard = function (state) {
  console.log("Called updateBoard");
  let board = document.querySelector('#game-board');
  console.log(board);
  if (!board) {
    console.log("Didn't find board.");
    return;
  }
  board.innerHTML = buildBoard(state || currentState);
};

let buildBoard = function (state) {
  let rows = '<table><tbody>';
  rows += buildSquares(state);
  rows += '</tbody></table><p><button id="play-again">Play Again</button></p>';
  return rows;
};

let buildSquares = function (state) {
  let rows = '';
  state.forEach(function (square, id) {
    let value = square ? square : '';
    let selected = square ? ' aria-pressed="true"' : '';
    let disabled = square ? ' disabled' : '';
    if (isFirstInRow(id)) {
      rows += '<tr>'
    }
    rows += (
      '<td><button class="game-square" data-id="' + id + '"'
      + selected + disabled +'>' + value + '</button></td>'
    );
    if (isLastInRow(id)) {
      rows += '</tr>';
    }
  });
  return rows;
};

let isFirstInRow = function (id) {
  return ((id + 1) % 3 == 1);
};

let isLastInRow = function (id) {
  return ((id + 1) % 3 == 0);
};

let renderTurn = function(square) {
  let selected = square.getAttribute('data-id');
  if (!selected) return;
  currentState[selected] = turn;
  historyState.push(currentState.slice());
  updateBoard();
  turn = (turn === 'X') ? 'O' : 'X';
};

resetBoard();

document.addEventListener('click', function (event) {
  if (event.target.matches('#play-again')) {
    resetBoard();
  }
  if (event.target.matches('.game-square') &&
    !(event.target.hasAttribute('disabled'))) {
    renderTurn(event.target);
  }
}, false);
