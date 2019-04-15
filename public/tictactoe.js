const baseState = function () {
  return [null, null, null, null, null, null, null, null, null];
};

let historyState = [];
let currentState, turn;

let resetBoard = function() {
  currentState = baseState();
  historyState = [];
  turn = 'X';
  updateBoard();
};

let updateBoard = function (state) {
  let board = document.querySelector('#game-board');
  if (!board) return;
  board.innerHTML = buildBoard(state || currentState);
};

let buildBoard = function (state) {
  let winner = isWinner();
  let rows = winner ? '<p><strong>' + winner + ' is the winner!</p></strong><table><tbody>' : '<table><tbody>';
  rows += buildSquares(state, winner);
  rows += '</tbody></table><p><button id="play-again">Play Again</button></p>';
  rows += buildHistory();
  return rows;
};

let buildSquares = function (state, winner) {
  let rows = '';
  state.forEach(function (square, id) {
    let value = square ? square : '';
    let selected = square ? ' aria-pressed="true"' : '';
    let disabled = square || winner ? ' disabled' : '';
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

let isWinner = function () {
	let wins = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];
	let isWinner = wins.filter(function (win) {
		return (currentState[win[0]] && currentState[win[0]] === currentState[win[1]] && currentState[win[0]] === currentState[win[2]]);
	});
	return (isWinner.length > 0 ? currentState[isWinner[0][0]] : false);
};

let renderTurn = function(square) {
  let selected = square.getAttribute('data-id');
  if (!selected) return;
  currentState[selected] = turn;
  historyState.push(currentState.slice());
  updateBoard();
  turn = (turn === 'X') ? 'O' : 'X';
};

let buildHistory = function () {
  let history = '';
  if (historyState.length > 0) {
    history += '<h2>Game History</h2><ol>';
    historyState.forEach(function (move, index) {
      history += (
        '<li><button data-history="' + move.toString()
        + '">Go to move #' + (index+1) + '</button></li>'
      );
    });
    history += '</ol>';
  }
  return history;
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
  if (event.target.matches('[data-history]')) {
		currentState = event.target.getAttribute('data-history').split(',');
    turnNumber = Number(event.target.innerHTML.substr(-1));
    historyState = historyState.slice(0, turnNumber);
    console.log(historyState);
    updateBoard();
	}
}, false);
