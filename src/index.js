import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
const parse = require('html-react-parser');

function Square(props) {
  return (
    <button 
      className={`square ${props.winner ? 'winner' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]}
        winner={this.props.winnerSquares.includes(i) ? true : false}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rows = [];
    for (var row=0; row<3; row++) {
      var cols = [];
      for (var col=0; col<3; col++) {
        cols.push(this.renderSquare(row*3+col));
      }
      rows.push(<div key={row} className="board-row">{cols}</div>);
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

function Toggle(props) {
  return (
    <button 
      className="toggle" 
      onClick={props.onClick}
    >
      Toggle
    </button>
  );
}
  
class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClickBoard(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).length > 0 || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        col: i % 3 + 1,
        row: Math.floor(i / 3) + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClickToggle() {
    const history = this.state.history.reverse();
    this.setState({history: history});
  }

  renderToggle() {
    return (
      <Toggle 
        onClick={() => this.handleClickToggle()}
      />
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move ?
        ('Go to move #' + move) :
        ('Go to game start');

      desc = desc + ' - Col: ' + step.col + ', Row: ' + step.row;
      if (move === this.state.stepNumber)
        desc = "<b>"+desc+"</b>";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{parse(desc)}</button>
        </li>
      );
    });

    let status;
    if (winnerSquares.length > 0) {
      status = 'Winner: ' + this.state.history[this.state.stepNumber].squares[winnerSquares[0]]
    } else if (this.state.stepNumber < 9) {
      console.log(this.state);
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } else {
      status = 'No one wins, draw';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerSquares}
            onClick={(i) => this.handleClickBoard(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <div>{this.renderToggle()}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(lines[i]);
      return lines[i];
    }
  }
  
  return [];
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


