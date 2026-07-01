import { useState } from 'react';

function Square({ id, value, onSquareClick }) {
  return (
    <button id={id} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove, pos, setPos }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    const row = Math.floor(i / 3), col = i % 3;
    const nextPos = [...pos];
    nextPos[currentMove + 1] = [row, col];
    setPos(nextPos);
    onPlay(nextSquares);
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        for (const pos of lines[i]) {
          const square = document.getElementById(String(pos));
          if (square) {
            square.classList.add(squares[a] === "O" ? "red-highlighted" : "blue-highlighted");
          }
        }
        return squares[a];
      }
    }
    return null;
  }

  for (let i = 0; i < 9; i++) {
    const square = document.getElementById(String(i));
    if (square) {
      square.className = "square";
    }
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((square) => square)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="board-row">
            {Array.from({ length: 3 }).map((_, j) => (
              <Square
                key={3*i + j}
                id={String(3*i + j)}
                value={squares[3*i + j]}
                onSquareClick={() => handleClick(3*i + j)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [positions, setPositions] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    const location = positions[move] ? '(' + positions[move][0] + ', ' + positions[move][1] + ')' : 'undefined';
    if (move > 0) {
      description = 'Go to move #' + move + ' at location ' + location;
    } else {
      description = 'Go to game start at location ' + location;
    }
    return move === currentMove ? <li key={move}>You are at move #{move} at location {location}</li> : (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}
          currentMove={currentMove} pos={positions} setPos={setPositions}/>
      </div>
      <div className="game-info">
        <ol>{ascending ? moves.reverse() : moves}</ol>
      </div>
      <div>
        <span>Sort moves in {ascending ? "ascending" : "descending"} order : </span>
        <label className="switch">
          <input type="checkbox"
            checked={ascending}
            onChange={(e) => setAscending(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}