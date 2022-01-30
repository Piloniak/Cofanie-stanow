import ReactDOM from 'react-dom';
import './index.css';
import React from "react";


const Row = ({ row }) => {
  return (
    <tr>
      {row.map((cell, i) => (<Cell key={i} cellValue={cell} />))}
    </tr>
  );
};

const Cell = ({ cellValue }) => {
  let value = (cellValue === 0) ? '' : cellValue;


  return (
    <td>
      <div className="cell">
        <div className="number">{value}</div>
      </div>
    </td>
  );
};


class Game extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      board: null,
      message: null,
      history: [],
      stepNumber: 0
    };
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
    });
    const backup= this.state.history[step];
    this.setState({board: backup})
    const newHistory=this.state.history;
    newHistory.splice(step+1, newHistory.length);
    this.setState({history: newHistory});
  }
    
  getBlankCoordinates(board) {
    const blankCoordinates = [];
    
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 0) {blankCoordinates.push([r, c])}
      }
    }
            
    return blankCoordinates;
  }
  
  randomStartingNumber() {
    const startingNumbers = [2,4];
    const randomNumber = startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
    return randomNumber;
  }
  
  placeRandom(board) {
    const blankCoordinates = this.getBlankCoordinates(board);
    const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
    const randomNumber = this.randomStartingNumber();
    board[randomCoordinate[0]][randomCoordinate[1]] = randomNumber;
    return board;
  }

  initBoard() {
    let board =
     [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ];
    board = this.placeRandom(this.placeRandom(board));
    this.setState({board});
  }

  
  boardMoved(original, updated) {
    return (JSON.stringify(updated) !== JSON.stringify(original)) ? true : false;
  }
  
  
  move(direction) {

    

    if (!this.state.gameOver) {
      let moveHistory = this.state.history;
      moveHistory.push(this.state.board);
      this.setState({history: moveHistory});
      if (direction === 'up') {

        const movedUp = this.moveUp(this.state.board);
        if (this.boardMoved(this.state.board, movedUp.board)) {
          const upWithRandom = this.placeRandom(movedUp.board);
          
          if (this.checkForGameOver(upWithRandom)) {
            this.setState({board: upWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: upWithRandom, score: this.state.score += movedUp.score});  
          }
        }
      } else if (direction === 'right') {
        const movedRight = this.moveRight(this.state.board);
        if (this.boardMoved(this.state.board, movedRight.board)) {
          const rightWithRandom = this.placeRandom(movedRight.board);
          
          if (this.checkForGameOver(rightWithRandom)) {
            this.setState({board: rightWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: rightWithRandom, score: this.state.score += movedRight.score});  
          }
        }
      } else if (direction === 'down') {
        const movedDown = this.moveDown(this.state.board);
        if (this.boardMoved(this.state.board, movedDown.board)) {
          const downWithRandom = this.placeRandom(movedDown.board);
          
          if (this.checkForGameOver(downWithRandom)) {
            this.setState({board: downWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: downWithRandom, score: this.state.score += movedDown.score});
          }
        }
      } else if (direction === 'left') {
        const movedLeft = this.moveLeft(this.state.board);
        if (this.boardMoved(this.state.board, movedLeft.board)) {
          const leftWithRandom = this.placeRandom(movedLeft.board);
          
          if (this.checkForGameOver(leftWithRandom)) {
            this.setState({board: leftWithRandom, gameOver: true, message: 'Game over!'});  
          } else {
            this.setState({board: leftWithRandom, score: this.state.score += movedLeft.score});
          }
        }
      }
    } else {
      this.setState({message: 'Game over!'});
    }
  }
  moveUp(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = [];

   
    for (let r = 0; r < rotatedRight.length; r++) {
      let row = [];
      for (let c = 0; c < rotatedRight[r].length; c++) {
        let current = rotatedRight[r][c];
        (current === 0) ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

   
    for (let r = 0; r < board.length; r++) {
      for (let c = board[r].length - 1; c >= 0; c--) {
        if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c - 1] = 0;
        } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
        }
      }
    }

    
    board = this.rotateLeft(board);

    return {board};
  }
  
  moveRight(inputBoard) {
    let board = [];

    
    for (let r = 0; r < inputBoard.length; r++) {
      let row = [];      
      for (let c = 0; c < inputBoard[r].length; c++) {
        let current = inputBoard[r][c];
        (current === 0) ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

   
    for (let r = 0; r < board.length; r++) {
      for (let c = board[r].length - 1; c >= 0; c--) {
        if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c - 1] = 0;
        } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
        }
      }
    }

    return {board};
  }
  
  moveDown(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = [];

    for (let r = 0; r < rotatedRight.length; r++) {
      let row = [];      
      for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
        let current = rotatedRight[r][c];
        (current === 0) ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }

    
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
        } else if (board[r][c] === 0 && board[r][c + 1] > 0) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
        }
      }
    }

  
    board = this.rotateLeft(board);

    return {board, };
  }
  
  moveLeft(inputBoard) {
    let board = [];

    
    for (let r = 0; r < inputBoard.length; r++) {
      let row = [];      
      for (let c = inputBoard[r].length - 1; c >= 0; c--) {
        let current = inputBoard[r][c];
        (current === 0) ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }

    
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
        } else if (board[r][c] === 0 && board[r][c + 1] > 0) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
        }
      }
    }
    
    return {board};
  }
  
  rotateRight(matrix) {
    let result = [];
	
  	for (let c = 0; c < matrix.length; c++) {
	  	let row = [];
	  	for (let r = matrix.length - 1; r >= 0; r--) {
			  row.push(matrix[r][c]);
		  }
      result.push(row);
	  }
	
	  return result;
  }
  
  rotateLeft(matrix) {
  	let result = [];

    for (let c = matrix.length - 1; c >= 0; c--) {
      let row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.unshift(matrix[r][c]);
      }
      result.push(row);
    }

    return result;
  }
  
  checkForGameOver(board) {
    let moves = [
      this.boardMoved(board, this.moveUp(board).board),
      this.boardMoved(board, this.moveRight(board).board),
      this.boardMoved(board, this.moveDown(board).board),
      this.boardMoved(board, this.moveLeft(board).board)
    ];
      
    return (moves.includes(true)) ? false : true ;
  }
  
  componentWillMount() {
    this.initBoard();  
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  handleKeyDown(e) {
    const up = 38;
    const right = 39;
    const down = 40;
    const left = 37;

    

    if (e.keyCode === up) {
      this.move('up');
    } else if (e.keyCode === right) {
      this.move('right');
    } else if (e.keyCode === down) {
      this.move('down');
    } else if (e.keyCode === left) {
      this.move('left');
    }
  }
 
    
  render() {
    const history = this.state.history;
    
    const moves = history.map((step, move)=> {
      const desc = move ?
      'Przejdz do ruchu #' + move :
      'Przejdz na poczatek gry';
      return(
        <li key={move}>
        <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div>                        
        <table>
          {this.state.board.map((row, i) => (<Row key={i} row={row} />))}
        </table>    
        <p>{this.state.message}</p>
        <ol>{moves}</ol>
      </div>
    );
  }
};

ReactDOM.render(
<Game />, 
document.getElementById('root')
);